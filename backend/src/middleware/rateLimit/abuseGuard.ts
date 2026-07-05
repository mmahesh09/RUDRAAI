import type { Request, Response, NextFunction } from "express";
import { redis } from "../../lib/redis";
import { blockedTotal, bansTotal } from "../../lib/metrics";
import { ABUSE, LISTS } from "./config";
import { resolveIdentity, resolveIp } from "./ipResolver";
import { logBlocked } from "./logging";

const BAN_KEY = (id: string) => `ban:${id}`;
const OFFENSE_KEY = (id: string) => `offense:${id}`;
const BANLEVEL_KEY = (id: string) => `banlevel:${id}`;
const OFFENDERS_ZSET = "rl:offenders";

/**
 * Pluggable bot-detection hook. Returns true for obviously non-human clients.
 * Kept intentionally conservative (empty/script UAs) so real browsers and known
 * good crawlers are never penalised — extend this for a real bot-management
 * integration (e.g. Cloudflare Bot Score header) without touching the limiters.
 */
export function isSuspectedBot(req: Request): boolean {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  if (!ua) return true; // no UA at all is a strong bot signal
  return /(curl|wget|python-requests|go-http-client|libwww|scrapy|httpclient)\b/.test(ua);
}

/**
 * Front-line guard mounted BEFORE the rate limiters. Order of checks:
 *   1. Static whitelist  → bypass all limiting (health checkers, monitoring).
 *   2. Static blacklist   → hard 403, cheapest possible rejection.
 *   3. Active temp-ban    → 429 with Retry-After from the remaining ban TTL.
 * Everything else falls through to the normal limiters.
 *
 * Running this first means banned/blacklisted clients are rejected before we
 * spend a sliding-window Redis round-trip on them (DoS cost-control).
 */
export async function abuseGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ip = resolveIp(req);

  if (LISTS.allow.has(ip)) {
    next();
    return;
  }

  if (LISTS.deny.has(ip)) {
    blockedTotal.inc({ route: "guard", reason: "blacklist" });
    logBlocked(req, { reason: "blacklist", route: "guard", retryAfterSec: 0 });
    res.status(403).json({ error: "Forbidden." });
    return;
  }

  // Temp-ban check (skips cleanly when Redis is down — fail open).
  if (redis) {
    const id = resolveIdentity(req);
    try {
      const ttlMs = await redis.pttl(BAN_KEY(id));
      if (ttlMs > 0) {
        const retryAfterSec = Math.ceil(ttlMs / 1000);
        blockedTotal.inc({ route: "guard", reason: "temp_ban" });
        logBlocked(req, { reason: "temp_ban", route: "guard", retryAfterSec });
        res.setHeader("Retry-After", String(retryAfterSec));
        res.status(429).json({
          error: "Too many requests. You are temporarily blocked.",
          retryAfter: retryAfterSec,
        });
        return;
      }
    } catch {
      /* fail open */
    }
  }

  next();
}

/**
 * Records a 429 against a client and escalates to a temporary ban once repeat
 * offenses cross the threshold. Progressive penalty: each ban doubles the
 * previous duration (baseBanMs · 2^level), capped at maxBanMs — so persistent
 * abusers get exponentially longer cooldowns while a one-off spike (which never
 * crosses the threshold) costs a legitimate user nothing.
 *
 * Called fire-and-forget from the limiter handler; safe no-op without Redis.
 */
export async function registerOffense(req: Request, route: string): Promise<void> {
  if (!redis) return;
  const id = resolveIdentity(req);
  const ip = resolveIp(req);

  try {
    // Track offenders leaderboard for the metrics/ops view ("top offending IPs").
    await redis.zincrby(OFFENDERS_ZSET, 1, ip);
    await redis.pexpire(OFFENDERS_ZSET, ABUSE.offenseWindowMs);

    // Count offenses inside the rolling window.
    const offenses = await redis.incr(OFFENSE_KEY(id));
    if (offenses === 1) {
      await redis.pexpire(OFFENSE_KEY(id), ABUSE.offenseWindowMs);
    }

    if (offenses < ABUSE.banThreshold) return;

    // Escalate: bump the persistent ban level and derive the cooldown.
    const level = await redis.incr(BANLEVEL_KEY(id));
    await redis.pexpire(BANLEVEL_KEY(id), ABUSE.maxBanMs);
    const banMs = Math.min(ABUSE.baseBanMs * 2 ** (level - 1), ABUSE.maxBanMs);

    await redis.set(BAN_KEY(id), String(level), "PX", banMs);
    // Reset the offense counter so the next window starts clean post-ban.
    await redis.del(OFFENSE_KEY(id));

    bansTotal.inc({ level: String(level) });
  } catch {
    /* fail open — never let ban bookkeeping break the request path */
  }
}
