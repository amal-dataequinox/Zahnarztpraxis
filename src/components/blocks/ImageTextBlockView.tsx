import React from 'react'

import { CMSImage } from '@/components/cms/CMSImage'
import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Container, MediaFrame, Section } from '@/design-system'
import type { ImageTextBlock } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/design-system/lib/cn'

type Props = { block: ImageTextBlock }

export function ImageTextBlockView({ block }: Props) {
  const imageLeft = block.imagePosition !== 'right'

  return (
    <Section tone="snow">
      <Container>
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2',
            !imageLeft && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <MediaFrame aspect="photo">
            <CMSImage media={block.image} size="card" className="h-full w-full object-cover" />
          </MediaFrame>
          <LexicalRichText data={block.text as SerializedEditorState} />
        </div>
      </Container>
    </Section>
  )
}
