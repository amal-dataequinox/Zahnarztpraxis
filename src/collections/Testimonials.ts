import type { CollectionConfig } from 'payload'

import { approvedOrEditor, editorOrAbove } from '@/access'

/**
 * Patient testimonials. Only genuine, verifiable feedback is entered by
 * editors — never generated. Public visitors only see approved entries.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Bewertung', plural: 'Bewertungen' },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'location', 'source', 'approved'],
    group: 'Inhalte',
    description: 'Nur echte, überprüfbare Patientenstimmen erfassen.',
  },
  access: {
    read: approvedOrEditor,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  fields: [
    {
      name: 'displayName',
      label: 'Anzeigename',
      type: 'text',
      required: true,
      admin: { description: 'z. B. "M. K. aus Appenzell" — keine vollen Namen ohne Einwilligung.' },
    },
    {
      name: 'text',
      label: 'Bewertungstext',
      type: 'textarea',
      required: true,
    },
    {
      name: 'location',
      label: 'Standort',
      type: 'relationship',
      relationTo: 'locations',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      label: 'Quelle',
      type: 'text',
      admin: { description: 'z. B. "Google Bewertung", "schriftliches Feedback"' },
    },
    {
      name: 'displayOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'approved',
      label: 'Freigegeben',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Nur freigegebene Bewertungen sind öffentlich sichtbar.',
      },
    },
  ],
}
