import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(200),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required.')
    .max(5000, 'Message is too long.'),
  // Honeypot — see `isHoneypotFilled` in @/lib/validation/honeypot. Accepted by
  // the schema on purpose: rejecting it here would return a field error naming
  // the trap, telling a bot exactly which field to leave blank next time.
  website: z.unknown().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
