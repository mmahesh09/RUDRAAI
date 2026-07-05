import client from "prom-client";

/**
 * Prometheus metrics registry for rate limiting + abuse protection.
 *
 * Scraped by Prometheus at GET /metrics (see routes/metrics.ts) and graphed in
 * Grafana. Default Node.js process metrics (CPU, heap, event-loop lag) are
 * collected too so one dashboard covers app health + limiter behaviour.
 *
 * Label cardinality is kept low on purpose: we label by `route` and `scope`
 * (bounded sets) but NEVER by raw IP — high-cardinality labels blow up
 * Prometheus. Per-IP offender ranking lives in Redis instead (see abuseGuard).
 */
export const registry = new client.Registry();

client.collectDefaultMetrics({ register: registry, prefix: "rudraai_" });

/** Total requests seen by any rate limiter, partitioned by route + outcome. */
export const requestsTotal = new client.Counter({
  name: "rudraai_ratelimit_requests_total",
  help: "Requests processed by the rate limiter",
  labelNames: ["route", "outcome"] as const, // outcome: allowed | blocked
  registers: [registry],
});

/** Requests rejected with 429, partitioned by route + reason. */
export const blockedTotal = new client.Counter({
  name: "rudraai_ratelimit_blocked_total",
  help: "Requests blocked by the rate limiter",
  labelNames: ["route", "reason"] as const, // reason: rate_limit | temp_ban | blacklist
  registers: [registry],
});

/** Latency of the Redis sliding-window check — watch for store hot spots. */
export const redisLatency = new client.Histogram({
  name: "rudraai_ratelimit_redis_seconds",
  help: "Latency of the Redis rate-limit operation in seconds",
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [registry],
});

/** Temporary bans issued, partitioned by escalating penalty level. */
export const bansTotal = new client.Counter({
  name: "rudraai_ratelimit_bans_total",
  help: "Temporary bans issued to abusive clients",
  labelNames: ["level"] as const,
  registers: [registry],
});

/** Records a limiter decision on the Prometheus request counter. */
export function recordRequest(route: string, blocked: boolean): void {
  requestsTotal.inc({ route, outcome: blocked ? "blocked" : "allowed" });
}
