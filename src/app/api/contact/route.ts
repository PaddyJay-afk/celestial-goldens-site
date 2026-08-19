import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactSchema } from '@/lib/validation/contact'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { sendEmail, renderRows } from '@/lib/email'
import { smtp } from '@/lib/env'
import { parsePublicJson, RequestBodyError } from '@/lib/request'

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many messages. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await parsePublicJson(req)
  } catch (err) {
    const error = err instanceof RequestBodyError ? err : new RequestBodyError('Invalid request.', 400)
    return NextResponse.json({ ok: false, message: error.message }, { status: error.status })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = parsed.data

  // Honeypot tripped — pretend success, store nothing.
  if (data.website) {
    return NextResponse.json({ ok: true })
  }

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
