import { cn } from '@/design-system/lib/cn'

export type LocationOption = {
  id: 'appenzell' | 'gais'
  label: string
  href: string
}

type LocationSwitcherProps = {
  current: 'appenzell' | 'gais'
  options?: LocationOption[]
  className?: string
}

const defaultOptions: LocationOption[] = [
  { id: 'appenzell', label: 'Appenzell', href: 'https://zahnarztpraxis-palatty.ch' },
  { id: 'gais', label: 'Gais', href: 'https://zahnarzt-palatty.ch' },
]

/**
 * First-class location control. Accent pips are identifiers — not competing brand fills.
 */
export function LocationSwitcher({
  current,
  options = defaultOptions,
  className,
}: LocationSwitcherProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[length:var(--text-sm)]',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === current
        const pip =
          option.id === 'appenzell' ? 'bg-[var(--accent-appenzell)]' : 'bg-[var(--accent-gais)]'

        return (
          <a
            key={option.id}
            href={option.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 no-underline transition-opacity duration-[var(--duration-fast)]',
              active
                ? 'font-semibold text-[var(--palatty-ink)]'
                : 'font-medium text-[var(--palatty-slate)] hover:text-[var(--palatty-ink)]',
            )}
          >
            <span className={cn('h-2 w-2 shrink-0', pip)} aria-hidden />
            {option.label}
          </a>
        )
      })}
    </div>
  )
}
