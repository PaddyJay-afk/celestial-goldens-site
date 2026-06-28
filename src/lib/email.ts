import nodemailer from 'nodemailer'
import { isEmailConfigured, smtp } from './env'

/**
 * Send a transactional email via SMTP. When SMTP is not configured, the message
 * is logged to the console instead of failing — the site still works without
 * email set up.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
}): Promise<{ sent: boolean }> => {
  if (!isEmailConfigured) {
    // eslint-disable-next-line no-console
    console.info(`[email:disabled] to=${to} subject="${subject}"`)
    return { sent: false }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.password },
    })

    await transporter.sendMail({
      from: smtp.from,
      to,
      subject,
      text,
      html,
      replyTo,
    })
    return { sent: true }
  } catch (err) {
    // Never let email failure break a form submission.
    // eslint-disable-next-line no-console
    console.error('[email:error]', err instanceof Error ? err.message : err)
    return { sent: false }
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const renderRows = (rows: Array<[string, string | undefined]>): string =>
  rows
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6E6A5F;vertical-align:top"><strong>${esc(
          k,
        )}</strong></td><td style="padding:4px 0">${esc(String(v))}</td></tr>`,
    )
    .join('')
