import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access/roles'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['question', 'category', 'order', 'published'],
    description: 'Frequently asked questions.',
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Pricing & Deposits', value: 'pricing' },
        { label: 'Waitlist & Visits', value: 'waitlist' },
        { label: 'Registration', value: 'registration' },
        { label: 'Health & Testing', value: 'health' },
        { label: 'Pickup & Delivery', value: 'pickup' },
        { label: 'Food & Care', value: 'care' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
