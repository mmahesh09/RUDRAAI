import { Router, Request, Response } from "express";
import client from "prom-client";
import { registry } from "../lib/metrics";
import { redis } from "../lib/redis";
import logger from "../lib/logger";

export const metricsRouter = Router();

/**
 * Bounded "top offending IPs" gauge. We refresh it from the Redis leaderboard
 * at scrape time and expose only the top 10 — keeping label cardinality safe
 * for Prometheus while still surfacing the worst abusers in Grafana.
 */
const topOffenders = new client.Gauge({
  name: "rudraai_ratelimit_top_offenders",
  help: "Block count for the top offending client IPs (refreshed at scrape)",
  labelNames: ["ip"] as const,
  registers: [registry],
});

/**
 * GET /metrics — Prometheus scrape endpoint.
 *
 * Protected by requireApiKey (mounted in index.ts) because metrics reveal
 * traffic shape and offender IPs. Prometheus is configured with the same
 * X-API-Key in its scrape_config `authorization`/`headers`.
 */
metricsRouter.get("/", async (_req: Request, res: Response) => {
  // Refresh the top-offenders gauge from Redis (best-effort).
  if (redis) {
    try {
      topOffenders.reset();
      const rows = await redis.zrevrange("rl:offenders", 0, 9, "WITHSCORES");
      for (let i = 0; i < rows.length; i += 2) {
        topOffenders.set({ ip: rows[i] }, Number(rows[i + 1]));
      }
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "Failed to refresh offender metrics");
    }
  }

  res.setHeader("Content-Type", registry.contentType);
  res.send(await registry.metrics());
});
