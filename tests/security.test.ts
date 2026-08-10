import { describe, expect, it } from 'vitest'
import { getClientIp, peekRateLimit, rateLimit } from '@/lib/rate-limit'
import { isHoneypotFilled } from '@/lib/validation/honeypot'

const headers = (init: Record<string, string>) => new Headers(init)

describe('getClientIp', () => {
  it('reads the proxy-appended entry, not the client-supplied one', () => {
    // A bot can send any X-Forwarded-For it likes; our proxy appends the real
    // peer on the right. Trusting the left-most entry would hand every request
    // a brand new rate-limit bucket.
    const ip = getClientIp(headers({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' }))
    expect(ip).toBe('203.0.113.9')
  })

  it('ignores a spoofed chain and keeps one identity for the real client', () => {
    const a = getClientIp(headers({ 'x-forwarded-for': '9.9.9.9, 203.0.113.9' }))
    const b = getClientIp(headers({ 'x-forwarded-for': '8.8.8.8, 203.0.113.9' }))
    expect(a).toBe(b)
  })

  it('handles a single-entry header from a replacing proxy', () => {
    expect(getClientIp(headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9')
  })

  it('falls back to x-real-ip, then to a constant', () => {
    expect(getClientIp(headers({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7')
    expect(getClientIp(headers({}))).toBe('unknown')
  })
})

describe('rateLimit', () => {
  it('blocks once the limit is reached', () => {
    const key = `test:${Math.random()}`
    const opts = { limit: 3, windowMs: 60_000 }
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    const blocked = rateLimit(key, opts)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('keeps separate keys independent', () => {
    const opts = { limit: 1, windowMs: 60_000 }
    const a = `test:a:${Math.random()}`
    const b = `test:b:${Math.random()}`
    expect(rateLimit(a, opts).allowed).toBe(true)
    expect(rateLimit(a, opts).allowed).toBe(false)
    expect(rateLimit(b, opts).allowed).toBe(true)
  })
})

describe('peekRateLimit', () => {
  it('does not spend from the bucket', () => {
    const key = `test:peek:${Math.random()}`
    const opts = { limit: 2, windowMs: 60_000 }
    // Peeking repeatedly must not exhaust the quota — a visitor who mistypes a
    // field several times should still be able to submit the form.
    expect(peekRateLimit(key, opts).allowed).toBe(true)
    expect(peekRateLimit(key, opts).allowed).toBe(true)
    expect(peekRateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(peekRateLimit(key, opts).allowed).toBe(false)
  })
})

describe('isHoneypotFilled', () => {
  it('passes real submissions through', () => {
    expect(isHoneypotFilled({ name: 'Sam' })).toBe(false)
    expect(isHoneypotFilled({ website: '' })).toBe(false)
    expect(isHoneypotFilled({ website: '   ' })).toBe(false)
    expect(isHoneypotFilled({ website: null })).toBe(false)
  })

  it('catches a filled trap, including non-string values', () => {
    expect(isHoneypotFilled({ website: 'http://spam.example' })).toBe(true)
    expect(isHoneypotFilled({ website: ['a'] })).toBe(true)
    expect(isHoneypotFilled({ website: 1 })).toBe(true)
  })

  it('tolerates malformed bodies', () => {
    expect(isHoneypotFilled(null)).toBe(false)
    expect(isHoneypotFilled('string body')).toBe(false)
    expect(isHoneypotFilled(undefined)).toBe(false)
  })
})
