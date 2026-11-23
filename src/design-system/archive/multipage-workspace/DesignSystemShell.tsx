'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState, type ReactNode } from 'react'

import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'
import {
  DESIGN_SYSTEM_NAV,
  isNavItemActive,
  type DesignSystemNavItem,
} from './nav'

type DesignSystemShellProps = {
  children: ReactNode
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: DesignSystemNavItem
  pathname: string
  onNavigate?: () => void
}) {
  const active = isNavItemActive(pathname, item)

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center border-l-2 px-3 font-sans text-[length:var(--text-sm)] no-underline transition-colors duration-[var(--duration-fast)]',
        active
          ? 'border-[var(--palatty-cyan)] font-medium text-[var(--palatty-ink)]'
          : 'border-transparent font-normal text-[var(--palatty-slate)] hover:text-[var(--palatty-ink)]',
      )}
    >
      {item.label}
    </Link>
  )
}

function SidebarNav({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <nav aria-label="Design system" className={cn('min-w-0', className)}>
      {DESIGN_SYSTEM_NAV.map((group) => (
        <div key={group.label} className="mb-6 last:mb-0">
          <p className="m-0 mb-2 px-3 font-sans text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--palatty-slate)]">
            {group.label}
          </p>
          <ul className="m-0 list-none p-0">
            {group.items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} pathname={pathname} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/**
 * Editorial design-system workspace shell — sticky sidebar on desktop,
 * accessible drawer on mobile. Not a SaaS admin chrome.
 */
export function DesignSystemShell({ children }: DesignSystemShellProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openedAtPath, setOpenedAtPath] = useState(pathname)
  const panelId = useId()
  const open = menuOpen && openedAtPath === pathname

  const closeMenu = () => setMenuOpen(false)
  const openMenu = () => {
    setOpenedAtPath(pathname)
    setMenuOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="min-h-dvh min-w-0 max-w-full bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex min-h-14 items-center justify-between gap-3 border-b border-[var(--color-border-strong)] bg-[var(--palatty-paper)] px-[var(--container-pad)] lg:hidden">
        <div className="min-w-0">
          <p className="m-0 truncate font-sans text-[length:var(--text-base)] font-semibold tracking-[var(--tracking-tight)] text-[var(--palatty-navy)]">
            Palatty
          </p>
          <p className="m-0 truncate font-sans text-[length:var(--text-xs)] text-[var(--palatty-slate)]">
            Design System v2
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--color-border-strong)] bg-[var(--palatty-snow)] px-3 font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-ink)]"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-[color-mix(in_oklab,var(--palatty-navy)_45%,transparent)] transition-opacity duration-[var(--duration-base)]',
            open ? 'opacity-100' : 'opacity-0',
          )}
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={closeMenu}
        />
        <aside
          id={panelId}
          className={cn(
            'absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] max-w-full flex-col border-r border-[var(--color-border-strong)] bg-[var(--palatty-paper)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="border-b border-[var(--color-border)] px-4 py-5">
            <p className="m-0 font-sans text-[length:var(--text-lg)] font-semibold tracking-[var(--tracking-tight)] text-[var(--palatty-navy)]">
              Palatty
            </p>
            <p className="m-0 mt-1 font-sans text-[length:var(--text-xs)] text-[var(--palatty-slate)]">
              Empfangscyan · Schriftbau · Zwei Firste
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-5">
            <SidebarNav pathname={pathname} onNavigate={closeMenu} />
          </div>
          <div className="border-t border-[var(--color-border)] p-4">
            <Text size="xs" tone="subtle" className="mb-3">
              Showcase CTA — not a live booking action.
            </Text>
            <ButtonLink href="/design-system/components#cta" className="w-full" onClick={closeMenu}>
              Termin
            </ButtonLink>
          </div>
        </aside>
      </div>

      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[90rem]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-[var(--color-border-strong)] bg-[var(--palatty-paper)] lg:flex xl:w-64">
          <div className="border-b border-[var(--color-border)] px-5 py-6">
            <Link
              href="/design-system"
              className="block no-underline"
            >
              <p className="m-0 font-sans text-[length:var(--text-lg)] font-semibold tracking-[var(--tracking-tight)] text-[var(--palatty-navy)]">
                Palatty
              </p>
              <p className="m-0 mt-1 font-sans text-[length:var(--text-xs)] text-[var(--palatty-slate)]">
                Design System v2
              </p>
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-6">
            <SidebarNav pathname={pathname} />
          </div>
          <div className="border-t border-[var(--color-border)] p-5">
            <Text size="xs" tone="subtle" className="mb-3">
              Showcase CTA — demo only.
            </Text>
            <ButtonLink href="/design-system/components#cta" size="md" className="w-full">
              Termin vereinbaren
            </ButtonLink>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <main id="main" className="min-w-0 max-w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
