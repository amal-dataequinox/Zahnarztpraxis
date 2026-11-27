import React from 'react'

import {
  ServicesShowcaseClient,
  type JourneyStepItem,
  type ShowcaseServiceItem,
} from '@/components/services/ServicesShowcaseClient'
import type { Location, Service, ServicesOverviewBlock } from '@/payload-types'
import { getServicesForLocation, getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type Props = {
  block: ServicesOverviewBlock
  location: Location
}

export async function ServicesOverviewBlockView({ block, location }: Props) {
  const [selectedOrAll, settings] = await Promise.all([
    (() => {
      const selected =
        block.services?.filter((service): service is Service => typeof service === 'object') ?? []
      return selected.length > 0 ? Promise.resolve(selected) : getServicesForLocation(location.id)
    })(),
    getSiteSettings().catch(() => null),
  ])

  if (selectedOrAll.length === 0) return null

  const items: ShowcaseServiceItem[] = selectedOrAll.map((svc) => {
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

  const defaultHeroDoc = isMedia(settings?.sharedMedia?.defaultHeroImage)
    ? settings!.sharedMedia!.defaultHeroImage
    : null
  const fallbackCardImageSrc = defaultHeroDoc
    ? toSiteImageSrc(defaultHeroDoc.sizes?.card?.url || defaultHeroDoc.url)
    : null

  const ctaMediaDoc = isMedia(block.ctaImage)
    ? block.ctaImage
    : isMedia(settings?.sharedMedia?.defaultCtaImage)
      ? settings!.sharedMedia!.defaultCtaImage
      : null
  const ctaImageSrc = ctaMediaDoc
    ? toSiteImageSrc(ctaMediaDoc.sizes?.hero?.url || ctaMediaDoc.url)
    : null

  const journeySteps: JourneyStepItem[] = Array.isArray(block.journeySteps)
    ? block.journeySteps.map((s) => ({
        id: s.id,
        step: s.step,
        title: s.title,
        description: s.description,
        icon: s.icon,
      }))
    : []

  return (
    <ServicesShowcaseClient
      eyebrow={block.eyebrow || 'Leistungen'}
      heading={block.heading || 'Unser Angebot'}
      headingHighlight={block.headingHighlight || undefined}
      intro={
        block.intro ||
        'Moderne Zahnmedizin und einfühlsame Behandlungskonzepte für Ihre Zahngesundheit.'
      }
      cardLinkLabel={block.cardLinkLabel || 'Behandlung entdecken'}
      services={items}
      fallbackCardImageSrc={fallbackCardImageSrc}
      journeyEyebrow={block.journeyEyebrow || 'Unser Ablauf'}
      journeyHeading={block.journeyHeading || 'Ihr Besuch'}
      journeyHighlight={block.journeyHighlight || 'in drei klaren Schritten.'}
      journeyDescription={
        block.journeyDescription ||
        'Von der ersten Untersuchung bis zur nachhaltigen Nachsorge begleiten wir Sie strukturiert und verständlich.'
      }
      journeySteps={journeySteps}
      ctaEyebrow={block.ctaEyebrow || 'Termin & Beratung'}
      ctaHeading={block.ctaHeading || 'Persönliche Beratung'}
      ctaHighlight={block.ctaHighlight || 'in Appenzell.'}
      ctaDescription={
        block.ctaDescription ||
        'Sie möchten wissen, welche Behandlung optimal zu Ihren Zähnen passt? Vereinbaren Sie gerne Ihren Termin telefonisch oder direkt online.'
      }
      ctaButtonLabel={block.ctaButtonLabel || settings?.bookingCtaLabel || 'Termin vereinbaren'}
      ctaButtonHref={block.ctaButtonHref}
      ctaImageSrc={ctaImageSrc}
      ctaImageAlt={ctaMediaDoc?.alt || block.ctaHeading || 'Empfang der Zahnarztpraxis'}
      phone={location.phone}
      bookingUrl={location.bookingUrl}
      filterLabels={{
        all: (settings as { servicesFilterAllLabel?: string | null })?.servicesFilterAllLabel || undefined,
        vorsorge:
          (settings as { servicesFilterVorsorgeLabel?: string | null })?.servicesFilterVorsorgeLabel ||
          undefined,
        zahnerhalt:
          (settings as { servicesFilterZahnerhaltLabel?: string | null })
            ?.servicesFilterZahnerhaltLabel || undefined,
        aesthetik:
          (settings as { servicesFilterAesthetikLabel?: string | null })
            ?.servicesFilterAesthetikLabel || undefined,
        notfall:
          (settings as { servicesFilterNotfallLabel?: string | null })?.servicesFilterNotfallLabel ||
          undefined,
      }}
    />
  )
}
