import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrStaff } from '@/access/roles'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'

/**
 * Editable long-form content pages (Responsible Breeding, Process, Health
 * Guarantee, etc.). The frontend renders well-known slugs with custom layouts
 * and falls back to the rich-text body for any other page.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
    description: 'Editable content pages.',
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'subtitle',
      type: 'text',
      admin: { description: 'Optional intro shown under the page title.' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      admin: { description: 'Main page content.' },
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
