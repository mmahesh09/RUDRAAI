/**
 * Ingestion script: reads all .md files in backend/knowledge/, chunks them,
 * embeds via OpenRouter, and upserts into Qdrant "rudraai_knowledge" collection.
 *
 * Run: npm run ingest
 * Re-run whenever you update the knowledge/ files to keep the chatbot current.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

// Load .env before reading process.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const COLLECTION_NAME = "rudraai_knowledge";
const EMBEDDING_DIM = 1536; // text-embedding-3-small
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;

// ── Helpers ──────────────────────────────────────────────────────────────────

function chunkText(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end).trim());
    start += size - overlap;
  }
  return chunks.filter((c) => c.length > 30);
}

async function embed(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: texts,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API error ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = (await res.json()) as { data: Array<{ embedding: number[]; index: number }> };
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!QDRANT_URL) {
    console.error("❌  QDRANT_URL is not set in .env");
    console.error("   1. Create a free cluster at https://cloud.qdrant.io");
    console.error("   2. Copy the cluster URL and API key into backend/.env");
    process.exit(1);
  }
  if (!OPENROUTER_API_KEY) {
    console.error("❌  OPENROUTER_API_KEY is not set in .env");
    process.exit(1);
  }

  const qdrant = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY });
  const knowledgeDir = path.join(__dirname, "../knowledge");

  const mdFiles = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));
  if (mdFiles.length === 0) {
    console.error("❌  No .md files found in knowledge/");
    process.exit(1);
  }

  console.log(`📚  Found ${mdFiles.length} knowledge files: ${mdFiles.join(", ")}`);

  // Build all chunks with metadata
  const allChunks: Array<{ text: string; source: string; chunkIndex: number }> = [];
  for (const file of mdFiles) {
    const content = fs.readFileSync(path.join(knowledgeDir, file), "utf-8");
    const chunks = chunkText(content);
    for (let i = 0; i < chunks.length; i++) {
      allChunks.push({ text: chunks[i], source: file.replace(".md", ""), chunkIndex: i });
    }
    console.log(`  📄  ${file} → ${chunks.length} chunks`);
  }
  console.log(`\n🔢  Total chunks to embed: ${allChunks.length}`);

  // Recreate collection for a clean ingest
  const { collections } = await qdrant.getCollections();
  if (collections.some((c) => c.name === COLLECTION_NAME)) {
    console.log(`🗑   Dropping existing collection for fresh ingest...`);
    await qdrant.deleteCollection(COLLECTION_NAME);
  }
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
  console.log(`✅  Collection "${COLLECTION_NAME}" ready.\n`);

  // Embed in batches of 20
  const BATCH = 20;
  const points: Array<{ id: number; vector: number[]; payload: Record<string, unknown> }> = [];

  for (let i = 0; i < allChunks.length; i += BATCH) {
    const batch = allChunks.slice(i, i + BATCH);
    process.stdout.write(`  🔄  Embedding chunks ${i + 1}–${Math.min(i + BATCH, allChunks.length)}...`);
    const vectors = await embed(batch.map((c) => c.text));
    for (let j = 0; j < batch.length; j++) {
      points.push({
        id: i + j,
        vector: vectors[j],
        payload: {
          text: batch[j].text,
          source: batch[j].source,
          chunkIndex: batch[j].chunkIndex,
        },
      });
    }
    process.stdout.write(" ✅\n");
    if (i + BATCH < allChunks.length) await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n📤  Upserting ${points.length} points into Qdrant...`);
  await qdrant.upsert(COLLECTION_NAME, { wait: true, points });

  console.log(`\n🎉  Done! ${points.length} chunks ingested.`);
  console.log('   Re-run "npm run ingest" whenever you update knowledge/ files.\n');
}

main().catch((err: Error) => {
  console.error("❌  Ingestion failed:", err.message);
  process.exit(1);
});
