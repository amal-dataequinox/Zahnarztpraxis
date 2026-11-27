import type { CollectionConfig } from 'payload'

import { editorOrAbove, publishedOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

/**
 * Dental treatments. Content (descriptions) is supplied by editors with
 * verified medical information — never auto-generated.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Leistung', plural: 'Leistungen' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'displayOrder', '_status'],
    group: 'Inhalte',
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrEditor,
    readVersions: editorOrAbove,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  hooks: cmsCollectionRevalidateHooks(['cms-services']),
  fields: [
    {
      name: 'name',
      label: 'Name der Leistung',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({ fallbackField: 'name' }),
    {
      name: 'shortDescription',
      label: 'Kurzbeschreibung',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'detailedDescription',
      label: 'Ausführliche Beschreibung',
      type: 'richText',
      localized: true,
      admin: {
        description:
          'Von der Praxis geprüfte Inhalte. Keine unbelegten medizinischen Aussagen veröffentlichen.',
      },
    },
    {
      name: 'featuredImage',
      label: 'Beitragsbild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      label: 'Kategorie (Filter)',
      type: 'select',
      defaultValue: 'zahnerhalt',
      options: [
        { label: 'Vorsorge & Hygiene', value: 'vorsorge' },
        { label: 'Zahnerhalt & Implantate', value: 'zahnerhalt' },
        { label: 'Ästhetik & Korrektur', value: 'aesthetik' },
        { label: 'Notfall & Akut', value: 'notfall' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Steuert die Filterung auf der Leistungsseite.',
      },
    },
    {
      name: 'icon',
      label: 'Icon-Kennung',
      type: 'text',
      admin: {
        description:
          'Technischer Bezeichner für das Icon (wird im Design-System in Phase 2 definiert).',
      },
    },
    {
      name: 'relatedServices',
      label: 'Verwandte Leistungen',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: 'locations',
      label: 'Angeboten an Standorten',
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
    // SEO fields (`meta` group) are added by @payloadcms/plugin-seo.
  ],
}
