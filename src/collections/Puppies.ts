import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, isAdminOrEditorField, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'

export const PUPPY_STATUSES = [
  { label: 'Available', value: 'available' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Under Evaluation', value: 'under-evaluation' },
  { label: 'Waitlist Only', value: 'waitlist-only' },
  { label: 'Placed', value: 'placed' },
] as const

export const Puppies: CollectionConfig = {
  slug: 'puppies',
  admin: {
    useAsTitle: 'name',
    group: 'Breeding Program',
    defaultColumns: ['name', 'litter', 'sex', 'status', 'published'],
    description: 'Individual puppies. Deposits are never taken without breeder approval.',
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'Name or collar color, e.g. "Green Collar".' },
        },
        {
          name: 'collarColor',
          type: 'text',
          label: 'Collar color',
          admin: { width: '50%', description: 'Used as the colored marker on puppy cards.' },
        },
      ],
    },
    slugField('name'),
    {
      name: 'litter',
      type: 'relationship',
      relationTo: 'litters',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sex',
          type: 'select',
          required: true,
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'under-evaluation',
          options: [...PUPPY_STATUSES],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dateOfBirth',
          type: 'date',
          label: 'Date of birth',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'goHomeDate',
          type: 'date',
          label: 'Go-home date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'color',
      type: 'text',
      admin: { description: 'e.g. "Light cream".' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Public notes',
      admin: { description: 'Temperament and personality notes shown publicly.' },
    },
    {
      name: 'photos',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'featuredImage',
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
    {
      name: 'allowDeposit',
      type: 'checkbox',
      label: 'Allow deposit link (approved buyers only)',
      defaultValue: false,
      access: {
        // Only content managers may enable the deposit gate.
        update: isAdminOrEditorField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Safety gate. Even when on, deposits are only sent to applicants you have approved. This never creates a public "buy now" button.',
      },
    },
  ],
}
