import React, { Fragment } from 'react'

import type { Location, Page } from '@/payload-types'

import { CallToActionBlockView } from './CallToActionBlockView'
import { ContactBlockView } from './ContactBlockView'
import { HeroBlockView } from './HeroBlockView'
import { ImageGalleryBlockView } from './ImageGalleryBlockView'
import { ImageTextBlockView } from './ImageTextBlockView'
import { LocationInformationBlockView } from './LocationInformationBlockView'
import { RichTextBlockView } from './RichTextBlockView'
import { ServicesOverviewBlockView } from './ServicesOverviewBlockView'
import { TeamOverviewBlockView } from './TeamOverviewBlockView'

type Layout = NonNullable<Page['layout']>

type RenderBlocksProps = {
  blocks: Layout | null | undefined
  location: Location
}

export function RenderBlocks({ blocks, location }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return <HeroBlockView key={key} block={block} location={location} />
          case 'richText':
            return <RichTextBlockView key={key} block={block} />
          case 'imageText':
            return <ImageTextBlockView key={key} block={block} />
          case 'imageGallery':
            return <ImageGalleryBlockView key={key} block={block} />
          case 'servicesOverview':
            return <ServicesOverviewBlockView key={key} block={block} location={location} />
          case 'teamOverview':
            return <TeamOverviewBlockView key={key} block={block} location={location} />
          case 'locationInformation':
            return <LocationInformationBlockView key={key} block={block} location={location} />
          case 'contact':
            return <ContactBlockView key={key} block={block} location={location} />
          case 'callToAction':
            return <CallToActionBlockView key={key} block={block} />
          default:
            return null
        }
      })}
    </Fragment>
  )
}
