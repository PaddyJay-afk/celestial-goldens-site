import { describe, it, expect } from 'vitest'
import { collarColorToCss, formatDate, titleCase } from '@/lib/utils'
import { slugify } from '@/fields/slug'
import { rateLimit } from '@/lib/rate-limit'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Daisy × Cooper — Spring 2026')).toBe('daisy-cooper-spring-2026')
  })
  it('trims leading/trailing separators', () => {
    expect(slugify('  Hello World!  ')).toBe('hello-world')
  })
})

describe('collarColorToCss', () => {
  it('maps known colors', () => {
    expect(collarColorToCss('Green')).toBe('#6B7F5E')
    expect(collarColorToCss('pink collar')).toBe('#D98FA6')
  })
  it('falls back to gold for unknown', () => {
    expect(collarColorToCss('rainbow')).toBe('#BD8B3C')
    expect(collarColorToCss(null)).toBe('#BD8B3C')
  })
})

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-03-15T00:00:00.000Z')).toContain('2026')
  })
  it('returns empty for invalid input', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('titleCase', () => {
  it('humanizes slugs', () => {
    expect(titleCase('under-evaluation')).toBe('Under Evaluation')
  })
})

describe('rateLimit', () => {
  it('allows up to the limit then blocks', () => {
    const key = `test-${Math.random()}`
    const opts = { limit: 3, windowMs: 60_000 }
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    expect(rateLimit(key, opts).allowed).toBe(true)
    const blocked = rateLimit(key, opts)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })
})
