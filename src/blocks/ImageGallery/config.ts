import type { Block } from 'payload'

/**
 * Image gallery block — schema only. The visual implementation follows in
 * Phase 2/3.
 */
export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: { singular: 'Bildergalerie', plural: 'Bildergalerien' },
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      localized: true,
    },
    {
      name: 'images',
      label: 'Bilder',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Bildunterschrift',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
