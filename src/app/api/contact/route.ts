import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactSchema } from '@/lib/validation/contact'
import { isHoneypotFilled } from '@/lib/validation/honeypot'
import { getClientIp, peekRateLimit, rateLimit } from '@/lib/rate-limit'
import { sendEmail, renderRows } from '@/lib/email'
import { smtp } from '@/lib/env'

const WINDOW_MS = 10 * 60_000
const MAX_MESSAGES = 5
// Generous ceiling on raw requests, so a bot cannot hammer the endpoint even
// though failed attempts don't count against the submission quota below.
const MAX_ATTEMPTS = 40

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)

  const attempts = rateLimit(`contact:attempt:${ip}`, {
    limit: MAX_ATTEMPTS,
    windowMs: WINDOW_MS,
  })
  // Only *stored* messages count toward the submission quota, so a visitor who
  // fumbles the form a few times is never locked out of contacting the breeder.
  const quota = peekRateLimit(`contact:${ip}`, { limit: MAX_MESSAGES })
  if (!attempts.allowed || !quota.allowed) {
    const retryAfter = Math.max(attempts.retryAfterSeconds, quota.retryAfterSeconds)
    return NextResponse.json(
      { ok: false, message: 'Too many messages. Please try again later.' },
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

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = parsed.data

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-messages',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        subject: data.subject || undefined,
        message: data.message,
        handled: false,
      },
      overrideAccess: true,
    })

    // Charge the submission quota only now that a message was actually stored.
    rateLimit(`contact:${ip}`, { limit: MAX_MESSAGES, windowMs: WINDOW_MS })

    const to = smtp.toBreeder
    if (to) {
      await sendEmail({
        to,
        replyTo: data.email,
        subject: `New contact message${data.subject ? `: ${data.subject}` : ''}`,
        text: `From ${data.name} <${data.email}>\n\n${data.message}`,
        html: `<h2>New contact message</h2><table>${renderRows([
          ['Name', data.name],
          ['Email', data.email],
          ['Phone', data.phone],
          ['Subject', data.subject],
        ])}</table><p style="white-space:pre-wrap;margin-top:12px">${data.message.replace(/</g, '&lt;')}</p>`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact:error]', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { ok: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
