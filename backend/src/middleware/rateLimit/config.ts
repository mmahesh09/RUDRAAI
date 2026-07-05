/**
 * Central, environment-driven configuration for rate limiting.
 *
 * Everything tunable in production lives here and is overridable via env vars
 * so limits can change without a redeploy of logic. Defaults are safe for a
 * public marketing API. Windows are in milliseconds.
 */

/** Parse an int env var with a fallback, ignoring blanks/garbage. */
function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Parse a comma-separated env var into a trimmed, de-duplicated string set. */
export function envSet(name: string): Set<string> {
  return new Set(
    (process.env[name] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

/** A single named limit rule. `max` requests per `windowMs`. */
export interface LimitRule {
  windowMs: number;
  max: number;
  /** How many requests may burst before the sliding window fully applies. */
  burst?: number;
}

/**
 * Named limit rules. Add a new entry here and reference it from a route —
 * that is the only change needed to introduce a new limited surface.
 */
export const RULES = {
  /** Broad ceiling applied to every /api route as a backstop. */
  global: { windowMs: 15 * MIN, max: envInt("RL_GLOBAL_MAX", 100), burst: 20 },
  /** Form POSTs (contact, booking, newsletter) — abuse-prone, low legit rate. */
  form: { windowMs: HOUR, max: envInt("RL_FORM_MAX", 5) },
  /** AI chat — costs money per call, so tighter than global. */
  chat: { windowMs: 15 * MIN, max: envInt("RL_CHAT_MAX", 20), burst: 5 },
  /** Internal RAG search (X-API-Key holders) — generous, still bounded. */
  internal: { windowMs: MIN, max: envInt("RL_INTERNAL_MAX", 120) },
} satisfies Record<string, LimitRule>;

export type RuleName = keyof typeof RULES;

/** Progressive-penalty tuning for repeat offenders (see abuseGuard). */
export const ABUSE = {
  /** Sliding window over which repeat 429s are counted toward a ban. */
  offenseWindowMs: envInt("RL_OFFENSE_WINDOW_MS", HOUR),
  /** Offenses within the window before the first temporary ban. */
  banThreshold: envInt("RL_BAN_THRESHOLD", 3),
  /** Base ban duration; each subsequent ban multiplies this (exponential). */
  baseBanMs: envInt("RL_BASE_BAN_MS", 5 * MIN),
  /** Hard cap so a ban can never exceed this (avoids permanent lockout). */
  maxBanMs: envInt("RL_MAX_BAN_MS", 24 * HOUR),
} as const;

/** Static allow/deny lists sourced from env (comma-separated IPs). */
export const LISTS = {
  allow: envSet("RL_WHITELIST_IPS"),
  deny: envSet("RL_BLACKLIST_IPS"),
} as const;

/** Trust-proxy hop count (Vercel/Render put us behind 1 proxy by default). */
export const TRUST_PROXY_HOPS = envInt("TRUST_PROXY_HOPS", 1);
