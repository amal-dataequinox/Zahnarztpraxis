import Link from 'next/link'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Container, Divider, Stack, Text, TextLink } from '@/design-system'
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

export function SiteFooter({
  location,
  navigation,
  settings,
}: SiteFooterProps) {
  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const year = new Date().getFullYear()
  const phone = location.phone || settings.brandContact?.phone
  const email = location.email || settings.brandContact?.email
  const socialLinks = settings.socialLinks ?? []

  return (
    <footer className="site-footer-modern text-[var(--palatty-snow)]">
      <Container className="py-[var(--section-y-tight)]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <Stack gap="3">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              <Text tone="inverse" className="font-semibold tracking-[var(--tracking-tight)]">
                {settings.brandName || location.name}
              </Text>
            </div>
            <Text tone="inverse" size="sm" className="opacity-80">
              {location.address.street}
              <br />
              {location.address.postalCode} {location.address.city}
            </Text>
            {phone ? (
              <TextLink href={`tel:${phone.replace(/\s+/g, '')}`} className="text-[var(--palatty-snow)]">
                {phone}
              </TextLink>
            ) : null}
            {email ? (
              <TextLink href={`mailto:${email}`} className="text-[var(--palatty-snow)]">
                {email}
              </TextLink>
            ) : null}
            {settings.footerText ? (
              <div className="pt-1 text-xs opacity-75 [&_p]:m-0 [&_p]:text-[var(--palatty-snow)]">
                <LexicalRichText data={settings.footerText as any} />
              </div>
            ) : null}
          </Stack>

          <Stack gap="3">
            <Text
              tone="inverse"
              size="sm"
              className="font-medium uppercase tracking-[var(--tracking-wide)] opacity-70"
            >
              {(settings as any).footerHoursLabel || 'Öffnungszeiten'}
            </Text>
            <div className="[&_li]:text-[var(--palatty-snow)] [&_span]:text-[color-mix(in_oklab,var(--palatty-snow)_70%,transparent)]">
              <OpeningHoursList entries={location.openingHours} />
            </div>
          </Stack>

          <Stack gap="3">
            <Text
              tone="inverse"
              size="sm"
              className="font-medium uppercase tracking-[var(--tracking-wide)] opacity-70"
            >
              {(settings as any).footerNavLabel || 'Navigation'}
            </Text>
            <ul className="m-0 list-none space-y-1 p-0">
              {items.map((item) => (
                <li key={`footer-${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    prefetch={item.href.startsWith('/') ? true : undefined}
                    className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/notfall"
                  prefetch={true}
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                >
                  {(settings as any).footerNotfallLabel || 'Notfall'}
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  prefetch={true}
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                >
                  {(settings as any).footerJobsLabel || 'Jobs'}
                </Link>
              </li>
            </ul>
          </Stack>

          <Stack gap="3">
            <Text
              tone="inverse"
              size="sm"
              className="font-medium uppercase tracking-[var(--tracking-wide)] opacity-70"
            >
              {(settings as any).footerLegalLabel || 'Praxis & Rechtliches'}
            </Text>
            <Text tone="inverse" size="sm" className="opacity-90 font-medium">
              {location.name}
            </Text>
            {socialLinks.length > 0 ? (
              <ul className="m-0 flex flex-wrap gap-3 list-none p-0 pt-1">
                {socialLinks.map((soc, idx) => (
                  <li key={soc.id || idx}>
                    <a
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[length:var(--text-xs)] uppercase tracking-wider text-[var(--palatty-snow)]/80 hover:text-[var(--palatty-snow)] underline-offset-4 hover:underline"
                    >
                      {soc.platform} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="m-0 list-none space-y-1 p-0 pt-2">
              <li>
                <Link
                  href="/impressum"
                  prefetch={true}
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/75 no-underline hover:underline"
                >
                  {(settings as any).footerImpressumLabel || 'Impressum'}
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  prefetch={true}
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/75 no-underline hover:underline"
                >
                  {(settings as any).footerDatenschutzLabel || 'Datenschutz'}
                </Link>
              </li>
            </ul>
          </Stack>
        </div>

        <Divider className="my-8 border-[color-mix(in_oklab,var(--palatty-snow)_16%,transparent)]" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Text size="xs" tone="inverse" className="opacity-60">
            © {year} {settings.brandName || 'Zahnarztpraxis Palatty'} · {location.address.city}
          </Text>
          {location.emergencyInfo ? (
            <Text size="xs" tone="inverse" className="max-w-xl opacity-70">
              Notfall: {location.emergencyInfo}
            </Text>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
