import type { ArrayField } from 'payload'

const TIME_PATTERN = /^([01]?\d|2[0-3]):[0-5]\d$/

const validateTime = (value: string | null | undefined): true | string => {
  if (!value) return 'Zeit ist erforderlich (Format HH:MM).'
  if (!TIME_PATTERN.test(value)) return 'Ungültiges Zeitformat. Bitte HH:MM verwenden, z. B. 08:00.'
  return true
}

export const WEEKDAYS = [
  { label: 'Montag', value: 'monday' },
  { label: 'Dienstag', value: 'tuesday' },
  { label: 'Mittwoch', value: 'wednesday' },
  { label: 'Donnerstag', value: 'thursday' },
  { label: 'Freitag', value: 'friday' },
  { label: 'Samstag', value: 'saturday' },
  { label: 'Sonntag', value: 'sunday' },
] as const

type WeeklyScheduleOptions = {
  name: string
  label: string
  interfaceName: string
  description?: string
}

/**
 * Reusable weekly schedule field (opening hours, telephone availability).
 * Each weekday is an entry with one or more time ranges, so the two practices
 * can maintain completely different schedules — including split hours such as
 * "08:00-12:00 / 14:00-18:00".
 */
export const weeklyScheduleField = ({
  name,
  label,
  interfaceName,
  description,
}: WeeklyScheduleOptions): ArrayField => ({
  name,
  label,
  type: 'array',
  interfaceName,
  admin: {
    description:
      description ??
      'Ein Eintrag pro Wochentag. Tage ohne Eintrag gelten als geschlossen / nicht erreichbar.',
    initCollapsed: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'day',
          label: 'Wochentag',
          type: 'select',
          required: true,
          options: [...WEEKDAYS],
          admin: { width: '40%' },
        },
        {
          name: 'closed',
          label: 'Geschlossen',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '20%' },
        },
      ],
    },
    {
      name: 'ranges',
      label: 'Zeitfenster',
      type: 'array',
      admin: {
        condition: (_data, siblingData) => siblingData?.closed !== true,
        description: 'Mehrere Zeitfenster möglich, z. B. 08:00–12:00 und 14:00–18:00.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'from',
              label: 'Von',
              type: 'text',
              required: true,
              validate: validateTime,
              admin: { width: '50%', placeholder: '08:00' },
            },
            {
              name: 'to',
              label: 'Bis',
              type: 'text',
              required: true,
              validate: validateTime,
              admin: { width: '50%', placeholder: '12:00' },
            },
          ],
        },
      ],
    },
    {
      name: 'note',
      label: 'Hinweis',
      type: 'text',
      admin: { description: 'Optionaler Hinweis, z. B. "nur nach Vereinbarung".' },
    },
  ],
})
