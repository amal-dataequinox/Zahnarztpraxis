import type { Block } from 'payload'

/**
 * Location information block — schema only. The rendered data always comes
 * from the resolved location of the current domain; nothing is hardcoded.
 */
export const LocationInformation: Block = {
  slug: 'locationInformation',
  interfaceName: 'LocationInformationBlock',
  labels: { singular: 'Standortinformationen', plural: 'Standortinformationen' },
  fields: [
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      localized: true,
    },
    {
      name: 'showAddress',
      label: 'Adresse anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showOpeningHours',
      label: 'Öffnungszeiten anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showContact',
      label: 'Kontaktdaten anzeigen',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showMap',
      label: 'Karte anzeigen',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'showEmergencyInfo',
      label: 'Notfallinformationen anzeigen',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
