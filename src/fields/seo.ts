import type { Field } from 'payload'

/**
 * Per-document SEO group. All optional — falls back to SiteSettings defaults
 * and sensible derived values on the frontend.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Optional. Leave blank to use the page title and site defaults.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Meta title',
      admin: { description: 'Recommended ~50–60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta description',
      maxLength: 200,
      admin: { description: 'Recommended ~120–160 characters. Avoid keyword stuffing.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Open Graph image',
      admin: { description: 'Social share image. ~1200×630.' },
    },
  ],
}
