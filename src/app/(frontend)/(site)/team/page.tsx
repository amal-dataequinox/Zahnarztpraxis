import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { TeamOverviewBlockView } from '@/components/blocks/TeamOverviewBlockView'
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
  const page = await getPageBySlug('team', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/team',
    fallbackTitle: `Team | ${location.name}`,
    fallbackDescription: `Team der ${location.name}.`,
  })
}

export default async function TeamPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('team', location.id, draft)

  if (page?.layout && page.layout.length > 0) {
    return (
      <main id="main">
        <RenderBlocks blocks={page.layout} location={location} />
      </main>
    )
  }

  const settings = await getSiteSettings().catch(() => null)
  const heroMediaDoc = isMedia(page?.featuredImage)
    ? page!.featuredImage
    : isMedia(settings?.sharedMedia?.defaultHeroImage)
      ? settings!.sharedMedia!.defaultHeroImage
      : null

  return (
    <main id="main">
      <PageHeroBand
        eyebrow={location.address.city || 'Appenzell'}
        title={page?.title || 'Unser Team'}
        titleHighlight="für Ihr Lächeln."
        lead="Lernen Sie die Menschen kennen, die sich täglich mit Fachkompetenz, Ruhe und Feingefühl um Ihre Zahngesundheit kümmern."
        mediaSrc={heroMediaDoc ? toSiteImageSrc(heroMediaDoc.sizes?.hero?.url || heroMediaDoc.url) : null}
        mediaAlt={heroMediaDoc?.alt || `Team der ${location.name}`}
      />
      <TeamOverviewBlockView
        location={location}
        block={{
          blockType: 'teamOverview',
          heading: 'Unsere Mitarbeitenden',
        }}
      />
    </main>
  )
}
