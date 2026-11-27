import type { CollectionConfig } from 'payload'

import { activeOrEditor, editorOrAbove, superAdminOnly } from '@/access'
import { weeklyScheduleField } from '@/fields/openingHours'
import { slugField } from '@/fields/slug'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/

/**
 * Practice locations (Appenzell and Gais). Each location owns its domain,
 * contact data, opening hours and SEO metadata so neither site can leak the
 * other location's information.
 */
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Praxis & Standort', plural: 'Praxis & Standort' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain', 'active'],
    group: 'Inhalte',
  },
  access: {
    read: activeOrEditor,
    create: editorOrAbove,
    update: editorOrAbove,
    // Deleting a location is destructive for the whole domain — super admin only.
    delete: superAdminOnly,
  },
  hooks: cmsCollectionRevalidateHooks(['cms-locations', 'cms-pages']),
  fields: [
    {
      name: 'name',
      label: 'Standortname',
      type: 'text',
      required: true,
    },
    slugField({ fallbackField: 'name' }),
    {
      name: 'domain',
      label: 'Domain',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Produktions-Domain ohne Protokoll, z. B. zahnarztpraxis-palatty.ch',
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Domain ist erforderlich.'
        if (!HOSTNAME_PATTERN.test(value)) {
          return 'Ungültige Domain. Bitte ohne Protokoll und Pfad angeben, z. B. zahnarztpraxis-palatty.ch'
        }
        return true
      },
    },
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inaktive Standorte werden auf der Website nicht ausgeliefert.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Allgemein',
          fields: [
            {
              name: 'primaryColor',
              label: 'Primärfarbe der Praxis (Hex-Code)',
              type: 'text',
              admin: {
                description:
                  'Individuelle Primärfarbe für diese Praxis (z. B. #00a887, #3a81c4 oder jede Wunschfarbe). Überschreibt die globale Primärfarbe aus dem Design-System.',
              },
              validate: (value: unknown) =>
                !value ||
                (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) ||
                'Bitte einen 6-stelligen Hex-Code angeben (z. B. #00a887)',
            },
            {
              name: 'shortDescription',
              label: 'Kurzbeschreibung',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'logo',
              label: 'Standort-Logo',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                description:
                  'Horizontales Logo für Header. Leer = Standardlogo aus dem Design-System oder Website-Einstellungen.',
              },
            },
            {
              name: 'mainImage',
              label: 'Hauptbild der Praxis',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
            {
              name: 'heroVideo',
              label: 'Hero-Video',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'video' },
              },
              admin: {
                description:
                  'Kurzes Begrüssungsvideo für die Startseite (stumm, Loop). Zuerst unter Medien hochladen, dann hier zuweisen.',
              },
            },
            {
              name: 'heroVideoPoster',
              label: 'Hero-Video Poster',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                description:
                  'Standbild für reduzierte Bewegung und während das Video lädt. Optional.',
              },
            },
            {
              name: 'gallery',
              label: 'Galerie',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'image',
                  label: 'Bild',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  label: 'Bildunterschrift',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Adresse & Kontakt',
          fields: [
            {
              name: 'address',
              label: 'Adresse',
              type: 'group',
              fields: [
                { name: 'street', label: 'Strasse und Hausnummer', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'postalCode',
                      label: 'PLZ',
                      type: 'text',
                      required: true,
                      admin: { width: '30%' },
                    },
                    {
                      name: 'city',
                      label: 'Ort',
                      type: 'text',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'country',
                      label: 'Land',
                      type: 'text',
                      required: true,
                      defaultValue: 'Schweiz',
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
            { name: 'phone', label: 'Telefonnummer', type: 'text' },
            { name: 'email', label: 'E-Mail', type: 'email' },
            {
              name: 'hinEmail',
              label: 'HIN-E-Mail (Zuweiser / Datenschutz)',
              type: 'email',
              admin: {
                description: 'Sichere HIN-Adresse, z. B. zahnarztpraxispalattyai@hin.ch',
              },
            },
            {
              name: 'googleMapsUrl',
              label: 'Google-Maps-URL',
              type: 'text',
              validate: (value: string | null | undefined) => {
                if (!value) return true
                if (!/^https:\/\//.test(value)) return 'URL muss mit https:// beginnen.'
                return true
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  label: 'Breitengrad',
                  type: 'number',
                  min: -90,
                  max: 90,
                  admin: { width: '50%', step: 0.000001 },
                },
                {
                  name: 'longitude',
                  label: 'Längengrad',
                  type: 'number',
                  min: -180,
                  max: 180,
                  admin: { width: '50%', step: 0.000001 },
                },
              ],
            },
            {
              name: 'bookingUrl',
              label: 'URL Online-Terminbuchung',
              type: 'text',
              validate: (value: string | null | undefined) => {
                if (!value) return true
                if (!/^https:\/\//.test(value)) return 'URL muss mit https:// beginnen.'
                return true
              },
            },
          ],
        },
        {
          label: 'Zeiten & Notfall',
          fields: [
            weeklyScheduleField({
              name: 'openingHours',
              label: 'Öffnungszeiten',
              interfaceName: 'OpeningHours',
            }),
            weeklyScheduleField({
              name: 'telephoneAvailability',
              label: 'Telefonische Erreichbarkeit',
              interfaceName: 'TelephoneAvailability',
              description:
                'Optional, falls die telefonische Erreichbarkeit von den Praxis-Öffnungszeiten abweicht.',
            }),
            {
              name: 'emergencyInfo',
              label: 'Notfallinformationen',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Hinweis für Notfälle ausserhalb der Öffnungszeiten (z. B. Notfalldienst-Nummer).',
              },
            },
            {
              name: 'emergencyServices',
              label: 'Regionale Notfalldienste (Telefonnummern)',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'region',
                  label: 'Region / Kanton',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'phone',
                  label: 'Notfallnummer',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'emergencyLeaflet',
              label: 'Merkblatt zum Zahnunfall (PDF)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { equals: 'application/pdf' },
              },
              admin: {
                description: 'PDF-Download für Verhalten bei Zahnunfällen (z. B. SSO-Plakat).',
              },
            },
            {
              name: 'emergencyLeafletLabel',
              label: 'Merkblatt Link-Beschriftung',
              type: 'text',
              defaultValue: 'Merkblatt zum Zahnunfall (PDF)',
            },
          ],
        },
      ],
    },
    // SEO fields (`meta` group) are added by @payloadcms/plugin-seo.
  ],
}
