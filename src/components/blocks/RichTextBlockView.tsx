import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Container, Section } from '@/design-system'
import type { RichTextBlock } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = { block: RichTextBlock }

export function RichTextBlockView({ block }: Props) {
  return (
    <Section>
      <Container size="md">
        <LexicalRichText data={block.content as SerializedEditorState} />
      </Container>
    </Section>
  )
}
