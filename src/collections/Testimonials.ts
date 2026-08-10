import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access/roles'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'ownerName',
    group: 'Content',
    defaultColumns: ['ownerName', 'dogName', 'location', 'published'],
    description: 'Owner testimonials. Only add real, received testimonials.',
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'ownerName', type: 'text', required: true, label: 'Owner first name', admin: { width: '33%' } },
        { name: 'dogName', type: 'text', label: 'Dog name', admin: { width: '33%' } },
        { name: 'location', type: 'text', admin: { width: '34%', description: 'e.g. "Richmond, VA".' } },
      ],
    },
    {
      name: 'date',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional photo.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the public website.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlight on the home page.' },
    },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
