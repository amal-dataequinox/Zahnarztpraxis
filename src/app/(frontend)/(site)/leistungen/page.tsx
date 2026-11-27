import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import {
  ServicesShowcaseClient,
  type ShowcaseServiceItem,
} from '@/components/services/ServicesShowcaseClient'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import { getPageBySlug, getServicesForLocation, getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('leistungen', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/leistungen',
    fallbackTitle: `Leistungen | ${location.name}`,
    fallbackDescription: `Behandlungsangebot der ${location.name}.`,
  })
}

export default async function ServicesPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('leistungen', location.id, draft)

  if (page?.layout && page.layout.length > 0) {
    return (
      <main id="main">
        <RenderBlocks blocks={page.layout} location={location} />
      </main>
    )
  }

  const [rawServices, settings] = await Promise.all([
    getServicesForLocation(location.id),
    getSiteSettings().catch(() => null),
  ])

  const defaultHeroDoc = isMedia(page?.featuredImage)
    ? page!.featuredImage
    : isMedia(settings?.sharedMedia?.defaultHeroImage)
      ? settings!.sharedMedia!.defaultHeroImage
      : null
  const defaultCtaDoc = isMedia(settings?.sharedMedia?.defaultCtaImage)
    ? settings!.sharedMedia!.defaultCtaImage
    : null

  const items: ShowcaseServiceItem[] = rawServices.map((svc) => {
    const imgDoc = isMedia(svc.featuredImage) ? svc.featuredImage : null
    return {
      id: svc.id,
      slug: svc.slug,
      name: svc.name,
      category: svc.category,
      shortDescription: svc.shortDescription,
      imageSrc: toSiteImageSrc(imgDoc?.sizes?.card?.url || imgDoc?.url),
      imageAlt: imgDoc?.alt || svc.name,
    }
  })

  return (
    <main id="main">
      <PageHeroBand
        eyebrow={location.address.city || 'Appenzell'}
        title={page?.title || 'Behandlungen &'}
        titleHighlight="Leistungen."
        lead="Unser umfassendes Behandlungsangebot für Ihre Zahngesundheit und Ihr Wohlbefinden."
        mediaSrc={defaultHeroDoc ? toSiteImageSrc(defaultHeroDoc.sizes?.hero?.url || defaultHeroDoc.url) : null}
        mediaAlt={defaultHeroDoc?.alt || location.name}
      />
      <ServicesShowcaseClient
        services={items}
        fallbackCardImageSrc={defaultHeroDoc ? toSiteImageSrc(defaultHeroDoc.sizes?.card?.url || defaultHeroDoc.url) : null}
        ctaImageSrc={defaultCtaDoc ? toSiteImageSrc(defaultCtaDoc.sizes?.hero?.url || defaultCtaDoc.url) : null}
        ctaImageAlt={defaultCtaDoc?.alt || location.name}
        phone={location.phone}
        bookingUrl={location.bookingUrl}
      />
    </main>
  )
}
