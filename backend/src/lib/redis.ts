import Redis from "ioredis";
import logger from "./logger";

/**
 * Shared Redis connection for rate limiting, abuse tracking and metrics.
 *
 * Null when REDIS_URL is absent — every caller MUST guard with `if (redis)`.
 * This mirrors the qdrant/supabase convention so the app boots without Redis
 * (e.g. the Vercel serverless deploy) and degrades to in-memory limiting.
 *
 * Connection notes:
 *  - lazyConnect: we connect on first command, not at import time, so a bad
 *    REDIS_URL never crashes startup — it surfaces as command errors instead.
 *  - maxRetriesPerRequest is bounded so a Redis outage fails fast and lets the
 *    limiter fall back to memory rather than hanging every request.
 *  - enableOfflineQueue:false — while disconnected, commands reject immediately
 *    instead of queueing unbounded (back-pressure protection).
 */
const url = process.env.REDIS_URL;

export const redis: Redis | null = url
  ? new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      connectTimeout: 5_000,
      // ioredis reconnects automatically; back off up to 2s between attempts.
      retryStrategy: (times) => Math.min(times * 200, 2_000),
    })
  : null;

if (redis) {
  redis.on("error", (err) => {
    // Do not throw — limiters catch and fall back to memory. Just record it.
    logger.warn({ err: err.message }, "Redis error (rate limiting will fall back to memory)");
  });
  redis.on("connect", () => logger.info("Redis connected (rate limiting)"));
  redis.on("reconnecting", () => logger.warn("Redis reconnecting"));

  // Kick off the initial connection without blocking module load.
  redis.connect().catch((err) => {
    logger.warn({ err: err.message }, "Initial Redis connection failed; using in-memory limiting");
  });
} else {
  logger.warn("REDIS_URL not set — rate limiting uses in-memory store (not safe across instances)");
}

/** True when a live Redis connection is usable for atomic operations. */
export function redisReady(): boolean {
  return !!redis && redis.status === "ready";
}
