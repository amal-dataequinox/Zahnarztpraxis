import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/**
 * Role constants. Keep in sync with the `role` select field in the Users
 * collection.
 */
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  EDITOR: 'editor',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/** A user only counts as authenticated if their account is active. */
export const isActiveUser = (user: User | null | undefined): user is User =>
  Boolean(user && user.active !== false)

const hasRole = (user: User | null | undefined, ...roles: Role[]): boolean =>
  isActiveUser(user) && roles.includes(user.role as Role)

/** Collection access: only active super admins. */
export const superAdminOnly: Access = ({ req: { user } }) => hasRole(user, ROLES.SUPER_ADMIN)

/** Collection access: any active CMS user (super admin or editor). */
export const editorOrAbove: Access = ({ req: { user } }) =>
  hasRole(user, ROLES.SUPER_ADMIN, ROLES.EDITOR)

/** Collection access: everyone, including unauthenticated visitors. */
export const anyone: Access = () => true

/**
 * Users collection: super admins manage everyone, other users can only read
 * and update their own account.
 */
export const superAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (hasRole(user, ROLES.SUPER_ADMIN)) return true
  if (!isActiveUser(user)) return false
  if (id) return user.id === id
  return { id: { equals: user.id } }
}

/**
 * Draft-enabled collections: CMS users see everything (including drafts),
 * the public only sees published documents.
 */
export const publishedOrEditor: Access = ({ req: { user } }) => {
  if (hasRole(user, ROLES.SUPER_ADMIN, ROLES.EDITOR)) return true
  return { _status: { equals: 'published' } }
}

/**
 * Collections with an `active` flag (Locations, Team Members): CMS users see
 * everything, the public only sees active documents.
 */
export const activeOrEditor: Access = ({ req: { user } }) => {
  if (hasRole(user, ROLES.SUPER_ADMIN, ROLES.EDITOR)) return true
  return { active: { equals: true } }
}

/**
 * Jobs collection: CMS editors see all openings (open & closed),
 * the public only sees active openings.
 */
export const activeJobOrEditor: Access = ({ req: { user } }) => {
  if (hasRole(user, ROLES.SUPER_ADMIN, ROLES.EDITOR)) return true
  return { status: { equals: 'active' } }
}

/**
 * Testimonials: CMS users see everything, the public only sees approved
 * entries.
 */
export const approvedOrEditor: Access = ({ req: { user } }) => {
  if (hasRole(user, ROLES.SUPER_ADMIN, ROLES.EDITOR)) return true
  return { approved: { equals: true } }
}

/** Field-level access: only super admins may read/update the field. */
export const superAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  hasRole(user as User | null, ROLES.SUPER_ADMIN)

/** Admin panel access: any active CMS user. */
export const canAccessAdmin = ({ req: { user } }: { req: { user: User | null } }): boolean =>
  isActiveUser(user)
