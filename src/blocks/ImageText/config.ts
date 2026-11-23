import type { Block } from 'payload'

/**
 * Image and text block — schema only. The visual implementation follows in
 * Phase 2/3.
 */
export const ImageText: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Bild und Text', plural: 'Bild und Text' },
  fields: [
    {
      name: 'image',
      label: 'Bild',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'imagePosition',
      label: 'Bildposition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Links', value: 'left' },
        { label: 'Rechts', value: 'right' },
      ],
    },
  ],
}
