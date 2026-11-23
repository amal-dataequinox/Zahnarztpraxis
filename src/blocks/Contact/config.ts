import type { Block } from 'payload'

/**
 * Contact section block — schema only. Contact data is rendered from the
 * resolved location; nothing is hardcoded.
 */
export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Kontaktbereich', plural: 'Kontaktbereiche' },
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
      type: 'richText',
      localized: true,
    },
    {
      name: 'showContactForm',
      label: 'Kontaktformular anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showBookingLink',
      label: 'Link zur Online-Terminbuchung anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
