import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { ContactBlockView } from '@/components/blocks/ContactBlockView'
import { LocationInformationBlockView } from '@/components/blocks/LocationInformationBlockView'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import { getPageBySlug, getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('kontakt', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/kontakt',
    fallbackTitle: `Kontakt | ${location.name}`,
    fallbackDescription: `Kontakt und Öffnungszeiten der ${location.name}.`,
  })
}

export default async function ContactPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const [page, settings] = await Promise.all([
    getPageBySlug('kontakt', location.id, draft),
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
        title={page?.title || 'Kontakt &'}
        titleHighlight="Terminvereinbarung."
        lead="Vereinbaren Sie Ihren Termin telefonisch, per E-Mail oder direkt über unser Kontaktformular. Wir sind gerne für Sie da."
        mediaSrc={heroMediaDoc ? toSiteImageSrc(heroMediaDoc.sizes?.hero?.url || heroMediaDoc.url) : null}
        mediaAlt={heroMediaDoc?.alt || 'Empfang der Zahnarztpraxis Palatty Appenzell'}
      />
      <ContactBlockView
        location={location}
        block={{
          blockType: 'contact',
          heading: 'Schreiben Sie uns',
          showContactForm: true,
          showBookingLink: true,
        }}
      />
      <LocationInformationBlockView
        location={location}
        block={{
          blockType: 'locationInformation',
          heading: 'Anfahrt & Öffnungszeiten',
          showAddress: true,
          showOpeningHours: true,
          showContact: true,
          showMap: true,
          showEmergencyInfo: true,
        }}
      />
    </main>
  )
}
