import type { GlobalConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'

/**
 * Shared, brand-wide configuration. Location-specific data (contact details,
 * opening hours, SEO) lives in the Locations collection instead.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: { group: 'Verwaltung' },
  access: {
    read: anyone,
    update: editorOrAbove,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Marke',
          fields: [
            {
              name: 'brandName',
              label: 'Markenname',
              type: 'text',
              required: true,
              defaultValue: 'Zahnarztpraxis Palatty',
            },
            {
              name: 'brandContact',
              label: 'Zentrale Kontaktinformationen',
              type: 'group',
              admin: {
                description:
                  'Übergreifende Kontaktdaten der Marke. Standortspezifische Daten werden am Standort gepflegt.',
              },
              fields: [
                { name: 'phone', label: 'Telefon', type: 'text' },
                { name: 'email', label: 'E-Mail', type: 'email' },
              ],
            },
            {
              name: 'defaultLanguage',
              label: 'Standardsprache',
              type: 'select',
              required: true,
              defaultValue: 'de',
              options: [
                { label: 'Deutsch', value: 'de' },
                { label: 'Englisch', value: 'en' },
              ],
            },
          ],
        },
        {
          label: 'Footer & Social',
          fields: [
            {
              name: 'footerText',
              label: 'Footer-Text',
              type: 'richText',
              localized: true,
            },
            {
              name: 'socialLinks',
              label: 'Social-Media-Links',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'platform',
                  label: 'Plattform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Andere', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  label: 'URL',
                  type: 'text',
                  required: true,
                  validate: (value: string | null | undefined) =>
                    value && /^https:\/\//.test(value) ? true : 'URL muss mit https:// beginnen.',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Hinweise',
          fields: [
            {
              name: 'defaultSEO',
              label: 'Standard-SEO',
              type: 'group',
              admin: {
                description: 'Fallback-Metadaten, wenn eine Seite keine eigenen SEO-Daten hat.',
              },
              fields: [
                { name: 'title', label: 'Standard-Titel', type: 'text', localized: true },
                {
                  name: 'description',
                  label: 'Standard-Beschreibung',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'image',
                  label: 'Standard-OG-Bild',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'announcement',
              label: 'Globale Ankündigung',
              type: 'group',
              admin: {
                description: 'Hinweisbanner auf beiden Websites, z. B. Ferienabwesenheit.',
              },
              fields: [
                { name: 'enabled', label: 'Aktiv', type: 'checkbox', defaultValue: false },
                {
                  name: 'message',
                  label: 'Nachricht',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
            {
              name: 'sharedMedia',
              label: 'Gemeinsame Medien',
              type: 'group',
              fields: [
                { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
                {
                  name: 'fallbackOgImage',
                  label: 'Fallback-OG-Bild',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
