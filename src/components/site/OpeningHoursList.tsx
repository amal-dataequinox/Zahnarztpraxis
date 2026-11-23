import React from 'react'

import { Text } from '@/design-system'
import { WEEKDAYS } from '@/fields/openingHours'
import type { Location } from '@/payload-types'

const dayLabel = (value: string): string =>
  WEEKDAYS.find((day) => day.value === value)?.label ?? value

type OpeningHoursListProps = {
  entries: Location['openingHours'] | Location['telephoneAvailability']
  emptyLabel?: string
}

export function OpeningHoursList({
  entries,
  emptyLabel = 'Keine Angaben.',
}: OpeningHoursListProps) {
  if (!entries || entries.length === 0) {
    return <Text tone="muted">{emptyLabel}</Text>
  }

  return (
    <ul className="space-y-2 font-sans text-[length:var(--text-base)] text-[var(--color-fg)]">
      {entries.map((entry, index) => (
        <li key={entry.id ?? `${entry.day}-${index}`} className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="min-w-28 font-medium text-[var(--color-fg-muted)]">
            {dayLabel(entry.day)}
          </span>
          <span>
            {entry.closed
              ? 'geschlossen'
              : (entry.ranges ?? []).map((range) => `${range.from}–${range.to}`).join(' / ')}
            {entry.note ? (
              <span className="text-[var(--color-fg-subtle)]"> ({entry.note})</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  )
}
