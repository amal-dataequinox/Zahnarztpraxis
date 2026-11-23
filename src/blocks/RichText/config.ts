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
      name: 'content',
      label: 'Inhalt',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
