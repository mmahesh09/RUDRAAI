import rateLimit, { type RateLimitInfo } from "express-rate-limit";
import type { Request, Response, NextFunction, RequestHandler } from "express";

/** express-rate-limit attaches this at runtime; typed locally to avoid relying
 *  on its global Express augmentation resolving under our tsconfig. */
type WithRateLimit = Request & { rateLimit?: RateLimitInfo };
import { redis } from "../../lib/redis";
import { recordRequest, blockedTotal } from "../../lib/metrics";
import { RULES, LISTS, type RuleName, type LimitRule } from "./config";
import { RedisSlidingWindowStore } from "./slidingWindowStore";
import { resolveIdentity, resolveIp } from "./ipResolver";
import { logBlocked } from "./logging";
import { registerOffense } from "./abuseGuard";

export interface LimiterOptions {
  /** Which named rule from config.RULES to enforce. */
  rule: RuleName;
  /** Message returned in the 429 JSON body. */
  message?: string;
  /** Extra skip predicate (e.g. skip /health on the global limiter). */
  skip?: (req: Request) => boolean;
}

/**
 * Builds a reusable rate-limit middleware for a named rule.
 *
 * Design decisions:
 *  - **Store**: Redis sliding-window when available, else express-rate-limit's
 *    in-memory store — so the app degrades gracefully with no config.
 *  - **Keying**: by resolved identity (API-key holder → hash, else IP), giving
 *    per-IP limits for anonymous traffic and per-"user" limits after auth.
 *  - **Per-route namespace**: each limiter owns a `rl:{rule}:` key prefix so
 *    a client's contact-form quota is independent of its chat quota.
 *  - **Retry-After**: always set from the live reset time (RFC-compliant 429).
 *  - **Burst/slow-down**: requests up to `burst` pass untouched; beyond it we
 *    add growing latency (back-pressure) instead of hard-blocking, and only
 *    hard-block at `max`. Legit users never feel it; abusers get slowed then
 *    banned (see registerOffense).
 */
export function createLimiter(opts: LimiterOptions): RequestHandler {
  const rule: LimitRule = RULES[opts.rule];
  const route = opts.rule;
  const message = opts.message ?? "Too many requests. Please try again later.";

  const store = redis ? new RedisSlidingWindowStore(redis, `rl:${route}:`) : undefined;

  const limiter = rateLimit({
    windowMs: rule.windowMs,
    limit: rule.max,
    standardHeaders: "draft-7", // RateLimit-* headers for clients/observability
    legacyHeaders: false,
    store,
    keyGenerator: (req) => resolveIdentity(req),
    skip: (req) => LISTS.allow.has(resolveIp(req)) || (opts.skip?.(req) ?? false),
    handler: (req: Request, res: Response) => {
      const info = (req as WithRateLimit).rateLimit;
      const retryAfterSec = info?.resetTime
        ? Math.max(1, Math.ceil((info.resetTime.getTime() - Date.now()) / 1000))
        : Math.ceil(rule.windowMs / 1000);

      recordRequest(route, true);
      blockedTotal.inc({ route, reason: "rate_limit" });
      logBlocked(req, { reason: "rate_limit", route, retryAfterSec });
      // Fire-and-forget: escalate repeat offenders toward a temporary ban.
      void registerOffense(req, route);

      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).json({ error: message, retryAfter: retryAfterSec });
    },
  });

  // Wrap so we can (a) count allowed requests and (b) apply burst back-pressure.
  return (req: Request, res: Response, next: NextFunction) => {
    limiter(req, res, (err?: unknown) => {
      if (err) return next(err as Error);
      // Reached here ⇒ request was allowed (the handler ends blocked requests).
      recordRequest(route, false);

      const info = (req as WithRateLimit).rateLimit;
      if (rule.burst && info && info.used > rule.burst) {
        // Progressive back-pressure past the burst headroom, capped at 2s.
        const over = info.used - rule.burst;
        const delayMs = Math.min(over * 100, 2_000);
        setTimeout(next, delayMs);
        return;
      }
      next();
    });
  };
}
