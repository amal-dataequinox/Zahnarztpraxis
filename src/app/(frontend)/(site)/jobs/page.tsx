import type { Metadata } from 'next'
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
  const page = await getPageBySlug('jobs', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/jobs',
    fallbackTitle: `Jobs | ${location.name}`,
    fallbackDescription: `Stellenangebote der ${location.name}.`,
  })
}

const BENEFITS = [
  {
    eyebrow: '01 / TEAMKULTUR',
    title: 'Kollegiales Miteinander',
    text: 'Kurze Wege, offene Kommunikation und ein eingespieltes Praxisteam im Herzen von Appenzell.',
  },
  {
    eyebrow: '02 / INFRASTRUKTUR',
    title: 'Moderne Behandlungsräume',
    text: 'Helle Räume mit viel Tageslicht, zeitgemässer Technik und strukturierten Abläufen.',
  },
  {
    eyebrow: '03 / ENTWICKLUNG',
    title: 'Gezielte Weiterbildung',
    text: 'Unterstützung bei fachlichen Fortbildungen in Zahnmedizin, Prophylaxe und Dentalassistenz.',
  },
]

export default async function JobsPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const [page, settings] = await Promise.all([
    getPageBySlug('jobs', location.id, draft),
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

  return (
    <main id="main">
      <PageHeroBand
        eyebrow={location.address.city || 'Appenzell'}
        title={page?.title || 'Jobs &'}
        titleHighlight="Karriere."
        lead={`Verstärken Sie unser engagiertes Praxisteam im Herzen von ${location.address.city}.`}
        mediaSrc={heroMediaDoc ? toSiteImageSrc(heroMediaDoc.sizes?.hero?.url || heroMediaDoc.url) : null}
        mediaAlt={heroMediaDoc?.alt || 'Teamarbeit am Empfang der Zahnarztpraxis Palatty Appenzell'}
      />

      <section className="py-[var(--section-y)] bg-white">
        <Container>
          <div className="service-bento-grid mb-12">
            {BENEFITS.map((item) => (
              <div key={item.eyebrow} className="contact-hub-card">
                <span className="care-pillar-eyebrow">{item.eyebrow}</span>
                <h2 className="mt-3 mb-2 font-display text-xl font-semibold text-[#0e2a2f]">
                  {item.title}
                </h2>
                <p className="m-0 font-sans text-sm leading-relaxed text-[#52686c]">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="contact-hub-card contact-hub-card--accent">
            <Stack gap="4" className="max-w-2xl">
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                Spontanbewerbung
              </span>
              <h2 className="palatty-display-h2">Wir freuen uns auf Ihre Nachricht</h2>
              <p className="m-0 font-sans text-base leading-relaxed text-[#4f6468]">
                Wir freuen uns jederzeit über motivierte Fachkräfte aus den Bereichen Zahnmedizin,
                Dentalhygiene, Prophylaxe und Dentalassistenz.
              </p>
              {location.email ? (
                <div className="pt-2">
                  <a href={`mailto:${location.email}?subject=Bewerbung`} className="praxis-cta-btn">
                    <span>Bewerbung an {location.email}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              ) : null}
            </Stack>
          </div>
        </Container>
      </section>
    </main>
  )
}
