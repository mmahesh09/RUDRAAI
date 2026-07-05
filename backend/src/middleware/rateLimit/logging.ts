import type { Request } from "express";
import logger from "../../lib/logger";
import { resolveIp, resolveIdentity } from "./ipResolver";

/** Fields captured for every blocked request. */
export interface BlockMeta {
  /** Why the request was blocked. */
  reason: "rate_limit" | "temp_ban" | "blacklist";
  /** Named route/limiter that triggered the block. */
  route: string;
  /** Seconds until the client may retry (mirrors the Retry-After header). */
  retryAfterSec: number;
}

/**
 * Emits one structured log line per blocked request via pino (the app's
 * production logger). We deliberately log the client IP and a hashed identity
 * but NEVER the request body, headers with secrets, or the raw API key —
 * identities are already SHA-256 hashed upstream (see ipResolver.apiKeyId).
 *
 * pino serialises to JSON in production, so these lines are drop-in for
 * Loki/Elasticsearch/Datadog ingestion and alerting.
 */
export function logBlocked(req: Request, meta: BlockMeta): void {
  logger.warn(
    {
      event: "rate_limit_block",
      // `time` is added by pino automatically (the required timestamp).
      ip: resolveIp(req),
      identity: resolveIdentity(req), // hashed for API-key holders, IP otherwise
      route: meta.route,
      method: req.method,
      path: req.path,
      userAgent: req.headers["user-agent"] || "unknown",
      reason: meta.reason,
      retryAfterSec: meta.retryAfterSec,
    },
    "rate limit exceeded"
  );
}
