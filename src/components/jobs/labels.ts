export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Vollzeit',
  'part-time': 'Teilzeit',
  contract: 'Befristet / Vertretung',
  internship: 'Lehrstelle / Praktikum',
}

export function formatEmploymentType(value: string | null | undefined): string {
  if (!value) return 'Teilzeit'
  return EMPLOYMENT_TYPE_LABELS[value] ?? value
}

export function toSchemaEmploymentType(value: string | null | undefined): string {
  if (!value) return 'PART_TIME'
  return value.toUpperCase().replace(/-/g, '_')
}
