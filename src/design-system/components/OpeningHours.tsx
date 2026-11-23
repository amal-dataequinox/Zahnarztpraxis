import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'

export type OpeningHoursRow = {
  label: string
  value: string
}

type OpeningHoursProps = {
  title?: string
  rows: OpeningHoursRow[]
  className?: string
}

/**
 * Presentational hours table. Values must come from location CMS data.
 */
export function OpeningHours({ title = 'Öffnungszeiten', rows, className }: OpeningHoursProps) {
  return (
    <div className={cn('max-w-md', className)}>
      <Text size="sm" className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase">
        {title}
      </Text>
      <dl className="m-0 grid gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[var(--color-border)] py-2 last:border-b-0"
          >
            <dt className="m-0 font-sans text-[length:var(--text-sm)] text-[var(--color-fg-muted)]">
              {row.label}
            </dt>
            <dd className="m-0 font-sans text-[length:var(--text-sm)] font-medium tabular-nums text-[var(--color-fg)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
