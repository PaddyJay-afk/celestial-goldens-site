import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export type Role = 'admin' | 'editor' | 'viewer'

const roleOf = (user: unknown): Role | null => {
  const u = user as User | null | undefined
  return (u?.role as Role) ?? null
}

/** Anyone (including unauthenticated public) can read. */
export const anyone: Access = () => true

/** Only authenticated users (any role) can read. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Full access — Owner/Admin only. */
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/** Admins and editors (content managers). */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

/** Any logged-in staff member (admin, editor, viewer). */
export const isStaff: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor' || role === 'viewer'
}

/** Field-level: admin only (e.g. assigning roles). */
export const isAdminField: FieldAccess = ({ req: { user } }) =>
  roleOf(user) === 'admin'

/** Field-level: admins and editors. */
export const isAdminOrEditorField: FieldAccess = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

/**
 * Public read for published content; staff can read everything (incl. drafts).
 * Use on collections that expose a `published` boolean.
 */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    published: {
      equals: true,
    },
  }
}

/**
 * Public read for documents explicitly marked public; staff read everything.
 *
 * Documents left un-public (the default) are "shared on request only" —
 * contracts and health guarantees Pamela sends to approved families. Without
 * this gate the `public` checkbox would be decorative: the REST API would list
 * every document, and the stored file would be downloadable by URL.
 */
export const publicOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    public: {
      equals: true,
    },
  }
}
