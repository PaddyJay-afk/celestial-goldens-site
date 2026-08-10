import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { applicationSchema } from '@/lib/validation/application'
import { isHoneypotFilled } from '@/lib/validation/honeypot'
import { getClientIp, peekRateLimit, rateLimit } from '@/lib/rate-limit'
import { sendEmail, renderRows } from '@/lib/email'
import { smtp } from '@/lib/env'
import { serverUrl } from '@/lib/env'

const WINDOW_MS = 30 * 60_000
const MAX_APPLICATIONS = 4
// Generous ceiling on raw requests, so a bot cannot hammer the endpoint even
// though failed attempts don't count against the submission quota below.
const MAX_ATTEMPTS = 40

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)

  const attempts = rateLimit(`apply:attempt:${ip}`, {
    limit: MAX_ATTEMPTS,
    windowMs: WINDOW_MS,
  })
  // The application form is long; a family may need several tries to get every
  // field right. Only *stored* applications count toward the quota.
  const quota = peekRateLimit(`apply:${ip}`, { limit: MAX_APPLICATIONS })
  if (!attempts.allowed || !quota.allowed) {
    const retryAfter = Math.max(attempts.retryAfterSeconds, quota.retryAfterSeconds)
    return NextResponse.json(
      { ok: false, message: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot tripped — answer exactly like a success and store nothing, so the
  // bot cannot tell the trap from a real submission. Checked before validation
  // so the response never names the honeypot field.
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ ok: true })
  }

  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const d = parsed.data

  try {
    const payload = await getPayload({ config })

    // Optionally link to a specific puppy by slug.
    let puppyId: number | undefined
    const puppySlug = typeof (body as Record<string, unknown>)?.puppy === 'string'
      ? ((body as Record<string, unknown>).puppy as string)
      : undefined
    if (puppySlug) {
      const res = await payload.find({
        collection: 'puppies',
        where: { slug: { equals: puppySlug } },
        limit: 1,
        overrideAccess: true,
      })
      if (res.docs[0]) puppyId = res.docs[0].id
    }

    await payload.create({
      collection: 'applications',
      data: {
        applicantName: d.applicantName,
        email: d.email,
        phone: d.phone,
        cityState: d.cityState,
        householdMembers: d.householdMembers,
        children: d.children || undefined,
        otherPets: d.otherPets || undefined,
        housingType: d.housingType,
        yardFence: (d.yardFence || undefined) as 'fenced' | 'unfenced' | 'none' | undefined,
        workSchedule: d.workSchedule,
        priorExperience: d.priorExperience,
        vetReference: d.vetReference || undefined,
        activityLevel: d.activityLevel,
        trainingPlan: d.trainingPlan,
        whyBreed: d.whyBreed,
        desiredTiming: d.desiredTiming,
        sexPreference: (d.sexPreference || undefined) as 'either' | 'male' | 'female' | undefined,
        agreement: d.agreement,
        contactConsent: d.contactConsent,
        puppy: puppyId,
        status: 'new',
      },
      overrideAccess: true,
    })

    // Charge the submission quota only now that an application was stored.
    rateLimit(`apply:${ip}`, { limit: MAX_APPLICATIONS, windowMs: WINDOW_MS })

    // Notify the breeder.
    if (smtp.toBreeder) {
      await sendEmail({
        to: smtp.toBreeder,
        replyTo: d.email,
        subject: `New puppy application — ${d.applicantName}`,
        text: `New application from ${d.applicantName} (${d.email}, ${d.phone}). Review it in the admin dashboard: ${serverUrl}/admin`,
        html: `<h2>New puppy application</h2><table>${renderRows([
          ['Name', d.applicantName],
          ['Email', d.email],
          ['Phone', d.phone],
          ['Location', d.cityState],
          ['Desired timing', d.desiredTiming],
          ['Sex preference', d.sexPreference],
        ])}</table><p style="margin-top:12px"><a href="${serverUrl}/admin">Review in dashboard →</a></p>`,
      })
    }

    // Confirmation to the applicant.
    await sendEmail({
      to: d.email,
      subject: 'We received your puppy application',
      text: `Hi ${d.applicantName},\n\nThank you for your application — I read every one myself. The next step is a phone call between us; after that, I'll tell you whether you've been approved.\n\nWarmly,\nPamela\nCelestial English Golden Retrievers`,
      html: `<p>Hi ${d.applicantName.replace(/</g, '&lt;')},</p><p>Thank you for your application — I read every one myself. The next step is a phone call between us; after that, I&rsquo;ll tell you whether you&rsquo;ve been approved.</p><p>Warmly,<br/>Pamela<br/>Celestial English Golden Retrievers</p>`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[apply:error]', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { ok: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
