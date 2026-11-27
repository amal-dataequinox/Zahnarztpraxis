import React from 'react'

import { CMSLink } from '@/components/cms/CMSLink'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import type { HeroBlock, Location } from '@/payload-types'
import { getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type Props = {
  block: HeroBlock
  location: Location
}

export async function HeroBlockView({ block, location }: Props) {
  const settings = await getSiteSettings().catch(() => null)
  const blockMedia = isMedia(block.image) ? block.image : null
  const defaultHeroMedia = isMedia(settings?.sharedMedia?.defaultHeroImage)
    ? settings!.sharedMedia!.defaultHeroImage
    : null
  const chosenMedia = blockMedia || defaultHeroMedia
  const mediaSrc = chosenMedia
    ? toSiteImageSrc(chosenMedia.sizes?.hero?.url || chosenMedia.url)
    : null
  const hasCta = Boolean(block.cta?.label)
  const showDefaultActions = !(block as { hideDefaultActions?: boolean | null }).hideDefaultActions

  return (
    <PageHeroBand
      eyebrow={block.eyebrow || location.address.city || 'Appenzell'}
      title={block.heading}
      titleHighlight={block.titleHighlight || undefined}
      lead={block.subheading || undefined}
      mediaSrc={mediaSrc}
      mediaAlt={chosenMedia?.alt || `${block.heading} — ${location.name}`}
    >
      {hasCta || showDefaultActions ? (
        <div className="flex flex-wrap items-center gap-3">
          {hasCta && block.cta ? (
            <CMSLink link={block.cta} appearance="button" variant="primary" size="lg" />
          ) : null}
          {showDefaultActions ? (
            <>
              <BookingPlaceholder
                compact
                location={location}
                label={settings?.bookingCtaLabel || undefined}
              />
              {location.phone ? (
                <a
                  href={`tel:${location.phone.replace(/\s+/g, '')}`}
                  className="contact-pill-action"
                >
                  <span>{location.phone}</span>
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </PageHeroBand>
  )
}
