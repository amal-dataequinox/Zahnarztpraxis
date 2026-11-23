import React from 'react'

import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { Container, Eyebrow, Heading, Section, Stack, Text } from '@/design-system'
import type { CallToActionBlock } from '@/payload-types'

type Props = {
  block: CallToActionBlock
}

/**
 * CTA band. Does not deep-link to unverified booking providers.
 * Uses the identifiable Phase 3 booking placeholder.
 */
export function CallToActionBlockView({ block }: Props) {
  return (
    <Section tone="snow" className="border-y border-[var(--color-border)]">
      <Container>
        <Stack gap="4" className="max-w-2xl motion-fade-up">
          <Eyebrow>Termin</Eyebrow>
          <Heading level={2}>{block.heading || 'Termin anfragen'}</Heading>
          {block.text ? <Text tone="muted">{block.text}</Text> : null}
          <BookingPlaceholder label={block.cta?.label || 'Termin anfragen'} />
        </Stack>
      </Container>
    </Section>
  )
}
