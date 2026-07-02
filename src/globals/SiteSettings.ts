import type { GlobalConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
    description: 'Brand, contact, trust badges, social links, and SEO defaults.',
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'businessName', type: 'text', defaultValue: 'Cirilli English Goldens', required: true },
            { name: 'tagline', type: 'text', defaultValue: 'Thoughtfully raised English Golden Retrievers in Suffolk, Virginia.' },
            {
              name: 'breederName',
              type: 'text',
              defaultValue: 'Pamela Cirilli',
              admin: { description: 'Breeder name shown publicly.' },
            },
            {
              name: 'showBreederName',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Show the breeder’s name publicly.' },
            },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Optional. Falls back to a text wordmark.' } },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Large photo on the home page. Portrait orientation looks best.' },
            },
          ],
        },
        {
          label: 'Contact & location',
          fields: [
            { name: 'email', type: 'email', admin: { description: 'Public email. Leave blank to use the contact form only.' } },
            { name: 'phone', type: 'text', admin: { description: 'Public phone. Leave blank to hide.' } },
            {
              name: 'addressVisibility',
              type: 'select',
              defaultValue: 'generalized',
              options: [
                { label: 'Hidden', value: 'hidden' },
                { label: 'Generalized to city (recommended)', value: 'generalized' },
                { label: 'Show full address', value: 'full' },
              ],
              admin: { description: 'Never expose a private street address unless you choose “Show full address”.' },
            },
            { name: 'city', type: 'text', defaultValue: 'Suffolk' },
            { name: 'state', type: 'text', defaultValue: 'VA' },
            { name: 'streetAddress', type: 'text', admin: { description: 'Only shown publicly if visibility is “Show full address”.' } },
            { name: 'postalCode', type: 'text' },
            {
              name: 'serviceArea',
              type: 'text',
              defaultValue: 'Suffolk, VA and the greater Hampton Roads / Tidewater area',
              admin: { description: 'General area you serve (for SEO and the contact page).' },
            },
          ],
        },
        {
          label: 'Trust badges',
          admin: { description: 'Only enable badges that are true for your program. Do not claim certifications you do not have.' },
          fields: [
            { name: 'badgeAkc', type: 'checkbox', label: 'AKC registered', defaultValue: false },
            { name: 'badgeOfa', type: 'checkbox', label: 'OFA health testing', defaultValue: false },
            { name: 'badgeEmbark', type: 'checkbox', label: 'Embark / genetic testing', defaultValue: false },
            { name: 'badgeVetChecked', type: 'checkbox', label: 'Vet-checked puppies', defaultValue: true },
            { name: 'badgeFamilyRaised', type: 'checkbox', label: 'Family-raised in our home', defaultValue: true },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'youtube', type: 'text' },
            { name: 'tiktok', type: 'text' },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            { name: 'defaultMetaTitle', type: 'text', admin: { description: 'Fallback page title.' } },
            { name: 'defaultMetaDescription', type: 'textarea', maxLength: 200 },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
