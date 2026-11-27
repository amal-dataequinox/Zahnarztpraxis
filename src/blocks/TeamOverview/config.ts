import type { Block } from 'payload'

/**
 * Team overview block — schema only. The visual implementation follows in
 * Phase 2/3. When no team members are selected, the frontend will show all
 * active team members of the resolved location.
 */
export const TeamOverview: Block = {
  slug: 'teamOverview',
  interfaceName: 'TeamOverviewBlock',
  labels: { singular: 'Teamübersicht', plural: 'Teamübersichten' },
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
      localized: true,
    },
    {
      name: 'intro',
      label: 'Einleitung',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'defaultRoleLabel',
      label: 'Standard-Bezeichnung (falls Funktion leer)',
      type: 'text',
      localized: true,
    },
    {
      name: 'showBiographies',
      label: 'Biografien unter den Teamkarten anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'teamMembers',
      label: 'Teammitglieder',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      admin: {
        description:
          'Leer lassen, um automatisch alle aktiven Teammitglieder des Standorts anzuzeigen.',
      },
    },
    {
      name: 'showPartners',
      label: 'Partner & Verbände unter dem Team anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'partnersEyebrow',
      label: 'Partner-Oberzeile / Etikett',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.showPartners !== false,
      },
    },
    {
      name: 'partnersHeading',
      label: 'Partner-Überschrift',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.showPartners !== false,
      },
    },
    {
      name: 'partnersIntro',
      label: 'Partner-Einleitung',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.showPartners !== false,
      },
    },
    {
      name: 'partners',
      label: 'Partner & Verbände',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.showPartners !== false,
        description:
          'Leer lassen, um die Standard-Partner (SAREMCO, Appenzellerland, SSO) anzuzeigen.',
      },
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'categoryLabel',
          label: 'Kategorie / Rolle',
          type: 'text',
          localized: true,
        },
        {
          name: 'url',
          label: 'Website-URL',
          type: 'text',
        },
        {
          name: 'logo',
          label: 'Logo (Media)',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
