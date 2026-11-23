import type { ReactNode } from 'react'

import { ButtonLink } from '@/design-system/components/ButtonLink'
import { LocationSwitcher } from '@/design-system/components/LocationSwitcher'
import { TextLink } from '@/design-system/components/TextLink'
import { cn } from '@/design-system/lib/cn'

export type NavItem = {
  label: string
  href: string
}

type NavBarProps = {
  brand: ReactNode
  items: NavItem[]
  cta?: { label: string; href: string }
  location?: 'appenzell' | 'gais'
  showLocationSwitcher?: boolean
  className?: string
}

export function NavBar({
  brand,
  items,
  cta,
  location = 'appenzell',
  showLocationSwitcher = true,
  className,
}: NavBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--palatty-snow)_94%,transparent)] backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[var(--container-xl)] flex-col gap-3 px-[var(--container-pad)] py-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 break-words font-sans text-[length:var(--text-lg)] font-semibold tracking-[var(--tracking-tight)] text-[var(--palatty-navy)]">
            {brand}
          </div>
          {cta ? (
            <ButtonLink href={cta.href} size="md" className="shrink-0">
              <span className="sm:hidden">Termin</span>
              <span className="hidden sm:inline">{cta.label}</span>
            </ButtonLink>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Hauptnavigation" className="min-w-0">
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1 p-0 sm:gap-x-5">
              {items.map((item) => (
                <li key={`${item.href}-${item.label}`} className="min-w-0">
                  <TextLink
                    href={item.href}
                    className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-nav)] text-[var(--palatty-ink)] no-underline hover:underline"
                  >
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
          {showLocationSwitcher ? (
            <LocationSwitcher current={location} className="min-w-0 max-w-full" />
          ) : null}
        </div>
      </div>
    </header>
  )
}
