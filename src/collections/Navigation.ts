import type { CollectionConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { linkField } from '@/fields/link'

/**
 * Navigation menus. A navigation either belongs to one location (e.g. the
 * Appenzell header) or is shared across both domains (no location set).
 * The order of the items array is the display order.
 */
export const Navigation: CollectionConfig = {
  slug: 'navigation',
  labels: { singular: 'Navigation', plural: 'Navigationen' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'identifier', 'location'],
    group: 'Verwaltung',
  },
  access: {
    read: anyone,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      admin: { description: 'Interner Name, z. B. "Hauptnavigation Appenzell"' },
    },
    {
      name: 'identifier',
      label: 'Kennung',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Hauptnavigation', value: 'main' },
        { label: 'Footer-Navigation', value: 'footer' },
      ],
      admin: {
        description: 'Technische Position der Navigation im Layout.',
      },
    },
    {
      name: 'location',
      label: 'Standort',
      type: 'relationship',
      relationTo: 'locations',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Leer lassen für eine Navigation, die beide Domains teilen.',
      },
    },
    {
      name: 'items',
      label: 'Navigationspunkte',
      type: 'array',
      admin: {
        description: 'Die Reihenfolge der Einträge bestimmt die Anzeige-Reihenfolge.',
      },
      fields: [linkField({ name: 'link', label: 'Link', interfaceName: 'NavigationItemLink' })],
    },
  ],
}
