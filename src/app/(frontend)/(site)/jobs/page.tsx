import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Container, Eyebrow, Heading, Lead, Section, Stack, Text, TextLink } from '@/design-system'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  return generatePageMetadata({
    location,
    path: '/jobs',
    fallbackTitle: `Jobs | ${location.name}`,
    fallbackDescription: `Stellenangebote der ${location.name}.`,
  })
}

export default async function JobsPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>{location.address.city}</Eyebrow>
            <Heading level={1}>Jobs</Heading>
            <Lead>
              Offene Stellen werden hier veröffentlicht, sobald die Praxis freigegebene Inhalte im
              CMS hinterlegt.
            </Lead>
          </Stack>
        </Container>
      </Section>
      <Section tone="snow">
        <Container size="md">
          <Stack gap="4">
            <Text tone="muted">Derzeit sind keine Stellenausschreibungen freigegeben.</Text>
            {location.email ? (
              <Text>
                Spontane Bewerbungen:{' '}
                <TextLink href={`mailto:${location.email}`}>{location.email}</TextLink>
              </Text>
            ) : null}
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
