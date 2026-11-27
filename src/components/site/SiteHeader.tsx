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
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30)
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  return (
    <header
      className={cn(
        'z-50 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        overlayHome
          ? cn('fixed inset-x-0 px-4 sm:px-8 lg:px-10', scrolled ? 'top-2 sm:top-3' : 'top-3 sm:top-5')
          : cn('sticky inset-x-0 px-4 sm:px-8 lg:px-10 pb-2', scrolled ? 'top-2 sm:top-3' : 'top-3 sm:top-5'),
      )}
    >
      <div
        className="mx-auto w-full pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          maxWidth: 'var(--header-max-width, 1440px)',
        }}
      >
        <div
          className={cn(
            'relative flex items-center justify-between rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            scrolled
              ? 'h-12 sm:h-[56px] px-5 sm:px-8 lg:px-10 border border-black/[0.1] bg-white/96 backdrop-blur-xl shadow-[0_12px_36px_rgb(0,0,0,0.12),0_2px_6px_rgb(0,0,0,0.06)]'
              : 'h-14 sm:h-[68px] px-5 sm:px-8 lg:px-10 border border-black/[0.08] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08),0_1px_3px_rgb(0,0,0,0.04)]',
          )}
        >
          {/* 1. Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-3 no-underline group"
              onClick={() => setOpen(false)}
            >
              <div
                className={cn(
                  'relative w-auto flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  scrolled ? 'h-7 sm:h-9' : 'h-9 sm:h-11',
                )}
              >
                <Image
                  src={brandLogo.src}
                  alt={brandLogo.alt}
                  width={brandLogo.width}
                  height={brandLogo.height}
                  priority
                  unoptimized
                  className={cn(
                    'w-auto object-contain object-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90',
                    scrolled
                      ? 'h-6 sm:h-7 md:h-8 max-w-[135px] sm:max-w-[185px] md:max-w-[215px]'
                      : 'h-8 sm:h-9 md:h-10 max-w-[165px] sm:max-w-[230px] md:max-w-[270px]',
                  )}
                />
              </div>
            </Link>
          </div>

          {/* 2. Center: Navigation Items (Desktop) */}
          <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center justify-center">
            <ul className="m-0 flex list-none items-center gap-2 lg:gap-4 xl:gap-6 p-0 transition-all duration-300">
              {items.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      prefetch={item.href.startsWith('/') ? true : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex items-center rounded-full font-sans font-medium transition-all duration-300 no-underline',
                        scrolled ? 'px-3.5 py-1 text-xs sm:text-[13px]' : 'px-4 py-1.5 text-sm',
                        active
                          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold'
                          : 'text-[#4A5568] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* 3. Right: Action Icons & Language Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 transition-all duration-300">
            {/* 4 Circular Action Buttons (Matching Reference Design) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* 1. Search / Treatments */}
              <Link
                href="/leistungen"
                prefetch={true}
                title="Behandlungen & Leistungen"
                className={cn(
                  'flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                )}
              >
                <svg
                  className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="sr-only">Behandlungen suchen</span>
              </Link>

              {/* 2. Emergency / Heart */}
              <Link
                href="/notfall"
                prefetch={true}
                title="Zahnärztlicher Notfall"
                className={cn(
                  'flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                )}
              >
                <svg
                  className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="sr-only">Notfall</span>
              </Link>

              {/* 3. Direct Phone Call */}
              {location.phone ? (
                <a
                  href={`tel:${location.phone}`}
                  title={`Praxis anrufen: ${location.phone}`}
                  className={cn(
                    'flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                  )}
                >
                  <svg
                    className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="sr-only">Anrufen</span>
                </a>
              ) : null}

              {/* 4. Appointment / Booking */}
              <Link
                href="/kontakt#termin"
                prefetch={true}
                title="Termin vereinbaren"
                className={cn(
                  'flex items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xs',
                  scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                )}
              >
                <svg
                  className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="sr-only">Termin vereinbaren</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className={cn(
                'flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 lg:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
              )}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
              <span className="sr-only">{open ? 'Schliessen' : 'Menü'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Floating Drawer */}
        {open && (
          <div
            id={panelId}
            className="mt-2 rounded-2xl border border-black/[0.08] bg-white/95 p-5 shadow-xl backdrop-blur-md lg:hidden motion-fade-down"
          >
            <nav aria-label="Mobilnavigation">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {items.map((item) => (
                  <li key={`mobile-${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      prefetch={item.href.startsWith('/') ? true : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center px-3 rounded-lg font-sans text-base font-medium text-[#112926] hover:bg-black/[0.03] no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
              <ButtonLink
                href="/kontakt#termin"
                size="md"
                className="w-full justify-center rounded-xl text-white hover:opacity-90 transition-all" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text, #ffffff)' }}
                onClick={() => setOpen(false)}
              >
                Termin vereinbaren ↗
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
