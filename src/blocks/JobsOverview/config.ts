import type { Block } from 'payload'

/**
 * Dynamic job board block rendering active entries from the `jobs` collection
 * with search & department/location filters plus the application step guide.
 */
export const JobsOverview: Block = {
  slug: 'jobsOverview',
  interfaceName: 'JobsOverviewBlock',
  labels: { singular: 'Stellenübersicht', plural: 'Stellenübersichten' },
  fields: [
    {
      name: 'eyebrow',
      label: 'Oberzeile',
      type: 'text',
      localized: true,
    },
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      localized: true,
    },
    {
      name: 'headingHighlight',
      label: 'Überschrift Akzent-Teil (Primärfarbe)',
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
      name: 'showFilters',
      label: 'Such- und Filterleiste anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showApplicationGuide',
      label: 'Bewerbungsablauf (Schritte) darunter anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'emptyHeading',
      label: 'Leer-Zustand Überschrift',
      type: 'text',
      localized: true,
    },
    {
      name: 'emptyDescription',
      label: 'Leer-Zustand Beschreibung',
      type: 'textarea',
      localized: true,
    },
  ],
}
