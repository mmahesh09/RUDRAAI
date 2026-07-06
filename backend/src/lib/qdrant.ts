import { QdrantClient } from "@qdrant/js-client-rest";

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;

export const qdrant: QdrantClient | null = url
  ? new QdrantClient({ url, apiKey })
  : null;

export const COLLECTION_NAME = "rudraai_knowledge";

/** Embed a single query string via OpenRouter (returns null on any failure) */
export async function embedQuery(text: string): Promise<number[] | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_URL || "https://rudraai.online",
      },
      body: JSON.stringify({ model: "openai/text-embedding-3-small", input: text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: Array<{ embedding: number[] }> };
    return data.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

/** Search Qdrant for the top-k most relevant chunks for a query (returns [] on failure) */
export async function searchKnowledge(query: string, topK = 4): Promise<string[]> {
  if (!qdrant) return [];
  const vector = await embedQuery(query);
  if (!vector) return [];
  try {
    const results = await qdrant.search(COLLECTION_NAME, {
      vector,
      limit: topK,
      with_payload: true,
      score_threshold: 0.35,
    });
    return results
      .map((r) => (r.payload?.text as string | undefined) ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}
