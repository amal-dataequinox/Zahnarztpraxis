import React from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import { Container, Stack, Text } from '@/design-system'
import type { Location, LocationInformationBlock } from '@/payload-types'
import { getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type Props = {
  block: LocationInformationBlock
  location: Location
}

export async function LocationInformationBlockView({ block, location }: Props) {
  const settings = await getSiteSettings().catch(() => null)
  const hinEmail = (location as { hinEmail?: string | null }).hinEmail
  const emergencyServices =
    (location as { emergencyServices?: Array<{ id?: string; region: string; phone: string }> })
      .emergencyServices ?? []
  const emergencyLeaflet = isMedia(
    (location as { emergencyLeaflet?: unknown }).emergencyLeaflet,
  )
    ? ((location as { emergencyLeaflet?: unknown }).emergencyLeaflet as {
        url?: string | null
        alt?: string | null
      })
    : null
  const emergencyLeafletSrc = emergencyLeaflet?.url ? toSiteImageSrc(emergencyLeaflet.url) : null
  const emergencyLeafletLabel =
    (location as { emergencyLeafletLabel?: string | null }).emergencyLeafletLabel ||
    'Merkblatt zum Zahnunfall (PDF)'
  const hasCoords =
    typeof location.latitude === 'number' && typeof location.longitude === 'number'

  const locationEyebrowLabel =
    (settings as { locationEyebrowLabel?: string | null })?.locationEyebrowLabel ||
    'Standort & Anfahrt'
  const locationMapActionLabel =
    (settings as { locationMapActionLabel?: string | null })?.locationMapActionLabel ||
    'Google Maps Route öffnen'
  const hoursHeadingLabel =
    (settings as { footerHoursLabel?: string | null })?.footerHoursLabel || 'Öffnungszeiten'
  const emergencySectionLabel =
    (settings as { emergencySectionLabel?: string | null })?.emergencySectionLabel ||
    'Notfalldienst'

  return (
    <section id="standort" className="py-[var(--section-y)] bg-white">
      <Container>
        <div className="contact-hub-grid">
          <Reveal className="contact-hub-card flex flex-col justify-between">
            <Stack gap="5">
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {locationEyebrowLabel}
              </span>
              <h2 className="palatty-display-h2">{block.heading || location.name}</h2>

              {block.showAddress !== false ? (
                <address className="not-italic font-sans text-lg leading-relaxed text-[#364e52]">
                  {location.address.street}
                  <br />
                  {location.address.postalCode} {location.address.city}
                  <br />
                  {location.address.country}
                </address>
              ) : null}

              {block.showContact !== false ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {location.phone ? (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, '')}`}
                      className="contact-pill-action"
                    >
                      {location.phone}
                    </a>
                  ) : null}
                  {location.email ? (
                    <a href={`mailto:${location.email}`} className="contact-pill-action">
                      {location.email}
                    </a>
                  ) : null}
                  {hinEmail ? (
                    <a href={`mailto:${hinEmail}`} className="contact-pill-action">
                      <span>HIN: {hinEmail}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </Stack>

            {hasCoords || location.googleMapsUrl ? (
              <div className="location-coords-strip mt-6">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[#364e52]">
                    {hasCoords
                      ? `${location.latitude!.toFixed(4)}° N · ${location.longitude!.toFixed(4)}° E · ${location.address.city}`
                      : location.address.city}
                  </span>
                </div>
                {location.googleMapsUrl ? (
                  <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#0e2a2f] no-underline hover:text-[var(--color-accent)] transition-colors"
                  >
                    <span>{locationMapActionLabel}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </Reveal>

          <Reveal className="contact-hub-card contact-hub-card--accent" delayMs={80}>
            <Stack gap="6">
              {block.showOpeningHours !== false ? (
                <Stack gap="3">
                  <p className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#546b6f]">
                    {hoursHeadingLabel}
                  </p>
                  <OpeningHoursList entries={location.openingHours} />
                </Stack>
              ) : null}

              {block.showEmergencyInfo &&
              (location.emergencyInfo || emergencyServices.length > 0 || emergencyLeafletSrc) ? (
                <div className="rounded-2xl border border-black/[0.08] bg-white/85 p-5 shadow-xs">
                  <p className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#546b6f]">
                    {emergencySectionLabel}
                  </p>
                  {location.emergencyInfo ? (
                    <Text size="sm" className="mt-1.5 text-[#364e52]">
                      {location.emergencyInfo}
                    </Text>
                  ) : null}
                  {emergencyServices.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {emergencyServices.map((item, idx) => (
                        <a
                          key={item.id || idx}
                          href={`tel:${item.phone.replace(/\s+/g, '')}`}
                          className="contact-pill-action bg-white"
                        >
                          <span>
                            {item.region}: {item.phone}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {emergencyLeafletSrc ? (
                    <div className="mt-3">
                      <a
                        href={emergencyLeafletSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-pill-action bg-white"
                      >
                        <span>{emergencyLeafletLabel}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Stack>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
