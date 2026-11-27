import type { GlobalConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { cmsGlobalRevalidateHooks } from '@/utilities/cacheRevalidation'

/**
 * Career board headlines, step-by-step application guide, and drawer messaging.
 * Mirrors DEQX's JobBoardConfig global adapted to Zahnarztpraxis Palatty.
 */
export const JobBoardConfig: GlobalConfig = {
  slug: 'job-board-config',
  label: 'Stellenmarkt & Bewerbung',
  admin: {
    group: 'Verwaltung',
  },
  access: {
    read: anyone,
    update: editorOrAbove,
  },
  hooks: cmsGlobalRevalidateHooks(['cms-jobs']),
  fields: [
    {
      name: 'eyebrow',
      label: 'Oberzeile',
      type: 'text',
      localized: true,
      defaultValue: 'Karriere bei Palatty',
    },
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Offene Stellen',
    },
    {
      name: 'description',
      label: 'Einleitung',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue:
        'Verstärken Sie unser engagiertes Praxisteam in Appenzell und Gais — mit modernen Räumen, klaren Abläufen und persönlicher Wertschätzung.',
    },
    {
      name: 'applicationGuide',
      label: 'Bewerbungsablauf & Formular-Texte',
      type: 'group',
      fields: [
        {
          name: 'heading',
          label: 'Überschrift (So bewerben Sie sich)',
          type: 'text',
          localized: true,
          defaultValue: 'Ihr unkomplizierter Weg ins Team.',
        },
        {
          name: 'description',
          label: 'Beschreibung',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Wir prüfen jede Bewerbung persönlich und melden uns in der Regel innerhalb weniger Arbeitstage bei Ihnen.',
        },
        {
          name: 'steps',
          label: 'Bewerbungsschritte',
          type: 'array',
          fields: [
            {
              name: 'title',
              label: 'Schritt-Titel',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              label: 'Beschreibung',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'formIntro',
          label: 'Einleitung im Bewerbungsformular',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Reichen Sie Ihre Kontaktdaten und Ihren Lebenslauf direkt online ein — wir behandeln Ihre Unterlagen streng vertraulich.',
        },
        {
          name: 'successMessage',
          label: 'Bestätigung nach Absenden',
          type: 'textarea',
          localized: true,
          defaultValue:
            'Vielen Dank für Ihre Bewerbung. Unser Praxisteam hat Ihre Unterlagen erhalten und meldet sich zeitnah bei Ihnen.',
        },
      ],
    },
  ],
}
