import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/cms/CMSLink'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { Container, Stack } from '@/design-system'
import { cn } from '@/design-system/lib/cn'
import type { CallToActionBlock, Location } from '@/payload-types'
import { getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type Props = {
  block: CallToActionBlock
  location?: Location
}

export async function CallToActionBlockView({ block, location }: Props) {
  const settings = await getSiteSettings().catch(() => null)
  const hasCustomLink = Boolean(block.cta?.label && (block.cta?.url || block.cta?.page))

  const blockMedia = isMedia(block.image) ? block.image : null
  const defaultCtaMedia = isMedia(settings?.sharedMedia?.defaultCtaImage)
    ? settings!.sharedMedia!.defaultCtaImage
    : null
  const chosenMedia = blockMedia || defaultCtaMedia
  const imgSrc = chosenMedia
    ? toSiteImageSrc(chosenMedia.sizes?.hero?.url || chosenMedia.url)
    : null

  return (
    <section className="py-[var(--section-y)] bg-white">
      <Container>
        <div className="contact-hub-card contact-hub-card--accent">
          <div
            className={cn(
              'grid gap-8',
              imgSrc &&
                'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12',
            )}
          >
            <Stack gap="4">
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {block.eyebrow || 'Termin'}
              </span>
              <h2 className="palatty-display-h2">
                {block.heading || 'Persönliche Beratung vereinbaren'}
              </h2>
              {block.text ? (
                <p className="m-0 max-w-xl font-sans text-[0.98rem] leading-relaxed text-[#496064]">
                  {block.text}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {hasCustomLink && block.cta ? (
                  <CMSLink link={block.cta} appearance="button" variant="primary" size="lg" />
                ) : (
                  <BookingPlaceholder
                    label={block.cta?.label || settings?.bookingCtaLabel || 'Termin anfragen'}
                    location={location}
                  />
                )}
                {location?.phone ? (
                  <a
                    href={`tel:${location.phone.replace(/\s+/g, '')}`}
                    className="contact-pill-action"
                  >
                    <span>{location.phone}</span>
                  </a>
                ) : (
                  <Link href="/kontakt" prefetch={true} className="contact-pill-action">
                    <span>Zur Kontaktseite</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </Stack>

            {imgSrc ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/80 shadow-lg">
                <Image
                  src={imgSrc}
                  alt={chosenMedia?.alt || block.heading}
                  fill
                  quality={88}
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 45vw"
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
