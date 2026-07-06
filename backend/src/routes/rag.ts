import { Router, Request, Response } from "express";
import { z } from "zod";
import logger from "../lib/logger";
import { qdrant, COLLECTION_NAME, embedQuery } from "../lib/qdrant";

export const ragRouter = Router();

const ragSchema = z.object({
  query: z.string().min(1).max(500).trim(),
  limit: z.number().int().min(1).max(10).optional().default(5),
});

ragRouter.post("/search", async (req: Request, res: Response) => {
  const parsed = ragSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }

  if (!qdrant) {
    return res.status(503).json({ error: "Vector store not configured." });
  }

  const { query, limit } = parsed.data;

  const vector = await embedQuery(query);
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
