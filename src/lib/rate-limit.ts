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
// Hard ceiling on tracked keys, so a flood of distinct keys cannot grow the
// map without bound between cleanups.
const MAX_BUCKETS = 20_000
let lastCleanup = Date.now()

const cleanup = (now: number) => {
  const overCapacity = buckets.size > MAX_BUCKETS
  if (!overCapacity && now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
  // Still over capacity after evicting expired entries: drop oldest-inserted
  // keys (Map preserves insertion order) to keep memory flat.
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS
    let dropped = 0
    for (const key of buckets.keys()) {
      buckets.delete(key)
      if (++dropped >= excess) break
    }
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

/**
 * Check a bucket **without** spending from it.
 *
 * Public forms pair this with `rateLimit`: the quota is checked up front but
 * only charged once a submission is actually stored. A visitor who mistypes
 * their email five times is corrected, not locked out — only real submissions
 * count against them.
 */
export const peekRateLimit = (
  key: string,
  { limit = 5 }: { limit?: number } = {},
): RateLimitResult => {
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
  }
  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }
  return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 }
}

/**
 * Number of trusted reverse proxies in front of the app. Caddy (see Caddyfile)
 * is hop 1. Put another proxy in front (Cloudflare, a load balancer) and raise
 * this to match, otherwise that proxy's IP becomes everyone's rate-limit key.
 */
const TRUSTED_PROXY_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS || 1))

/**
 * Client IP for rate-limiting purposes.
 *
 * `X-Forwarded-For` is client-settable, and proxies generally *append* to it,
 * so the left-most entry is whatever the caller claimed. Reading it would let a
 * bot mint a fresh rate-limit bucket per request just by varying the header.
 * Only the right-most entries are written by proxies we control, so we count
 * TRUSTED_PROXY_HOPS in from the right.
 *
 * In the shipped stack Caddy already discards a forged header (it replaces
 * X-Forwarded-For with the real peer address whenever no `trusted_proxies` is
 * configured), and Docker never publishes the app's port, so the proxy is the
 * only way in. This function is the second line of defence: it keeps the app
 * correct if it is ever reached directly, and it stays correct when a proxy is
 * put in front and TRUSTED_PROXY_HOPS is raised to match.
 */
export const getClientIp = (headers: Headers): string => {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const hops = forwarded
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean)
    const ip = hops[hops.length - TRUSTED_PROXY_HOPS]
    if (ip) return ip
  }
  return headers.get('x-real-ip') || 'unknown'
}
