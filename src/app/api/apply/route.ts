import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { applicationSchema } from '@/lib/validation/application'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { sendEmail, renderRows } from '@/lib/email'
import { smtp } from '@/lib/env'
import { serverUrl } from '@/lib/env'

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)
  const limit = rateLimit(`apply:${ip}`, { limit: 4, windowMs: 30 * 60_000 })
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const d = parsed.data

  // Honeypot tripped — pretend success, store nothing.
  if (d.website) {
    return NextResponse.json({ ok: true })
  }

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
    // eslint-disable-next-line no-console
    console.error('[apply:error]', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { ok: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
