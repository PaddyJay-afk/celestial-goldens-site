import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaff } from '@/access/roles'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    defaultColumns: ['name', 'email', 'subject', 'handled', 'createdAt'],
    description: 'Messages from the contact form.',
    listSearchableFields: ['name', 'email', 'subject'],
  },
  access: {
    // Public submissions arrive via the validated API route (overrideAccess).
    create: isAdminOrEditor,
    read: isStaff,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%' } },
        { name: 'subject', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Mark when you have replied.' },
    },
  ],
}
