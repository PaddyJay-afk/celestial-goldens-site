import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'

export const Dogs: CollectionConfig = {
  slug: 'dogs',
  admin: {
    useAsTitle: 'callName',
    group: 'Breeding Program',
    defaultColumns: ['callName', 'registeredName', 'sex', 'role', 'published'],
    description: 'Parent and retired dogs in the breeding program.',
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
          name: 'callName',
          type: 'text',
          required: true,
          label: 'Call name',
          admin: { width: '50%', description: 'Everyday name, e.g. "Daisy".' },
        },
        {
          name: 'registeredName',
          type: 'text',
          label: 'Registered name',
          admin: { width: '50%', description: 'Full registered name, if applicable. (TODO: confirm)' },
        },
      ],
    },
    slugField('callName'),
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'dam',
          options: [
            { label: 'Sire', value: 'sire' },
            { label: 'Dam', value: 'dam' },
            { label: 'Retired', value: 'retired' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'sex',
          type: 'select',
          required: true,
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'dateOfBirth',
          type: 'date',
          label: 'Date of birth',
          admin: { width: '34%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'color',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "Light cream".' },
        },
        {
          name: 'weight',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "62 lbs".' },
        },
      ],
    },
    {
      name: 'temperament',
      type: 'textarea',
      admin: { description: 'Temperament and personality notes.' },
    },
    {
      name: 'pedigreeNotes',
      type: 'textarea',
      label: 'Pedigree notes',
    },
    {
      name: 'healthTesting',
      type: 'array',
      label: 'Health testing',
      labels: { singular: 'Health test', plural: 'Health tests' },
      admin: {
        description:
          'Add only tests that have actually been completed. Do not list a result that has not been confirmed.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'test',
              type: 'text',
              required: true,
              admin: { width: '50%', description: 'e.g. "OFA Hips".' },
            },
            {
              name: 'result',
              type: 'text',
              admin: { width: '50%', description: 'e.g. "Good".' },
            },
          ],
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Optional public link to the certificate (OFA, Embark, etc.).' },
        },
      ],
    },
    {
      name: 'titles',
      type: 'text',
      label: 'Titles / achievements',
      admin: { description: 'Optional, comma-separated.' },
    },
    {
      name: 'gallery',
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
      admin: { position: 'sidebar', description: 'Main profile photo.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the public website.' },
    },
    seoField,
  ],
}
