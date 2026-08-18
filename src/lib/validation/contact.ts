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
  // Honeypot — bots tend to fill every field. A filled value is treated as spam
  // by the route (silent success, nothing stored).
  website: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
