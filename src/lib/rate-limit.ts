/**
 * Lightweight in-memory fixed-window rate limiter for public form endpoints.
 *
 * This is per-process and resets on restart — adequate for a single-instance
 * VPS deployment behind Caddy. For multi-instance scaling, swap the store for
 * Redis. It is a defense-in-depth layer alongside the honeypot and validation.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Periodically evict stale buckets so the map cannot grow unbounded.
const CLEANUP_INTERVAL = 10 * 60 * 1000
let lastCleanup = Date.now()

const cleanup = (now: number) => {
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export const rateLimit = (
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult => {
  const now = Date.now()
  cleanup(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  }
}

/** Best-effort client IP from common proxy headers (Caddy sets X-Forwarded-For). */
export const getClientIp = (headers: Headers): string => {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip') || 'unknown'
}
