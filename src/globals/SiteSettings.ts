import type { GlobalConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { cmsGlobalRevalidateHooks } from '@/utilities/cacheRevalidation'

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
  hooks: cmsGlobalRevalidateHooks(['cms-site-settings']),
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
                  'Zentrale Kontaktdaten der Praxis (Fallback, falls unter Praxis & Standort nicht abweichend gepflegt).',
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
                description: 'Hinweisbanner oben auf der Website, z. B. für Ferienabwesenheit oder Praxisinfos.',
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
                {
                  name: 'defaultHeroImage',
                  label: 'Standard-Bild für Unterseiten-Hero',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'defaultCtaImage',
                  label: 'Standard-Bild für Termin- / CTA-Karten',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'UI-Texte & Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'bookingCtaLabel',
                  label: 'Termin-Button Standardtext',
                  type: 'text',
                  defaultValue: 'Termin anfragen',
                  admin: { width: '50%' },
                },
                {
                  name: 'contactFormButtonLabel',
                  label: 'Kontaktformular Button-Text',
                  type: 'text',
                  defaultValue: 'Nachricht senden',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'serviceSidebarEyebrow',
                  label: 'Leistungs-Detail Sidebar Etikett',
                  type: 'text',
                  defaultValue: 'Termin & Beratung',
                  admin: { width: '50%' },
                },
                {
                  name: 'relatedServicesHeading',
                  label: 'Leistungs-Detail Überschrift Weitere',
                  type: 'text',
                  defaultValue: 'Weitere Behandlungen',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'serviceSidebarDescription',
              label: 'Leistungs-Detail Sidebar Text',
              type: 'textarea',
              defaultValue:
                'Vereinbaren Sie Ihren Termin bequem telefonisch oder online – unser Praxisteam in Appenzell berät Sie gerne persönlich.',
            },
            {
              name: 'serviceFallbackDetail',
              label: 'Leistungs-Detail Standardtext (falls ohne Langtext)',
              type: 'textarea',
              defaultValue:
                'Jede zahnmedizinische Behandlung beginnt bei uns mit einem ruhigen Gespräch und einer verständlichen Diagnostik. Gerne erläutern wir Ihnen alle passenden Behandlungsschritte direkt in unserer Praxis.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'footerHoursLabel',
                  label: 'Footer Überschrift Zeiten',
                  type: 'text',
                  defaultValue: 'Öffnungszeiten',
                  admin: { width: '33%' },
                },
                {
                  name: 'footerNavLabel',
                  label: 'Footer Überschrift Navigation',
                  type: 'text',
                  defaultValue: 'Navigation',
                  admin: { width: '33%' },
                },
                {
                  name: 'footerLegalLabel',
                  label: 'Footer Überschrift Rechtliches',
                  type: 'text',
                  defaultValue: 'Praxis & Rechtliches',
                  admin: { width: '34%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'footerNotfallLabel',
                  label: 'Footer Link Notfall',
                  type: 'text',
                  defaultValue: 'Notfall',
                  admin: { width: '25%' },
                },
                {
                  name: 'footerJobsLabel',
                  label: 'Footer Link Jobs',
                  type: 'text',
                  defaultValue: 'Jobs',
                  admin: { width: '25%' },
                },
                {
                  name: 'footerImpressumLabel',
                  label: 'Footer Link Impressum',
                  type: 'text',
                  defaultValue: 'Impressum',
                  admin: { width: '25%' },
                },
                {
                  name: 'footerDatenschutzLabel',
                  label: 'Footer Link Datenschutz',
                  type: 'text',
                  defaultValue: 'Datenschutz',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactSectionEyebrow',
                  label: 'Kontakt Oberzeile',
                  type: 'text',
                  defaultValue: 'Kontakt',
                  admin: { width: '25%' },
                },
                {
                  name: 'contactNameLabel',
                  label: 'Formularfeld Name',
                  type: 'text',
                  defaultValue: 'Name',
                  admin: { width: '25%' },
                },
                {
                  name: 'contactEmailLabel',
                  label: 'Formularfeld E-Mail',
                  type: 'text',
                  defaultValue: 'E-Mail',
                  admin: { width: '25%' },
                },
                {
                  name: 'contactMessageLabel',
                  label: 'Formularfeld Nachricht',
                  type: 'text',
                  defaultValue: 'Nachricht',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'contactFormNote',
              label: 'Kontaktformular Hinweis',
              type: 'text',
              defaultValue: 'Mit dem Absenden öffnet sich Ihr E-Mail-Programm',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'servicesFilterAllLabel',
                  label: 'Filter Alle',
                  type: 'text',
                  defaultValue: 'Alle Behandlungen',
                  admin: { width: '20%' },
                },
                {
                  name: 'servicesFilterVorsorgeLabel',
                  label: 'Filter Vorsorge',
                  type: 'text',
                  defaultValue: 'Vorsorge & Hygiene',
                  admin: { width: '20%' },
                },
                {
                  name: 'servicesFilterZahnerhaltLabel',
                  label: 'Filter Zahnerhalt',
                  type: 'text',
                  defaultValue: 'Zahnerhalt & Implantate',
                  admin: { width: '20%' },
                },
                {
                  name: 'servicesFilterAesthetikLabel',
                  label: 'Filter Ästhetik',
                  type: 'text',
                  defaultValue: 'Ästhetik & Korrektur',
                  admin: { width: '20%' },
                },
                {
                  name: 'servicesFilterNotfallLabel',
                  label: 'Filter Notfall',
                  type: 'text',
                  defaultValue: 'Notfall & Akut',
                  admin: { width: '20%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'serviceBreadcrumbLabel',
                  label: 'Leistungs-Detail Zurück-Label',
                  type: 'text',
                  defaultValue: 'Alle Leistungen',
                  admin: { width: '20%' },
                },
                {
                  name: 'serviceDetailEyebrow',
                  label: 'Leistungs-Detail Oberzeile',
                  type: 'text',
                  defaultValue: 'Behandlungsdetails',
                  admin: { width: '20%' },
                },
                {
                  name: 'serviceRelatedEyebrow',
                  label: 'Weitere Behandlungen Etikett',
                  type: 'text',
                  defaultValue: 'Entdecken',
                  admin: { width: '20%' },
                },
                {
                  name: 'serviceViewAllLabel',
                  label: 'Alle ansehen Label',
                  type: 'text',
                  defaultValue: 'Alle ansehen',
                  admin: { width: '20%' },
                },
                {
                  name: 'serviceCardDetailsLabel',
                  label: 'Karten-Link Details',
                  type: 'text',
                  defaultValue: 'Details ansehen',
                  admin: { width: '20%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'locationEyebrowLabel',
                  label: 'Standort-Block Etikett',
                  type: 'text',
                  defaultValue: 'Standort & Anfahrt',
                  admin: { width: '25%' },
                },
                {
                  name: 'locationMapActionLabel',
                  label: 'Google Maps Link-Label',
                  type: 'text',
                  defaultValue: 'Google Maps Route öffnen',
                  admin: { width: '25%' },
                },
                {
                  name: 'emergencySectionLabel',
                  label: 'Notfall-Block Etikett',
                  type: 'text',
                  defaultValue: 'Notfalldienst',
                  admin: { width: '25%' },
                },
                {
                  name: 'teamPortraitPlaceholderLabel',
                  label: 'Team Platzhaltertext',
                  type: 'text',
                  defaultValue: 'Porträt folgt',
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
