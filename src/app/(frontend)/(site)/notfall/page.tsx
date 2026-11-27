import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import { Container, Stack } from '@/design-system'
import { getPageBySlug, getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('notfall', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/notfall',
    fallbackTitle: `Notfall | ${location.name}`,
    fallbackDescription: `Notfallinformationen der ${location.name}.`,
  })
}

export default async function EmergencyPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const [page, settings] = await Promise.all([
    getPageBySlug('notfall', location.id, draft),
    getSiteSettings().catch(() => null),
  ])

  if (page?.layout && page.layout.length > 0) {
    return (
      <main id="main">
        <RenderBlocks blocks={page.layout} location={location} />
      </main>
    )
  }

  const heroMediaDoc = isMedia(page?.featuredImage)
    ? page!.featuredImage
    : isMedia(settings?.sharedMedia?.defaultHeroImage)
      ? settings!.sharedMedia!.defaultHeroImage
      : null
  const emergencyServices =
    (location as { emergencyServices?: Array<{ id?: string; region: string; phone: string }> })
      .emergencyServices ?? []
  const emergencyLeaflet = isMedia(
    (location as { emergencyLeaflet?: unknown }).emergencyLeaflet,
  )
    ? ((location as { emergencyLeaflet?: unknown }).emergencyLeaflet as { url?: string | null })
    : null
  const emergencyLeafletSrc = emergencyLeaflet?.url ? toSiteImageSrc(emergencyLeaflet.url) : null
  const emergencyLeafletLabel =
    (location as { emergencyLeafletLabel?: string | null }).emergencyLeafletLabel ||
    'Merkblatt zum Zahnunfall (PDF)'

  return (
    <main id="main">
      <PageHeroBand
        eyebrow={location.address.city || 'Appenzell'}
        title={page?.title || 'Zahnärztlicher'}
        titleHighlight="Notfalldienst."
        lead="Schnelle Hilfe bei akuten Zahnschmerzen oder Zahnunfällen. Ausserhalb unserer Öffnungszeiten hilft Ihnen der regionale zahnärztliche Notfalldienst."
        mediaSrc={heroMediaDoc ? toSiteImageSrc(heroMediaDoc.sizes?.hero?.url || heroMediaDoc.url) : null}
        mediaAlt={heroMediaDoc?.alt || 'Praxisbereich der Zahnarztpraxis Palatty Appenzell'}
      >
        {location.phone ? (
          <a href={`tel:${location.phone.replace(/\s+/g, '')}`} className="praxis-cta-btn">
            <span>Jetzt anrufen: {location.phone}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </PageHeroBand>

      <section className="py-[var(--section-y)] bg-white">
        <Container>
          <div className="contact-hub-grid">
            <div className="contact-hub-card">
              <Stack gap="4">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  Während der Öffnungszeiten
                </span>
                <h2 className="m-0 font-display text-2xl font-semibold text-[#0e2a2f]">
                  Direktkontakt Appenzell
                </h2>
                <p className="m-0 font-sans text-[0.95rem] leading-relaxed text-[#52686c]">
                  Bitte rufen Sie uns bei akuten Schmerzen frühzeitig an, damit wir am selben Tag
                  einen passenden Termin für Sie einplanen können.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {location.phone ? (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, '')}`}
                      className="contact-pill-action"
                    >
                      {location.phone}
                    </a>
                  ) : null}
                  <Link href="/kontakt" prefetch={true} className="contact-pill-action">
                    <span>Zur Kontaktseite</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Stack>
            </div>

            <div className="contact-hub-card contact-hub-card--accent">
              <Stack gap="4">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  Ausserhalb der Praxiszeiten
                </span>
                <h2 className="m-0 font-display text-2xl font-semibold text-[#0e2a2f]">
                  Regionaler Notfalldienst
                </h2>
                <p className="m-0 font-sans text-[0.95rem] leading-relaxed text-[#496064]">
                  {location.emergencyInfo ||
                    'Bei akuten Schmerzen ausserhalb unserer Öffnungszeiten erreichen Sie den regionalen zahnärztlichen Notfalldienst.'}
                </p>
                {emergencyServices.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {emergencyServices.map((item, idx) => (
                      <a
                        key={item.id || idx}
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        className="contact-pill-action"
                      >
                        {item.region}: {item.phone}
                      </a>
                    ))}
                  </div>
                ) : null}
                {emergencyLeafletSrc ? (
                  <div>
                    <a
                      href={emergencyLeafletSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-pill-action"
                    >
                      <span>{emergencyLeafletLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                ) : null}
              </Stack>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
