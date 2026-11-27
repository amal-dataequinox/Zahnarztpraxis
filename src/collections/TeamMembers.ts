import type { CollectionConfig } from 'payload'

import { activeOrEditor, editorOrAbove } from '@/access'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

/**
 * Practice staff profiles. All content — names, biographies and photographs —
 * is supplied by the practice. Never invent staff identities or photos.
 */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Teammitglied', plural: 'Teammitglieder' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'position', 'displayOrder', 'active'],
    group: 'Inhalte',
  },
  access: {
    read: activeOrEditor,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  hooks: cmsCollectionRevalidateHooks(['cms-team']),
  fields: [
    {
      name: 'fullName',
      label: 'Vollständiger Name',
      type: 'text',
      required: true,
    },
    {
      name: 'professionalTitle',
      label: 'Berufsbezeichnung / Titel',
      type: 'text',
      admin: { description: 'z. B. "Dr. med. dent."' },
    },
    {
      name: 'position',
      label: 'Funktion',
      type: 'text',
      localized: true,
      admin: { description: 'z. B. "Zahnarzt", "Dentalhygienikerin", "Praxisleitung"' },
    },
    {
      name: 'biography',
      label: 'Biografie',
      type: 'richText',
      localized: true,
    },
    {
      name: 'photo',
      label: 'Porträtfoto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Echtes Porträtfoto, wird von der Praxis bereitgestellt.',
      },
    },
    {
      name: 'qualifications',
      label: 'Qualifikationen',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'qualification',
          label: 'Qualifikation',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'languages',
      label: 'Sprachen',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'language',
          label: 'Sprache',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'locations',
      label: 'Standorte',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      index: true,
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'displayOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Kleinere Zahlen erscheinen zuerst.',
      },
    },
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inaktive Teammitglieder werden auf der Website nicht angezeigt.',
      },
    },
  ],
}
