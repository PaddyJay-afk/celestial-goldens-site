import path from 'path'
import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access/roles'
import { uploadsDir } from '@/lib/env'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    description: 'Photos and images. Provide descriptive alt text for accessibility & SEO.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    // Persisted on a mounted volume in production (see docker-compose.yml).
    staticDir: path.join(uploadsDir, 'media'),
    // Restrict to safe image types only.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'feature', width: 1280, height: 960, position: 'centre' },
      { name: 'hero', width: 1920, height: 1280, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and search engines.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption shown in galleries.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Optional photographer credit.',
      },
    },
  ],
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          if (req.file.size > MAX_UPLOAD_BYTES) {
            throw new Error('Image is too large. Maximum size is 8 MB.')
          }
        }
      },
    ],
  },
}
