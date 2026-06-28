import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaff } from '@/access/roles'

export const APPLICATION_STATUSES = [
  { label: 'New', value: 'new' },
  { label: 'Needs Follow-Up', value: 'needs-follow-up' },
  { label: 'Approved', value: 'approved' },
  { label: 'Deposit Sent', value: 'deposit-sent' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Waitlisted', value: 'waitlisted' },
  { label: 'Declined', value: 'declined' },
] as const

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'applicantName',
    group: 'Inbox',
    defaultColumns: ['applicantName', 'email', 'status', 'desiredTiming', 'createdAt'],
    description: 'Puppy applications. Internal notes and status are never shown publicly.',
    listSearchableFields: ['applicantName', 'email', 'phone', 'cityState'],
  },
  access: {
    // Public submissions come through the validated API route (overrideAccess).
    create: isAdminOrEditor,
    read: isStaff,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Applicant',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'applicantName', type: 'text', required: true, label: 'Full name', admin: { width: '50%' } },
                { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'cityState', type: 'text', required: true, label: 'City, State', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Household',
          fields: [
            { name: 'householdMembers', type: 'textarea', label: 'Household members', required: true },
            { name: 'children', type: 'text', label: 'Children & ages' },
            { name: 'otherPets', type: 'textarea', label: 'Other pets' },
            {
              type: 'row',
              fields: [
                {
                  name: 'housingType',
                  type: 'select',
                  required: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'House', value: 'house' },
                    { label: 'Townhouse', value: 'townhouse' },
                    { label: 'Apartment / Condo', value: 'apartment' },
                    { label: 'Farm / Acreage', value: 'farm' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'yardFence',
                  type: 'select',
                  label: 'Yard / fence',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Fenced yard', value: 'fenced' },
                    { label: 'Unfenced yard', value: 'unfenced' },
                    { label: 'No yard', value: 'none' },
                  ],
                },
              ],
            },
            { name: 'workSchedule', type: 'textarea', label: 'Work schedule / hours alone', required: true },
          ],
        },
        {
          label: 'Experience & plan',
          fields: [
            { name: 'priorExperience', type: 'textarea', label: 'Prior dog experience', required: true },
            { name: 'vetReference', type: 'text', label: 'Vet reference (if applicable)' },
            { name: 'activityLevel', type: 'textarea', label: 'Lifestyle / activity level', required: true },
            { name: 'trainingPlan', type: 'textarea', label: 'Training plan', required: true },
            { name: 'whyBreed', type: 'textarea', label: 'Why an English Golden Retriever?', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'desiredTiming',
                  type: 'text',
                  label: 'Desired timing',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'sexPreference',
                  type: 'select',
                  label: 'Sex preference',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Either', value: 'either' },
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ],
                },
              ],
            },
            {
              name: 'puppy',
              type: 'relationship',
              relationTo: 'puppies',
              admin: { description: 'Optional — set if the application is about a specific puppy.' },
            },
            {
              name: 'agreement',
              type: 'checkbox',
              label: 'Agreed to responsible-ownership expectations',
              required: true,
            },
            {
              name: 'contactConsent',
              type: 'checkbox',
              label: 'Consented to be contacted',
              required: true,
            },
          ],
        },
        {
          label: 'Internal (staff only)',
          admin: {
            description: 'These fields are never shown on the public website.',
          },
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'new',
              options: [...APPLICATION_STATUSES],
              admin: { position: 'sidebar' },
            },
            {
              name: 'adminNotes',
              type: 'textarea',
              label: 'Internal notes',
              admin: { description: 'Private. Never displayed publicly.' },
            },
            {
              name: 'linkedApplication',
              type: 'relationship',
              relationTo: 'deposits',
              hasMany: true,
              admin: { description: 'Deposit links sent for this applicant.' },
            },
          ],
        },
      ],
    },
  ],
}
