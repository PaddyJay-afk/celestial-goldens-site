import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const LITTER_STATUSES = [
  { label: 'Planned', value: 'planned' },
  { label: 'Expecting', value: 'expecting' },
  { label: 'Born', value: 'born' },
  { label: 'Available', value: 'available' },
  { label: 'Fully reserved', value: 'reserved' },
  { label: 'Placed', value: 'placed' },
] as const

export const Litters: CollectionConfig = {
  slug: 'litters',
  admin: {
    useAsTitle: 'name',
    group: 'Breeding Program',
    defaultColumns: ['name', 'status', 'expectedDate', 'waitlistOpen', 'published'],
    description: 'Planned, current, and past litters.',
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Daisy × Cooper — Spring 2026".' },
    },
    slugField('name'),
    {
      type: 'row',
      fields: [
        {
          name: 'sire',
          type: 'relationship',
          relationTo: 'dogs',
          admin: { width: '50%' },
          filterOptions: { role: { not_equals: 'dam' } },
        },
        {
          name: 'dam',
          type: 'relationship',
          relationTo: 'dogs',
          admin: { width: '50%' },
          filterOptions: { role: { not_equals: 'sire' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'planned',
          options: [...LITTER_STATUSES],
          admin: { width: '50%' },
        },
        {
          name: 'waitlistOpen',
          type: 'checkbox',
          label: 'Waitlist open',
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'expectedDate',
          type: 'date',
          label: 'Expected / whelp date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'goHomeDate',
          type: 'date',
          label: 'Estimated go-home date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Notes about the pairing and what you hope for in this litter.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the public website.' },
    },
    seoField,
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
