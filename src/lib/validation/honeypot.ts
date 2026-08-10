/**
 * Honeypot check for public forms.
 *
 * Every public form renders a visually-hidden `website` field. A human never
 * sees it, so it arrives empty; bots that fill every input give themselves
 * away.
 *
 * This is deliberately checked against the *raw* request body, before schema
 * validation, for two reasons:
 *
 * 1. The response must be indistinguishable from a successful submission. If a
 *    filled honeypot produced a validation error naming the `website` field, a
 *    bot author would immediately learn which field is the trap.
 * 2. A bot that fills the honeypot has already identified itself, so there is
 *    no reason to spend validation or database work on the rest of its payload.
 */
export const isHoneypotFilled = (body: unknown): boolean => {
  if (typeof body !== 'object' || body === null) return false
  const value = (body as Record<string, unknown>).website
  if (value == null) return false
  if (typeof value === 'string') return value.trim() !== ''
  // Any non-string value (array, object, number) is something a real browser
  // form would never submit for this input.
  return true
}
