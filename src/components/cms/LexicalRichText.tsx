import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

import { Prose } from '@/design-system'

type LexicalRichTextProps = {
  data: SerializedEditorState | null | undefined
  className?: string
}

export function LexicalRichText({ data, className }: LexicalRichTextProps) {
  if (!data?.root) return null

  return (
    <Prose className={className}>
      <RichText data={data} />
    </Prose>
  )
}
