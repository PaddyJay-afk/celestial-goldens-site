import path from 'path'
import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access/roles'
import { uploadsDir } from '@/lib/env'

const MAX_PDF_BYTES = 15 * 1024 * 1024 // 15 MB

/**
 * Uploadable PDFs — contract, health guarantee, info packets.
 * Marked `public` only when Pamela wants the file directly downloadable.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'public', 'updatedAt'],
    description: 'PDF documents such as the contract and health guarantee.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir: path.join(uploadsDir, 'documents'),
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Contract', value: 'contract' },
        { label: 'Health guarantee', value: 'health-guarantee' },
        { label: 'Info packet', value: 'info-packet' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'If on, the document can be linked publicly. If off, it is shared on request only.',
      },
    },
  ],
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          if (req.file.size > MAX_PDF_BYTES) {
            throw new Error('PDF is too large. Maximum size is 15 MB.')
          }
        }
      },
    ],
  },
}
