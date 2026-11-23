import type { FieldHook, TextField } from 'payload'

/**
 * Formats a string into a URL-safe slug. Transliterates German umlauts so
 * editors get readable slugs ("Ästhetische Zahnmedizin" ->
 * "aesthetische-zahnmedizin").
 */
export const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlugHook =
  (fallbackField: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }

    const fallback = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    if (typeof fallback === 'string' && fallback.length > 0) {
      return formatSlug(fallback)
    }

    return value
  }

type SlugFieldOptions = {
  /** Field the slug is generated from when left empty. Defaults to `title`. */
  fallbackField?: string
  /** Whether the slug must be unique across the collection. Defaults to true. */
  unique?: boolean
}

/**
 * Reusable slug field. Auto-generates from the fallback field when empty and
 * always normalises user input to a URL-safe value.
 */
export const slugField = ({ fallbackField = 'title', unique = true }: SlugFieldOptions = {}): TextField => ({
  name: 'slug',
  type: 'text',
  label: 'Slug',
  required: true,
  unique,
  index: true,
  admin: {
    position: 'sidebar',
    description: `URL-Bezeichner. Wird automatisch aus "${fallbackField}" erzeugt, wenn leer.`,
  },
  hooks: {
    beforeValidate: [formatSlugHook(fallbackField)],
  },
  validate: (value: string | null | undefined) => {
    if (!value) return 'Slug ist erforderlich.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.'
    }
    return true
  },
})
