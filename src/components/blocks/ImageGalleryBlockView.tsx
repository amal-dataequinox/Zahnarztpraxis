import React from 'react'

import { CMSImage } from '@/components/cms/CMSImage'
import { Container, Eyebrow, Heading, MediaFrame, Section, Stack } from '@/design-system'
import type { ImageGalleryBlock } from '@/payload-types'

type Props = { block: ImageGalleryBlock }

export function ImageGalleryBlockView({ block }: Props) {
  const images = block.images ?? []
  if (images.length === 0) return null

  return (
    <Section>
      <Container>
        <Stack gap="8">
          {block.heading ? (
            <Stack gap="2">
              <Eyebrow>Galerie</Eyebrow>
              <Heading level={2}>{block.heading}</Heading>
            </Stack>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item, index) => (
              <MediaFrame key={item.id ?? index} aspect="photo" caption={item.caption || undefined}>
                <CMSImage media={item.image} size="card" className="h-full w-full object-cover" />
              </MediaFrame>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
