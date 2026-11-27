'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { ButtonLink } from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import { cn } from '@/design-system/lib/cn'
import type { Location, Navigation } from '@/payload-types'
import type { BrandLogo } from '@/utilities/brandLogos'
import { resolveCMSLink } from '@/utilities/cmsLink'

type SiteHeaderProps = {
  location: Location
  navigation: Navigation | null
  brandLogo: BrandLogo
  locationOptions?: LocationOption[]
  ctaLabel?: string
}

export function SiteHeader({
  location,
  navigation,
  brandLogo,
  ctaLabel = 'Termin vereinbaren',
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [indicator, setIndicator] = useState<{ x: number; visible: boolean }>({
    x: 0,
    visible: false,
  })
  const panelId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)

  const isOpen = openPath === pathname
  const overlayHome = pathname === '/'
  const isTransparent = overlayHome && !scrolled

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPath(null)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const bookingHref = location.bookingUrl || '/kontakt#termin'
  const isExternalBooking = bookingHref.startsWith('http')

  useLayoutEffect(() => {
    const list = navListRef.current
    if (!list || !isTransparent) {
      setIndicator((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      return
    }

    const updateIndicator = () => {
      const activeAnchor = list.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
      if (!activeAnchor) {
        setIndicator((prev) => (prev.visible ? { ...prev, visible: false } : prev))
        return
      }
      const listRect = list.getBoundingClientRect()
      const linkRect = activeAnchor.getBoundingClientRect()
      const centerX = linkRect.left - listRect.left + linkRect.width / 2 - 11
      setIndicator({ x: centerX, visible: true })
    }

    updateIndicator()

    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(updateIndicator)
    ro.observe(list)
    return () => ro.disconnect()
  }, [pathname, isTransparent, items.length])

  const iconButtonClass = cn(
    'flex items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
    scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
    isTransparent
      ? 'border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/45'
      : 'border-gray-200 text-gray-700 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5',
  )

  return (
    <header
      data-scrolled={scrolled}
      data-transparent={isTransparent}
      className={cn(
        'palatty-header z-50 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        overlayHome
          ? cn('fixed top-0 inset-x-0 px-4 sm:px-8 lg:px-10', scrolled ? 'pt-2 sm:pt-3' : 'pt-3 sm:pt-5')
          : cn('sticky inset-x-0 px-4 sm:px-8 lg:px-10 pb-2', scrolled ? 'top-2 sm:top-3' : 'top-3 sm:top-5'),
      )}
    >
      <div
        className="palatty-nav-shell mx-auto w-full pointer-events-auto"
        style={{
          maxWidth: 'var(--header-max-width, 1440px)',
        }}
      >
        <nav
          aria-label="Hauptnavigation"
          data-scrolled={scrolled}
          className={cn(
            'palatty-nav-pill relative flex items-center justify-between rounded-full border',
            scrolled
              ? 'h-12 sm:h-[56px] px-5 sm:px-8 lg:px-10'
              : isTransparent
                ? 'h-14 sm:h-[68px] px-2 sm:px-4'
                : 'h-14 sm:h-[68px] px-5 sm:px-8 lg:px-10',
          )}
        >
          {/* 1. Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-3 no-underline transition-opacity duration-300 hover:opacity-90"
              onClick={() => setOpenPath(null)}
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
                  aria-hidden={isTransparent || undefined}
                  className={cn(
                    'w-auto object-contain object-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isTransparent ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible',
                    scrolled
                      ? 'h-6 sm:h-7 md:h-8 max-w-[135px] sm:max-w-[185px] md:max-w-[215px]'
                      : 'h-8 sm:h-9 md:h-10 max-w-[165px] sm:max-w-[230px] md:max-w-[270px]',
                  )}
                />
                {overlayHome ? (
                  <Image
                    src="/design-system/brand/logo-palatty-white.png"
                    alt={brandLogo.alt}
                    width={932}
                    height={168}
                    priority
                    unoptimized
                    aria-hidden={!isTransparent || undefined}
                    className={cn(
                      'pointer-events-none absolute inset-y-0 left-0 my-auto w-auto object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isTransparent ? 'opacity-100 visible' : 'opacity-0 invisible',
                      scrolled
                        ? 'h-6 sm:h-7 md:h-8 max-w-[135px] sm:max-w-[185px] md:max-w-[215px]'
                        : 'h-8 sm:h-9 md:h-10 max-w-[165px] sm:max-w-[230px] md:max-w-[270px]',
                    )}
                  />
                ) : null}
              </div>
            </Link>
          </div>

          {/* 2. Center: Navigation Items (Desktop) */}
          <div className="hidden lg:flex items-center justify-center">
            <ul
              ref={navListRef}
              className="relative m-0 flex list-none items-center gap-2 lg:gap-4 xl:gap-6 p-0 transition-all duration-300"
            >
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
                        'palatty-nav-link group relative inline-flex items-center overflow-hidden rounded-full font-sans font-medium transition-all duration-300 no-underline',
                        scrolled ? 'px-3.5 py-1 text-sm sm:text-[15px]' : 'px-4 py-1.5 text-[15px] lg:text-base',
                        isTransparent
                          ? cn(
                              'min-h-[44px]',
                              active ? 'text-white font-semibold' : 'text-white/85 hover:text-white',
                            )
                          : active
                            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold'
                            : 'text-[#4A5568] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5',
                      )}
                    >
                      {isTransparent ? (
                        <span
                          aria-hidden="true"
                          className="palatty-nav-link-glow bg-white/10"
                        />
                      ) : null}
                      <span className="relative z-10">{item.label}</span>

                      {isTransparent && active && !indicator.visible ? (
                        <span
                          aria-hidden="true"
                          className="palatty-nav-indicator"
                          style={{ left: '50%', transform: 'translate3d(-50%, 0, 0)' }}
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}

              {isTransparent && indicator.visible ? (
                <span
                  aria-hidden="true"
                  className="palatty-nav-indicator"
                  style={{
                    transform: `translate3d(${indicator.x}px, 0, 0)`,
                    opacity: 1,
                  }}
                />
              ) : null}
            </ul>
          </div>

          {/* 3. Right: Action Buttons & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 transition-all duration-300">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* 1. Direct Phone Call */}
              {location.phone ? (
                <a
                  href={`tel:${location.phone}`}
                  title={`Praxis anrufen: ${location.phone}`}
                  className={iconButtonClass}
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

              {/* 2. Appointment / Booking */}
              {(() => {
                const bookingClassName = cn(
                  'flex items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xs',
                  scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                  isTransparent
                    ? 'border-[var(--color-accent)]/75 bg-[var(--color-accent)]/25 text-white hover:bg-[var(--color-accent)] hover:text-white'
                    : 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white',
                )
                const bookingIcon = (
                  <>
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
                    <span className="sr-only">{ctaLabel}</span>
                  </>
                )

                return isExternalBooking ? (
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={ctaLabel}
                    className={bookingClassName}
                  >
                    {bookingIcon}
                  </a>
                ) : (
                  <Link href={bookingHref} prefetch={true} title={ctaLabel} className={bookingClassName}>
                    {bookingIcon}
                  </Link>
                )
              })()}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                'flex items-center justify-center rounded-full border lg:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                scrolled ? 'h-8 w-8 sm:h-8.5 sm:w-8.5' : 'h-9 w-9 sm:h-10 sm:w-10',
                isTransparent
                  ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100',
              )}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenPath(isOpen ? null : pathname)}
            >
              {isOpen ? (
                <svg
                  className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  className={cn('transition-all duration-300', scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
              <span className="sr-only">{isOpen ? 'Schliessen' : 'Menü'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile Floating Drawer (Exact Previous White Card) */}
        {isOpen ? (
          <div
            id={panelId}
            className="palatty-mobile-panel mt-2 rounded-2xl border border-black/[0.08] bg-white/95 p-5 shadow-xl backdrop-blur-md lg:hidden"
          >
            <nav aria-label="Mobilnavigation">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {items.map((item, index) => (
                  <li
                    key={`mobile-${item.href}-${item.label}`}
                    className="palatty-mobile-item"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <Link
                      href={item.href}
                      prefetch={item.href.startsWith('/') ? true : undefined}
                      onClick={() => setOpenPath(null)}
                      className="flex min-h-11 items-center px-3 rounded-lg font-sans text-base font-medium text-[#112926] hover:bg-black/[0.03] no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
              {isExternalBooking ? (
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 font-sans text-sm font-medium tracking-[-0.01em] text-white no-underline hover:opacity-90 transition-all"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-text, #ffffff)',
                  }}
                  onClick={() => setOpenPath(null)}
                >
                  {ctaLabel} ↗
                </a>
              ) : (
                <ButtonLink
                  href={bookingHref}
                  size="md"
                  className="w-full justify-center rounded-xl text-white hover:opacity-90 transition-all"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-text, #ffffff)',
                  }}
                  onClick={() => setOpenPath(null)}
                >
                  {ctaLabel} ↗
                </ButtonLink>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
