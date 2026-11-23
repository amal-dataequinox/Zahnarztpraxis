import type { Block } from 'payload'

/**
 * Services overview block — schema only. The visual implementation follows in
 * Phase 2/3. When no services are selected, the frontend will show all
 * published services of the resolved location.
 */
export const ServicesOverview: Block = {
  slug: 'servicesOverview',
  interfaceName: 'ServicesOverviewBlock',
  labels: { singular: 'Leistungsübersicht', plural: 'Leistungsübersichten' },
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      localized: true,
    },
    {
      name: 'intro',
      label: 'Einleitung',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'services',
      label: 'Leistungen',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description:
          'Leer lassen, um automatisch alle veröffentlichten Leistungen des Standorts anzuzeigen.',
      },
    },
  ],
}
