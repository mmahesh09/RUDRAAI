import type { Request } from "express";
import crypto from "crypto";

/**
 * Resolves a trustworthy client identifier for rate limiting.
 *
 * Threat model: an attacker can spoof `X-Forwarded-For` / `CF-Connecting-IP`
 * to dodge per-IP limits or frame another IP. We defend by only trusting
 * forwarded headers when Express `trust proxy` is configured (set in index.ts),
 * which makes Express parse XFF from the RIGHT — taking the hop our own proxy
 * appended, not attacker-controlled leftmost entries.
 *
 * Precedence:
 *   1. Cloudflare's `CF-Connecting-IP` — only honoured behind a trusted proxy,
 *      because Cloudflare strips/overwrites any client-supplied copy.
 *   2. `req.ip` — Express's proxy-aware, spoof-resistant value.
 *   3. Socket remote address — last resort.
 */
export function resolveIp(req: Request): string {
  const trustsProxy = req.app.get("trust proxy") !== false;

  if (trustsProxy) {
    const cf = req.headers["cf-connecting-ip"];
    if (typeof cf === "string" && cf.length > 0) {
      return normalizeIp(cf.trim());
    }
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return normalizeIp(ip);
}

/**
 * Normalizes an IP for stable keying:
 *  - strips the IPv4-mapped IPv6 prefix (`::ffff:1.2.3.4` → `1.2.3.4`)
 *  - lowercases IPv6 and collapses to a /64 network so a single client rotating
 *    addresses inside its allocation can't trivially multiply its quota.
 */
export function normalizeIp(raw: string): string {
  let ip = raw.trim().toLowerCase();

  // IPv4-mapped IPv6
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);

  // Bare IPv4 — return as-is
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return ip;

  // IPv6 — group to /64 (first 4 hextets) to resist rotation within a subnet
  if (ip.includes(":")) {
    const hextets = ip.split(":");
    if (hextets.length >= 4) return hextets.slice(0, 4).join(":") + "::/64";
    return ip;
  }

  return ip;
}

/**
 * Stable, non-reversible identifier for an X-API-Key holder ("per-user" limit).
 * We hash so raw secrets never land in Redis keys, logs, or metrics.
 */
export function apiKeyId(key: string): string {
  return "key:" + crypto.createHash("sha256").update(key).digest("hex").slice(0, 16);
}

/**
 * Constant-time check that the request carries the VALID internal API key.
 *
 * Critical: rate-limit identity must only be granted to a *verified* key. If we
 * keyed by any X-API-Key header value, an attacker could send a random key per
 * request to mint unlimited buckets and bypass per-IP limits entirely. Returns
 * false when INTERNAL_API_KEY is unset (dev) so everyone is keyed by IP.
 */
export function isValidApiKey(req: Request): boolean {
  const secret = process.env.INTERNAL_API_KEY;
  if (!secret) return false;

  const provided = req.headers["x-api-key"];
  if (typeof provided !== "string" || provided.length === 0) return false;

  const a = Buffer.from(secret, "utf-8");
  const b = Buffer.from(provided, "utf-8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * The identity a limiter buckets by: the authenticated API-key holder when the
 * key is VALID, otherwise the client IP. This is the "per-IP → per-user after
 * authentication" upgrade the spec calls for, adapted to RudraAI's only
 * credential (the internal X-API-Key). Unverified keys fall back to IP so the
 * header cannot be used to escape per-IP limiting.
 */
export function resolveIdentity(req: Request): string {
  if (isValidApiKey(req)) {
    return apiKeyId(req.headers["x-api-key"] as string);
  }
  return resolveIp(req);
}
