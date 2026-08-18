import { describe, it, expect } from 'vitest'
import { applicationSchema } from '@/lib/validation/application'
import { contactSchema } from '@/lib/validation/contact'

const validApplication = {
  applicantName: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-123-4567',
  cityState: 'Richmond, VA',
  householdMembers: 'Two adults',
  housingType: 'house',
  workSchedule: 'Work from home',
  priorExperience: 'Grew up with goldens',
  activityLevel: 'Active, daily walks',
  trainingPlan: 'Puppy classes',
  whyBreed: 'Family companion',
  desiredTiming: 'Spring 2026',
  agreement: true,
  contactConsent: true,
}

describe('applicationSchema', () => {
  it('accepts a complete, valid application', () => {
    const result = applicationSchema.safeParse(validApplication)
    expect(result.success).toBe(true)
  })

  it('rejects a missing required field', () => {
    const { whyBreed, ...rest } = validApplication
    void whyBreed
    const result = applicationSchema.safeParse(rest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.whyBreed).toBeTruthy()
    }
  })

  it('rejects an invalid email', () => {
    const result = applicationSchema.safeParse({ ...validApplication, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('requires agreement and consent to be true', () => {
    const result = applicationSchema.safeParse({ ...validApplication, agreement: false })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid housing type', () => {
    const result = applicationSchema.safeParse({ ...validApplication, housingType: 'castle' })
    expect(result.success).toBe(false)
  })

  it('parses a filled honeypot so the route can silently succeed', () => {
    const ok = applicationSchema.safeParse({ ...validApplication, website: '' })
    expect(ok.success).toBe(true)
    const filled = applicationSchema.safeParse({ ...validApplication, website: 'http://spam' })
    expect(filled.success).toBe(true)
    if (filled.success) expect(filled.data.website).toBe('http://spam')
  })
})

describe('contactSchema', () => {
  it('accepts a valid message', () => {
    const result = contactSchema.safeParse({
      name: 'Sam',
      email: 'sam@example.com',
      message: 'Hello, I have a question.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty message', () => {
    const result = contactSchema.safeParse({ name: 'Sam', email: 'sam@example.com', message: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a bad email', () => {
    const result = contactSchema.safeParse({ name: 'Sam', email: 'nope', message: 'Hi there' })
    expect(result.success).toBe(false)
  })

  it('parses a filled honeypot so the route can silently succeed', () => {
    const result = contactSchema.safeParse({
      name: 'Sam',
      email: 'sam@example.com',
      message: 'Hello, I have a question.',
      website: 'http://spam',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.website).toBe('http://spam')
  })
})
