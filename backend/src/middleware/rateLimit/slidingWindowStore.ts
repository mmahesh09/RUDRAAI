import type { Store, Options, IncrementResponse } from "express-rate-limit";
import type Redis from "ioredis";
import { redisLatency } from "../../lib/metrics";
import logger from "../../lib/logger";

/**
 * A true **sliding-window** store for express-rate-limit backed by Redis.
 *
 * Why sliding window (vs the fixed-window counter that rate-limit-redis ships):
 * a fixed window lets a client send `max` requests at 0:59 and `max` again at
 * 1:00 — a 2× burst at the boundary. A sliding window counts only the requests
 * in the trailing `windowMs`, so the limit holds at every instant.
 *
 * Implementation: a Redis sorted set per identity, scored by request timestamp.
 * One atomic Lua script per request removes expired entries, records the new
 * one, and returns the live count — atomic so concurrent requests on a
 * horizontally-scaled fleet can't race past the limit.
 *
 * Fail-open: if Redis is unreachable we allow the request (and log/metric it).
 * For a public marketing API, availability beats perfect enforcement during an
 * outage — abuse protection degrades to the app still working.
 */
const SLIDING_WINDOW_LUA = `
local key    = KEYS[1]
local now    = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local member = ARGV[3]
-- drop entries older than the window
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
-- record this request
redis.call('ZADD', key, now, member)
-- expire the whole key once the window fully elapses (self-cleaning)
redis.call('PEXPIRE', key, window)
local count = redis.call('ZCARD', key)
-- oldest surviving timestamp drives an accurate Retry-After
local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
local resetAt = now + window
if oldest[2] then resetAt = tonumber(oldest[2]) + window end
return { count, resetAt }
`;

export class RedisSlidingWindowStore implements Store {
  /** express-rate-limit sets this via init(). */
  private windowMs = 60_000;
  prefix: string;
  /** Keys are global (not per-process) so counts are shared across instances. */
  localKeys = false;

  private counter = 0;

  constructor(private readonly redis: Redis, prefix = "rl:") {
    this.prefix = prefix;
  }

  init(options: Options): void {
    this.windowMs = options.windowMs;
  }

  private redisKey(key: string): string {
    return this.prefix + key;
  }

  /** Unique sorted-set member so simultaneous requests never collide on score. */
  private nextMember(now: number): string {
    this.counter = (this.counter + 1) % 1_000_000;
    return `${now}-${process.pid}-${this.counter}`;
  }

  async increment(key: string): Promise<IncrementResponse> {
    const now = Date.now();
    const endTimer = redisLatency.startTimer();
    try {
      const [count, resetAt] = (await this.redis.eval(
        SLIDING_WINDOW_LUA,
        1,
        this.redisKey(key),
        now,
        this.windowMs,
        this.nextMember(now)
      )) as [number, number];
      return { totalHits: count, resetTime: new Date(resetAt) };
    } catch (err) {
      // Fail open — never let a Redis blip 500 the whole API.
      logger.warn({ err: (err as Error).message }, "Rate-limit store failed; allowing request");
      return { totalHits: 1, resetTime: new Date(now + this.windowMs) };
    } finally {
      endTimer();
    }
  }

  async decrement(key: string): Promise<void> {
    // Used when skipSuccessful/FailedRequests is set: undo the newest entry.
    try {
      await this.redis.zpopmax(this.redisKey(key));
    } catch {
      /* fail open */
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      await this.redis.del(this.redisKey(key));
    } catch {
      /* fail open */
    }
  }
}
