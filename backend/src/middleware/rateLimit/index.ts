/**
 * Rate-limiting module — public surface.
 *
 * Usage in the app:
 *   app.use("/api", abuseGuard, globalLimiter);
 *   app.use("/api/contact", formLimiter);
 *
 * To add a new limited route: add a rule to config.RULES, export a limiter
 * here, mount it. Nothing else changes.
 */
import { createLimiter } from "./createLimiter";
import { isValidApiKey } from "./ipResolver";

/**
 * Backstop applied to every /api route. Skips the health probe and any request
 * bearing a VALID X-API-Key — authenticated internal callers are governed by
 * the (more generous) internalLimiter instead of this anonymous backstop. Note:
 * the key must be *valid* (not merely present) or the header would be a bypass.
 */
export const globalLimiter = createLimiter({
  rule: "global",
  message: "Too many requests. Please slow down.",
  skip: (req) => req.path === "/health" || isValidApiKey(req),
});

/** Strict limit for abuse-prone form POSTs (contact, booking, newsletter). */
export const formLimiter = createLimiter({
  rule: "form",
  message: "Too many submissions. Please try again in an hour.",
});

/** Tighter limit for the paid AI chat endpoint. */
export const chatLimiter = createLimiter({
  rule: "chat",
  message: "Too many chat messages. Please wait a moment.",
});

/** Generous limit for authenticated internal callers (X-API-Key / RAG). */
export const internalLimiter = createLimiter({
  rule: "internal",
  message: "Rate limit exceeded for API key.",
});

export { abuseGuard, registerOffense, isSuspectedBot } from "./abuseGuard";
export { registry } from "../../lib/metrics";
export { RULES, ABUSE, LISTS } from "./config";
