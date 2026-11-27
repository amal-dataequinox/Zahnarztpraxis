import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Container } from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location, Navigation, SiteSetting } from '@/payload-types'
import { resolveCMSLink } from '@/utilities/cmsLink'
import { OpeningHoursList } from './OpeningHoursList'

type SiteFooterProps = {
  location: Location
  navigation: Navigation | null
  settings: SiteSetting
  locationOptions: LocationOption[]
}

function renderSocialIcon(platform?: string | null) {
  const key = (platform || '').toLowerCase()
  const cls = 'h-4 w-4'
  if (key.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  if (key.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  }
  if (key.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
      </svg>
    )
  }
  return <span className="text-xs font-semibold uppercase">{(platform || '↗').slice(0, 2)}</span>
}

export function SiteFooter({ location, navigation, settings }: SiteFooterProps) {
  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const year = new Date().getFullYear()
  const phone = location.phone || settings.brandContact?.phone
  const email = location.email || settings.brandContact?.email
  const socialLinks = settings.socialLinks ?? []
  const bookingCtaLabel = settings.bookingCtaLabel || 'Termin vereinbaren'
  const bookingHref = location.bookingUrl || '/kontakt#termin'
  const isExternalBooking = bookingHref.startsWith('http')

  return (
    <footer className="site-footer-modern text-[var(--palatty-snow)]">
      <Container className="relative z-10 py-14 sm:py-16 lg:py-20">
        {/* Top Architectural Brand & Action Strip */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 mb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              prefetch={true}
              className="inline-flex w-fit items-center no-underline transition-opacity duration-300 hover:opacity-90"
            >
              <Image
                src="/design-system/brand/logo-palatty-white.png"
                alt={settings.brandName || location.name}
                width={932}
                height={168}
                unoptimized
                className="h-9 sm:h-11 w-auto object-contain object-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
              />
            </Link>
            {settings.footerText ? (
              <div className="max-w-md text-sm leading-relaxed text-white/70 [&_p]:m-0 [&_p]:text-white/70">
                <LexicalRichText data={settings.footerText as any} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isExternalBooking ? (
              <a
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full px-6 py-2.5 font-sans text-sm font-semibold no-underline shadow-[0_10px_28px_-10px_color-mix(in_oklab,var(--color-accent)_75%,transparent)] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-accent-text, #ffffff)',
                }}
              >
                <span>{bookingCtaLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link
                href={bookingHref}
                prefetch={true}
                className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full px-6 py-2.5 font-sans text-sm font-semibold no-underline shadow-[0_10px_28px_-10px_color-mix(in_oklab,var(--color-accent)_75%,transparent)] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-accent-text, #ffffff)',
                }}
              >
                <span>{bookingCtaLabel}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            )}

            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-sans text-sm font-semibold text-white no-underline backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.1]"
              >
                <svg
                  className="h-4 w-4 text-[var(--color-accent)]"
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
                <span className="tabular-nums">{phone}</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Main 12-Column Asymmetric Content Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Kontakt & Standort (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <h2 className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              Standort & Kontakt
            </h2>

            <div className="flex flex-col gap-3.5">
              {location.googleMapsUrl ? (
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 text-sm text-white/85 no-underline transition-colors hover:text-white"
                >
                  <span className="footer-icon-chip mt-0.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">
                    <span className="block font-medium text-white">{location.name}</span>
                    {location.address.street}
                    <br />
                    {location.address.postalCode} {location.address.city}{' '}
                    <span className="text-white/45" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </a>
              ) : (
                <div className="group flex items-start gap-3.5 text-sm text-white/85">
                  <span className="footer-icon-chip mt-0.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">
                    <span className="block font-medium text-white">{location.name}</span>
                    {location.address.street}
                    <br />
                    {location.address.postalCode} {location.address.city}
                  </span>
                </div>
              )}

              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="group flex items-center gap-3.5 text-sm font-medium text-white/85 no-underline transition-colors hover:text-white"
                >
                  <span className="footer-icon-chip">
                    <svg
                      className="h-4 w-4"
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
                  </span>
                  <span className="tabular-nums">{phone}</span>
                </a>
              ) : null}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3.5 text-sm font-medium text-white/85 no-underline transition-colors hover:text-white"
                >
                  <span className="footer-icon-chip">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span className="break-all">{email}</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Column 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              {(settings as { footerNavLabel?: string | null }).footerNavLabel || 'Navigation'}
            </h2>
            <ul className="m-0 list-none space-y-1 p-0">
              {items.map((item) => (
                <li key={`footer-${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    prefetch={item.href.startsWith('/') ? true : undefined}
                    className="inline-flex min-h-10 items-center font-sans text-sm font-medium text-white/75 no-underline transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!items.some((item) => item.href === '/notfall') ? (
                <li>
                  <Link
                    href="/notfall"
                    prefetch={true}
                    className="inline-flex min-h-10 items-center font-sans text-sm font-medium text-white/75 no-underline transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {(settings as { footerNotfallLabel?: string | null }).footerNotfallLabel || 'Notfall'}
                  </Link>
                </li>
              ) : null}
              {!items.some((item) => item.href === '/jobs') ? (
                <li>
                  <Link
                    href="/jobs"
                    prefetch={true}
                    className="inline-flex min-h-10 items-center font-sans text-sm font-medium text-white/75 no-underline transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    {(settings as { footerJobsLabel?: string | null }).footerJobsLabel || 'Jobs'}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Column 3: Rechtliches & Social (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              {(settings as { footerLegalLabel?: string | null }).footerLegalLabel || 'Praxis & Rechtliches'}
            </h2>
            <ul className="m-0 list-none space-y-1 p-0">
              <li>
                <Link
                  href="/impressum"
                  prefetch={true}
                  className="inline-flex min-h-10 items-center font-sans text-sm font-medium text-white/75 no-underline transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {(settings as { footerImpressumLabel?: string | null }).footerImpressumLabel || 'Impressum'}
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  prefetch={true}
                  className="inline-flex min-h-10 items-center font-sans text-sm font-medium text-white/75 no-underline transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {(settings as { footerDatenschutzLabel?: string | null }).footerDatenschutzLabel || 'Datenschutz'}
                </Link>
              </li>
            </ul>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {socialLinks.map((soc, idx) => (
                  <a
                    key={soc.id || idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${soc.platform} öffnen`}
                    title={soc.platform}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                  >
                    {renderSocialIcon(soc.platform)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Column 4: Frosted Opening Hours & Emergency Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="footer-glass-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                  {(settings as { footerHoursLabel?: string | null }).footerHoursLabel || 'Öffnungszeiten'}
                </h2>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-sans text-[11px] font-medium text-white/75"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  {location.address.city}
                </span>
              </div>

              <OpeningHoursList entries={location.openingHours} variant="inverse" />

              {location.emergencyInfo ? (
                <div className="mt-4 border-t border-white/10 pt-3.5">
                  <Link
                    href="/notfall"
                    prefetch={true}
                    className="group flex items-start gap-2.5 text-xs leading-relaxed text-white/70 no-underline transition-colors hover:text-white"
                  >
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-white/90">Notfall:</strong>{' '}
                      {location.emergencyInfo}
                    </span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © {year} {settings.brandName || 'Zahnarztpraxis Palatty'} · {location.address.city}
          </p>
          <p className="m-0 text-white/45">
            {location.address.street}, {location.address.postalCode} {location.address.city}
          </p>
        </div>
      </Container>
    </footer>
  )
}
