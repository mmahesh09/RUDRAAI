import * as Sentry from "@sentry/node";
import compression from "compression";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import logger from "./lib/logger";
import { contactRouter } from "./routes/contact";
import { bookingRouter } from "./routes/booking";
import { calRouter } from "./routes/cal";
import { chatRouter } from "./routes/chat";
import { newsletterRouter } from "./routes/newsletter";
import { ragRouter } from "./routes/rag";
import { chatwootRouter } from "./routes/chatwoot";
import { requireApiKey } from "./middleware/apiKey";

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
}

const app = express();
const PORT = process.env.PORT || 4000;

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
      if (!origin) {
        // Allow no-origin in dev (curl, Postman); reject in production
        if (process.env.NODE_ENV !== "production") return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

// Global rate limit: 30 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
  skip: (req) => req.path === "/health",
});

// Stricter limit for form submissions: 5 per hour per IP
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions from this IP. Please try again in an hour." },
});

// Chat: tighter limit — 20 messages per 15 min per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many chat messages. Please wait a moment." },
});

app.use("/api/", globalLimiter);
app.use("/api/contact", formLimiter);
app.use("/api/booking", formLimiter);
app.use("/api/newsletter", formLimiter);
app.use("/api/chat", chatLimiter);

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

app.listen(PORT, () => {
  logger.info(`RudraAI API running at http://localhost:${PORT}`);
});

export default app;
