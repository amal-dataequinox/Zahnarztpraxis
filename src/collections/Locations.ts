import type { CollectionConfig } from 'payload'

import { activeOrEditor, editorOrAbove, superAdminOnly } from '@/access'
import { weeklyScheduleField } from '@/fields/openingHours'
import { slugField } from '@/fields/slug'

const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/

/**
 * Practice locations (Appenzell and Gais). Each location owns its domain,
 * contact data, opening hours and SEO metadata so neither site can leak the
 * other location's information.
 */
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Standort', plural: 'Standorte' },
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
                  'Horizontales Logo für Header (z. B. Palatty Appenzell / Gais). Leer = Standarddatei aus dem Design-System.',
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
                'Nur ausfüllen, wenn die telefonische Erreichbarkeit von den Öffnungszeiten abweicht.',
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
          ],
        },
      ],
    },
    // SEO fields (`meta` group) are added by @payloadcms/plugin-seo.
  ],
}
