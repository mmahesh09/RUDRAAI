import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import logger from "../lib/logger";

/**
 * Protects non-user-facing routes (e.g. RAG search) with a shared API key.
 * Callers must send the header:  X-API-Key: <INTERNAL_API_KEY>
 *
 * When INTERNAL_API_KEY is not set the middleware is disabled so local dev
 * works without extra configuration — a warning is logged so operators notice.
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.INTERNAL_API_KEY;

  if (!secret) {
    logger.warn("INTERNAL_API_KEY not set; requireApiKey middleware is disabled");
    next();
    return;
  }

  const provided = req.headers["x-api-key"];

  if (typeof provided !== "string" || provided.length === 0) {
    logger.warn({ path: req.path }, "API key missing");
    res.status(401).json({ error: "API key required" });
    return;
  }

  const secretBuf = Buffer.from(secret, "utf-8");
  const providedBuf = Buffer.from(provided, "utf-8");

  // timingSafeEqual requires identical lengths — short-circuit first
  if (
    secretBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(secretBuf, providedBuf)
  ) {
    logger.warn({ path: req.path }, "API key invalid");
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  next();
}
