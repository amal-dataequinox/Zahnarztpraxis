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
      name: 'eyebrow',
      label: 'Oberzeile / Etikett',
      type: 'text',
      localized: true,
    },
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'titleHighlight',
      label: 'Hervorgehobene Zeile (Primärfarbe, Optional)',
      type: 'text',
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
    {
      name: 'hideDefaultActions',
      label: 'Standard-Termin- & Telefonbuttons ausblenden (z. B. für Rechtliches)',
      type: 'checkbox',
      defaultValue: false,
    },
    linkField({ name: 'cta', label: 'Call-to-Action', interfaceName: 'HeroCta', required: false }),
  ],
}
