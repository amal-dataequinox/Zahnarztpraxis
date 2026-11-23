import Image from 'next/image'
import React from 'react'

import { CMSImage } from '@/components/cms/CMSImage'
import { CMSLink } from '@/components/cms/CMSLink'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { AlpineHeroAtmosphere } from '@/components/three/AlpineHeroAtmosphere'
import {
  Container,
  EditorialSplit,
  Eyebrow,
  Heading,
  Lead,
  Section,
  Stack,
} from '@/design-system'
import type { HeroBlock, Location } from '@/payload-types'
import { locationSlug } from '@/utilities/locationSwitcher'
import { isMedia } from '@/utilities/media'
import { getPracticePhotos } from '@/utilities/practicePhotos'

type Props = {
  block: HeroBlock
  location: Location
}

/**
 * Hero — CMS photo wins when set; otherwise Distant Alpine atmosphere (Stage 4).
 */
export function HeroBlockView({ block, location }: Props) {
  const slug = locationSlug(location)
  const mirror = slug === 'gais'
  const hasImage = isMedia(block.image)
  const fallback = getPracticePhotos(slug)

  return (
    <Section spacing="none" className="border-b border-[var(--color-border)] overflow-hidden">
      <Container size="xl" className="px-0">
        {mirror && !hasImage ? (
          <p className="m-0 px-[var(--container-pad)] pt-4 font-sans text-[length:var(--text-xs)] text-[var(--palatty-slate)]">
            Atmosphere: Distant Alpine — Gais-specific photography follows later.
          </p>
        ) : null}
        <EditorialSplit
          mirror={mirror}
          density="hero"
          copy={
            <Stack gap="5" className="max-w-xl motion-fade-up">
              <Eyebrow>{location.address.city}</Eyebrow>
              <Heading level={1}>{block.heading}</Heading>
              {block.subheading ? <Lead>{block.subheading}</Lead> : null}
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                {block.cta?.label ? (
                  <CMSLink link={block.cta} appearance="button" variant="primary" size="lg" />
                ) : null}
                <BookingPlaceholder compact />
              </div>
            </Stack>
          }
          media={
            <div className="relative h-full min-h-[min(70vh,36rem)] overflow-hidden motion-fade-in lg:min-h-[min(88vh,52rem)]">
              {hasImage ? (
                <CMSImage
                  media={block.image}
                  size="hero"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 58vw"
                />
              ) : slug === 'appenzell' ? (
                <AlpineHeroAtmosphere />
              ) : (
                <Image
                  src={fallback.hero}
                  alt="Praxisinterieur aus dem gemeinsamen Fotopaket."
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 58vw"
                />
              )}
            </div>
          }
        />
      </Container>
    </Section>
  )
}
