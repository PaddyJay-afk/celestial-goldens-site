import { z } from 'zod'

const requiredString = (label: string, max = 5000) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`)

export const applicationSchema = z.object({
  applicantName: requiredString('Full name', 200),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  phone: requiredString('Phone', 50),
  cityState: requiredString('City and state', 200),
  householdMembers: requiredString('Household members'),
  children: z.string().trim().max(500).optional().or(z.literal('')),
  otherPets: z.string().trim().max(2000).optional().or(z.literal('')),
  housingType: z.enum(['house', 'townhouse', 'apartment', 'farm', 'other'], {
    errorMap: () => ({ message: 'Select a housing type.' }),
  }),
  yardFence: z.enum(['fenced', 'unfenced', 'none']).optional().or(z.literal('')),
  workSchedule: requiredString('Work schedule'),
  priorExperience: requiredString('Prior dog experience'),
  vetReference: z.string().trim().max(500).optional().or(z.literal('')),
  activityLevel: requiredString('Lifestyle / activity level'),
  trainingPlan: requiredString('Training plan'),
  whyBreed: requiredString('Why an English Golden Retriever'),
  desiredTiming: requiredString('Desired timing', 500),
  sexPreference: z.enum(['either', 'male', 'female']).optional().or(z.literal('')),
  agreement: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to responsible-ownership expectations.' }),
  }),
  contactConsent: z.literal(true, {
    errorMap: () => ({ message: 'Please consent to be contacted.' }),
  }),
  // Honeypot — must be empty. Bots tend to fill every field.
  website: z.string().max(0).optional().or(z.literal('')),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
