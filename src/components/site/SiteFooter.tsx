import Link from 'next/link'
import React from 'react'

import { Container, Divider, LocationSwitcher, Stack, Text, TextLink } from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location, Navigation, SiteSetting } from '@/payload-types'
import { locationSlug } from '@/utilities/locationSwitcher'
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
  locationOptions,
}: SiteFooterProps) {
  const items =
    navigation?.items
      ?.map((item) => resolveCMSLink(item.link))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const year = new Date().getFullYear()
  const current = locationSlug(location)

  return (
    <footer className="border-t border-[var(--color-border-strong)] bg-[var(--palatty-wood)] text-[var(--palatty-snow)]">
      <Container className="py-[var(--section-y-tight)]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <Stack gap="3">
            <Text tone="inverse" className="font-semibold tracking-[var(--tracking-tight)]">
              {settings.brandName || location.name}
            </Text>
            <Text tone="inverse" size="sm" className="opacity-80">
              {location.address.street}
              <br />
              {location.address.postalCode} {location.address.city}
            </Text>
            {location.phone ? (
              <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`} className="text-[var(--palatty-snow)]">
                {location.phone}
              </TextLink>
            ) : null}
            {location.email ? (
              <TextLink href={`mailto:${location.email}`} className="text-[var(--palatty-snow)]">
                {location.email}
              </TextLink>
            ) : null}
          </Stack>

          <Stack gap="3">
            <Text
              tone="inverse"
              size="sm"
              className="font-medium uppercase tracking-[var(--tracking-wide)] opacity-70"
            >
              Öffnungszeiten
            </Text>
            <div className="[&_li]:text-[var(--palatty-snow)] [&_span]:text-[color-mix(in_oklab,var(--palatty-snow)_70%,transparent)]">
              <OpeningHoursList entries={location.openingHours} />
            </div>
            <Text size="xs" tone="inverse" className="opacity-55">
              Angaben aus Migration — Bestätigung durch die Praxis ausstehend.
            </Text>
          </Stack>

          <Stack gap="3">
            <Text
              tone="inverse"
              size="sm"
              className="font-medium uppercase tracking-[var(--tracking-wide)] opacity-70"
            >
              Navigation
            </Text>
            <ul className="m-0 list-none space-y-1 p-0">
              {items.map((item) => (
                <li key={`footer-${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/notfall"
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                >
                  Notfall
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/85 no-underline hover:underline"
                >
                  Jobs
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
              Standorte
            </Text>
            <LocationSwitcher
              current={current}
              options={locationOptions}
              className="[&_a]:text-[var(--palatty-snow)] [&_a]:opacity-90"
            />
            <ul className="m-0 list-none space-y-1 p-0 pt-2">
              <li>
                <Link
                  href="/impressum"
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/75 no-underline hover:underline"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] text-[var(--palatty-snow)]/75 no-underline hover:underline"
                >
                  Datenschutz
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
