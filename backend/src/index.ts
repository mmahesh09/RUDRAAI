import * as Sentry from "@sentry/node";
import compression from "compression";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import logger from "./lib/logger";
import { contactRouter } from "./routes/contact";
import { bookingRouter } from "./routes/booking";
import { calRouter } from "./routes/cal";
import { chatRouter } from "./routes/chat";
import { newsletterRouter } from "./routes/newsletter";
import { ragRouter } from "./routes/rag";
import { chatwootRouter } from "./routes/chatwoot";
import { metricsRouter } from "./routes/metrics";
import { requireApiKey } from "./middleware/apiKey";
import {
  abuseGuard,
  globalLimiter,
  formLimiter,
  chatLimiter,
  internalLimiter,
} from "./middleware/rateLimit";
import { TRUST_PROXY_HOPS } from "./middleware/rateLimit/config";

dotenv.config();

// ── Startup email diagnostics ─────────────────────────────────────────────────
// Remove this block once emails are confirmed working.
(function runEmailStartupDiagnostics() {
  const apiKey  = process.env.RESEND_API_KEY;
  const from    = process.env.EMAIL_FROM;
  const to      = process.env.CONTACT_TO;
  const nodeEnv = process.env.NODE_ENV;

  const mask = (k: string | undefined) =>
    k ? `${k.slice(0, 8)}...${k.slice(-4)} (len=${k.length})` : "(MISSING)";

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║          EMAIL INFRASTRUCTURE STARTUP DIAGNOSTICS        ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  console.log("\n──── STEP 1: dotenv.config() loaded ────────────────────────");
  console.log("  NODE_ENV        :", nodeEnv ?? "(not set)");
  console.log("  cwd()           :", process.cwd());
  console.log("  Result          :", "dotenv.config() just executed above this block");

  console.log("\n──── STEP 2: RESEND_API_KEY ─────────────────────────────────");
  console.log("  Current         :", mask(apiKey));
  console.log("  Expected        : starts with 're_', length ≥ 30");
  if (!apiKey) {
    console.log("  Result          : ❌ FAIL — key is missing; emails will NOT be sent");
  } else if (!apiKey.startsWith("re_")) {
    console.log("  Result          : ❌ FAIL — key does not start with 're_'");
  } else {
    console.log("  Result          : ✅ PASS");
  }

  console.log("\n──── STEP 3: EMAIL_FROM ─────────────────────────────────────");
  console.log("  Current         :", from ?? "(not set — fallback: onboarding@resend.dev)");
  const domainMatch = from?.match(/@([^>\s]+)/);
  const fromDomain  = domainMatch ? domainMatch[1] : null;
  console.log("  Extracted domain:", fromDomain ?? "(could not extract)");
  console.log("  Expected        : Name <email@your-verified-domain.com>");
  if (!from) {
    console.log("  Result          : ⚠️  WARN — using fallback; only works in Resend test mode");
  } else if (!fromDomain) {
    console.log("  Result          : ❌ FAIL — EMAIL_FROM format is invalid");
  } else {
    console.log("  Result          : ✅ PASS — verify domain at https://resend.com/domains");
  }

  console.log("\n──── STEP 4: CONTACT_TO ─────────────────────────────────────");
  console.log("  Current         :", to ?? "(not set — owner notifications disabled)");
  if (!to) {
    console.log("  Result          : ⚠️  WARN — owner won't receive booking notifications");
  } else {
    console.log("  Result          : ✅ PASS");
  }

  console.log("\n──── STEP 5: Account / domain alignment check ───────────────");
  console.log("  ACTION REQUIRED : Log in to https://resend.com/api-keys");
  console.log("  Verify that the key", mask(apiKey));
  console.log("  belongs to the SAME account where domain '" + (fromDomain ?? "?") + "' is verified.");
  console.log("  'No sent emails yet' in the dashboard = wrong account or key.");

  console.log("\n╚══════════════════════════════════════════════════════════╝\n");
})();
// ── End startup diagnostics ───────────────────────────────────────────────────

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
}

const app = express();
const PORT = process.env.PORT || 4000;

// Behind Vercel/Render/Cloudflare we sit behind N proxies. Configuring the
// exact hop count makes req.ip trustworthy for per-IP rate limiting and stops
// clients spoofing X-Forwarded-For to dodge limits. Never use `true` (trust
// all) — that IS the spoofing hole.
app.set("trust proxy", TRUST_PROXY_HOPS);

app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
}));

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin = server-to-server, curl, health checks — always allow
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

// ── Rate limiting & abuse protection ──────────────────────────────────────────
// Redis-backed sliding-window limiting (falls back to in-memory when REDIS_URL
// is unset). abuseGuard runs first so blacklisted / temp-banned clients are
// rejected before we spend a store round-trip on them. See middleware/rateLimit.
app.use("/api/", abuseGuard, globalLimiter);
app.use("/api/contact", formLimiter);
app.use("/api/booking", formLimiter);
app.use("/api/newsletter", formLimiter);
app.use("/api/chat", chatLimiter);
app.use("/api/rag", internalLimiter);

// Chatwoot webhook must be mounted before express.json() so that its
// route-level express.raw() middleware can read the raw Buffer for HMAC verification.
app.use("/api/chatwoot", chatwootRouter);

// Body parsing for all other routes — keep limit tight
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

// Routes
app.use("/api/contact", contactRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/cal", calRouter);
app.use("/api/chat", chatRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/rag", requireApiKey, ragRouter);

// Health check — no sensitive data
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Prometheus scrape endpoint — API-key protected (reveals traffic/offenders)
app.use("/metrics", requireApiKey, metricsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Sentry error handler must come before the custom one
if (process.env.SENTRY_DSN) {
  app.use(Sentry.expressErrorHandler() as unknown as express.ErrorRequestHandler);
}

// Error handler — never leak stack traces or internal details
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err: err.message }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

// Skip HTTP server on Vercel (serverless uses the exported handler)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`RudraAI API running at http://localhost:${PORT}`);
  });
}

export default app;
