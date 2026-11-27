import type { Block } from 'payload'

/**
 * Rich text block — schema only. The visual implementation follows in Phase 2/3.
 */
export const RichText: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Textabschnitt', plural: 'Textabschnitte' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          label: 'Oberzeile / Etikett (Optional)',
          type: 'text',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'appearance',
          label: 'Darstellungsstil',
          type: 'select',
          defaultValue: 'editorial-card',
          options: [
            { label: 'Editorial-Karte (Modern)', value: 'editorial-card' },
            { label: 'Bento-Abschnitte (z. B. Jobs / Profil)', value: 'bento-sections' },
            { label: 'Notfall-Split (Akut & Zahnunfall)', value: 'urgent-split' },
            { label: 'Schlicht (Kompakter Fliesstext)', value: 'plain' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'content',
      label: 'Inhalt',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sidebarTitle',
          label: 'Hinweisbox Titel (Optional)',
          type: 'text',
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'sidebarText',
          label: 'Hinweisbox Text (Optional)',
          type: 'textarea',
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
