'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useState } from 'react'

import { ButtonLink, LocationSwitcher } from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import { cn } from '@/design-system/lib/cn'
import type { Location, Navigation } from '@/payload-types'
import type { BrandLogo } from '@/utilities/brandLogos'
import { locationSlug } from '@/utilities/locationSwitcher'
import { resolveCMSLink } from '@/utilities/cmsLink'

type SiteHeaderProps = {
  location: Location
  navigation: Navigation | null
  brandLogo: BrandLogo
  locationOptions: LocationOption[]
}

export function SiteHeader({
  location,
  navigation,
  brandLogo,
  locationOptions,
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const panelId = useId()
  const current = locationSlug(location)
  const overlayHome = pathname === '/'

  useEffect(() => {
    if (!overlayHome) {
      setScrolled(false)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlayHome])

  const transparent = overlayHome && !scrolled && !open

  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  return (
    <header
      className={cn(
        'z-40 transition-[background,border-color,backdrop-filter] duration-300',
        overlayHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        transparent
          ? 'border-b-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--palatty-paper)_88%,transparent)_0%,color-mix(in_oklab,var(--palatty-snow)_55%,transparent)_42%,color-mix(in_oklab,var(--palatty-cyan)_8%,transparent)_72%,transparent_100%)]'
          : 'border-b border-[var(--color-border-strong)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--palatty-paper)_96%,transparent)_0%,color-mix(in_oklab,var(--palatty-snow)_90%,transparent)_100%)] backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[var(--container-xl)] flex-col gap-3 px-[var(--container-pad)] py-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="min-w-0 max-w-[min(100%,22rem)] no-underline sm:max-w-[min(100%,30rem)]"
            onClick={() => setOpen(false)}
          >
            <Image
              src={brandLogo.src}
              alt={brandLogo.alt}
              width={brandLogo.width}
              height={brandLogo.height}
              priority
              unoptimized
              className={cn(
                'h-12 w-auto max-w-full bg-transparent object-contain object-left sm:h-14',
                transparent && 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.55)]',
              )}
            />
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink href="/kontakt#termin" size="md" className="shrink-0">
              <span className="sm:hidden">Termin</span>
              <span className="hidden sm:inline">Termin anfragen</span>
            </ButtonLink>
            <button
              type="button"
              className={cn(
                'inline-flex min-h-11 min-w-11 items-center justify-center border px-3 font-sans text-[length:var(--text-sm)] font-medium lg:hidden',
                transparent
                  ? 'border-[color-mix(in_oklab,var(--palatty-ink)_22%,transparent)] bg-[color-mix(in_oklab,var(--palatty-snow)_70%,transparent)] backdrop-blur-sm'
                  : 'border-[var(--color-border-strong)] bg-[var(--palatty-snow)]',
              )}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Schliessen' : 'Menü'}
            </button>
          </div>
        </div>

        <div className="hidden min-w-0 flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between">
          <nav aria-label="Hauptnavigation" className="min-w-0">
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1 p-0 sm:gap-x-5">
              {items.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={`${item.href}-${item.label}`} className="min-w-0">
                    <Link
                      href={item.href}
                      className={cn(
                        'inline-flex min-h-11 items-center border-b-2 font-sans text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-nav)] no-underline transition-colors',
                        active
                          ? 'border-[var(--palatty-cyan)] text-[var(--palatty-ink)]'
                          : 'border-transparent text-[var(--palatty-slate)] hover:text-[var(--palatty-ink)]',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <LocationSwitcher current={current} options={locationOptions} className="min-w-0" />
        </div>
      </div>

      <div
        id={panelId}
        className={cn(
          'border-t border-[var(--color-border)] bg-[var(--palatty-paper)] lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="px-[var(--container-pad)] py-4">
          <nav aria-label="Mobilnavigation">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {items.map((item) => (
                <li key={`mobile-${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center font-sans text-[length:var(--text-base)] font-medium text-[var(--palatty-ink)] no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            <LocationSwitcher current={current} options={locationOptions} />
          </div>
        </div>
      </div>
    </header>
  )
}
