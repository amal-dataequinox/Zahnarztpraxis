import type { Block } from 'payload'

import { linkField } from '@/fields/link'

/**
 * Hero block — schema only. The visual implementation follows in Phase 2/3.
 */
export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      label: 'Unterzeile',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      label: 'Bild',
      type: 'upload',
      relationTo: 'media',
    },
    linkField({ name: 'cta', label: 'Call-to-Action', interfaceName: 'HeroCta' }),
  ],
}
