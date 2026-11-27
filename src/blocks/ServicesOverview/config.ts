import type { Block } from 'payload'

/**
 * Services overview block — full CMS control over heading, service showcase,
 * 3-step treatment journey, and consultation CTA banner.
 */
export const ServicesOverview: Block = {
  slug: 'servicesOverview',
  interfaceName: 'ServicesOverviewBlock',
  labels: { singular: 'Leistungsübersicht', plural: 'Leistungsübersichten' },
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
      name: 'cardLinkLabel',
      label: 'Karten Link-Text',
      type: 'text',
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
    {
      type: 'collapsible',
      label: 'Behandlungsablauf (3 Schritte)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'journeyEyebrow',
          label: 'Ablauf Oberzeile',
          type: 'text',
          localized: true,
        },
        {
          name: 'journeyHeading',
          label: 'Ablauf Überschrift',
          type: 'text',
          localized: true,
        },
        {
          name: 'journeyHighlight',
          label: 'Ablauf Akzent-Zeile (Primärfarbe)',
          type: 'text',
          localized: true,
        },
        {
          name: 'journeyDescription',
          label: 'Ablauf Einleitung',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'journeySteps',
          label: 'Schritte',
          type: 'array',
          maxRows: 6,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'step',
                  label: 'Nummer / Etikett',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', placeholder: '01 / BERATUNG' },
                },
                {
                  name: 'icon',
                  label: 'Symbol',
                  type: 'select',
                  defaultValue: 'chat',
                  options: [
                    { label: 'Gespräch (Beratung)', value: 'chat' },
                    { label: 'Kompass (Planung)', value: 'compass' },
                    { label: 'Schutzschild (Behandlung)', value: 'shield' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'title',
              label: 'Titel',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              label: 'Beschreibung',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Beratung / Termin-Banner (Unten)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'ctaEyebrow',
          label: 'Banner Oberzeile',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaHeading',
          label: 'Banner Überschrift',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaHighlight',
          label: 'Banner Akzent-Teil (Primärfarbe)',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaDescription',
          label: 'Banner Beschreibung',
          type: 'textarea',
          localized: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaButtonLabel',
              label: 'Button Text',
              type: 'text',
              localized: true,
              admin: { width: '50%' },
            },
            {
              name: 'ctaButtonHref',
              label: 'Button Link (Optional)',
              type: 'text',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'ctaImage',
          label: 'Banner Bild',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
