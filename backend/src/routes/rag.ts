import { Router, Request, Response } from "express";
import { z } from "zod";
import logger from "../lib/logger";
import { qdrant, COLLECTION_NAME } from "../lib/qdrant";

export const ragRouter = Router();

const ragSchema = z.object({
  query: z.string().min(1).max(500).trim(),
  limit: z.number().int().min(1).max(10).optional().default(5),
});

// Embed query text via OpenRouter embeddings (returns null if unavailable)
async function embed(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_URL || "https://rudraai.io",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: Array<{ embedding: number[] }> };
    return data.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

ragRouter.post("/search", async (req: Request, res: Response) => {
  const parsed = ragSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }

  if (!qdrant) {
    return res.status(503).json({ error: "Vector store not configured." });
  }

  const { query, limit } = parsed.data;

  const vector = await embed(query);
  if (!vector) {
    return res.status(503).json({ error: "Embedding service unavailable." });
  }

  try {
    const results = await qdrant.search(COLLECTION_NAME, {
      vector,
      limit,
      with_payload: true,
    });
    return res.json({ results });
  } catch (err) {
    logger.error({ err: (err as Error).message }, "Qdrant search failed");
    return res.status(500).json({ error: "Search failed." });
  }
});
