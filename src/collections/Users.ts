import { APIError, type CollectionConfig } from 'payload'

import {
  ROLES,
  canAccessAdmin,
  superAdminFieldLevel,
  superAdminOnly,
  superAdminOrSelf,
} from '@/access'

/**
 * CMS users. Two roles:
 * - `super-admin`: full control, including user management.
 * - `editor`: manages content, but not users or system configuration.
 *
 * Deactivated accounts (`active: false`) cannot log in and lose all access.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Benutzer', plural: 'Benutzer' },
  auth: {
    tokenExpiration: 60 * 60 * 2, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active'],
    group: 'Verwaltung',
  },
  access: {
    admin: canAccessAdmin,
    create: superAdminOnly,
    read: superAdminOrSelf,
    update: superAdminOrSelf,
    delete: superAdminOnly,
    unlock: superAdminOnly,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user?.active === false) {
          throw new APIError('Dieses Benutzerkonto ist deaktiviert.', 403)
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    // Email + password are added automatically by `auth: true`.
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      required: true,
      defaultValue: ROLES.EDITOR,
      saveToJWT: true,
      options: [
        { label: 'Super Admin', value: ROLES.SUPER_ADMIN },
        { label: 'Redakteur:in', value: ROLES.EDITOR },
      ],
      access: {
        // Only super admins may assign or change roles.
        create: superAdminFieldLevel,
        update: superAdminFieldLevel,
      },
    },
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: true,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
        description: 'Deaktivierte Benutzer können sich nicht anmelden.',
      },
      access: {
        update: superAdminFieldLevel,
      },
    },
  ],
}
