import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isStaff } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Lock out brute-force attempts.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
    tokenExpiration: 8 * 60 * 60, // 8 hours
    cookies: {
      sameSite: 'Lax',
      // Key off the real scheme, not NODE_ENV: in IP-only HTTP test mode the
      // admin must still be able to log in before DNS/HTTPS is configured.
      secure: (process.env.NEXT_PUBLIC_SERVER_URL || '').startsWith('https'),
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administration',
  },
  access: {
    // Only admins manage staff accounts.
    create: isAdmin,
    read: isStaff,
    update: isAdmin,
    delete: isAdmin,
    // `admin` must return a boolean — any logged-in staff member may access the panel.
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Owner / Admin (full access)', value: 'admin' },
        { label: 'Editor (manage content)', value: 'editor' },
        { label: 'Viewer (read-only helper)', value: 'viewer' },
      ],
      access: {
        // Only admins can grant/change roles.
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        description: 'Controls what this user can do in the dashboard.',
      },
    },
  ],
}
