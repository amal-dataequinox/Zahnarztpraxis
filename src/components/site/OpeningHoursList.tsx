import React from 'react'

import { Text } from '@/design-system'
import { WEEKDAYS } from '@/fields/openingHours'
import type { Location } from '@/payload-types'

const dayLabel = (value: string): string =>
  WEEKDAYS.find((day) => day.value === value)?.label ?? value

type OpeningHoursListProps = {
  entries: Location['openingHours'] | Location['telephoneAvailability']
  emptyLabel?: string
  variant?: 'light' | 'inverse'
}

export function OpeningHoursList({
  entries,
  emptyLabel = 'Keine Angaben.',
  variant = 'light',
}: OpeningHoursListProps) {
  const isInverse = variant === 'inverse'

  if (!entries || entries.length === 0) {
    return (
      <Text tone={isInverse ? 'inverse' : 'muted'} className={isInverse ? 'opacity-70 text-sm' : undefined}>
        {emptyLabel}
      </Text>
    )
  }

  if (isInverse) {
    return (
      <ul className="m-0 list-none space-y-2.5 p-0 font-sans text-sm">
        {entries.map((entry, index) => (
          <li
            key={entry.id ?? `${entry.day}-${index}`}
            className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-2 last:border-b-0 last:pb-0"
          >
            <span className="font-medium text-white/65">{dayLabel(entry.day)}</span>
            <span className="text-right font-medium tabular-nums text-white/95">
              {entry.closed
                ? 'geschlossen'
                : (entry.ranges ?? []).map((range) => `${range.from}–${range.to}`).join(' / ')}
              {entry.note ? <span className="text-white/55 font-normal"> ({entry.note})</span> : null}
            </span>
          </li>
        ))}
      </ul>
    )
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
