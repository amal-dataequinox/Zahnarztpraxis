import type { CollectionConfig } from 'payload'

import { activeJobOrEditor, editorOrAbove } from '@/access'
import { slugField } from '@/fields/slug'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

/**
 * Open positions managed by practice editors in Payload Admin.
 * Replicates DEQX's structured Jobs model adapted for Swiss dental practice roles.
 */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Stellenangebot', plural: 'Stellenangebote' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'jobId', 'department', 'location', 'workload', 'status'],
    group: 'Inhalte',
  },
  access: {
    read: activeJobOrEditor,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  hooks: cmsCollectionRevalidateHooks(['cms-jobs']),
  fields: [
    {
      name: 'title',
      label: 'Stellentitel',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      admin: {
        description: 'z. B. "Zahnärztin / Zahnarzt (60–80 %)"',
      },
    },
    slugField({ fallbackField: 'title' }),
    {
      name: 'jobId',
      label: 'Stellen-ID',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Eindeutige Kennung, z. B. PAL-ZA-001',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Offen (Aktiv)', value: 'active' },
        { label: 'Besetzt / Geschlossen', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'department',
      label: 'Fachbereich / Abteilung',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'z. B. "Zahnmedizin", "Dentalhygiene", "Dentalassistenz"',
      },
    },
    {
      name: 'location',
      label: 'Arbeitsort',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'z. B. "Gais (AR) & Appenzell (AI)"',
      },
    },
    {
      name: 'workload',
      label: 'Pensum',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'z. B. "60–80 %" oder "80–100 %"',
      },
    },
    {
      name: 'employmentType',
      label: 'Anstellungsart',
      type: 'select',
      defaultValue: 'part-time',
      required: true,
      options: [
        { label: 'Vollzeit', value: 'full-time' },
        { label: 'Teilzeit', value: 'part-time' },
        { label: 'Befristet / Vertretung', value: 'contract' },
        { label: 'Lehrstelle / Praktikum', value: 'internship' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      label: 'Eintritt / Beginn',
      type: 'text',
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'z. B. "Per sofort oder nach Vereinbarung"',
      },
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
      name: 'summary',
      label: 'Kurzbeschreibung (Stellenübersicht)',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Kurzer Teaser-Text für die Stellenkarte auf /jobs.',
      },
    },
    {
      name: 'description',
      label: 'Stellenbeschreibung / Einleitung',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'requirements',
      label: 'Ihr Profil',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'tasks',
      label: 'Ihre Aufgaben',
      type: 'richText',
      localized: true,
    },
    {
      name: 'benefits',
      label: 'Wir bieten',
      type: 'richText',
      localized: true,
    },
    {
      name: 'applicationNote',
      label: 'Hinweis zur Bewerbung',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optionaler Hinweis zu Abschlüssen, Bewilligungen oder Bewerbungsablauf.',
      },
    },
  ],
}
