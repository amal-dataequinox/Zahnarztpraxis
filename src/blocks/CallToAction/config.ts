import type { Block } from 'payload'

import { linkField } from '@/fields/link'

/**
 * Call-to-action block — schema only. The visual implementation follows in
 * Phase 2/3.
 */
export const CallToAction: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call-to-Action', plural: 'Call-to-Actions' },
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      localized: true,
    },
    linkField({ name: 'cta', label: 'Button', interfaceName: 'CallToActionCta' }),
  ],
}
