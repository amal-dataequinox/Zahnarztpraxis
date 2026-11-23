import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { TeamOverviewBlockView } from '@/components/blocks/TeamOverviewBlockView'
import { Container, Eyebrow, Heading, Lead, Section, Stack } from '@/design-system'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  return generatePageMetadata({
    location,
    path: '/team',
    fallbackTitle: `Team | ${location.name}`,
    fallbackDescription: `Team der ${location.name}.`,
  })
}

export default async function TeamPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>{location.address.city}</Eyebrow>
            <Heading level={1}>Team</Heading>
            <Lead>
              Porträts stammen aus dem freigegebenen SDN-Fotopaket. Namen folgen den
              Lieferdateien; Berufsbezeichnungen ergänzt die Praxis im CMS.
            </Lead>
          </Stack>
        </Container>
      </Section>
      <TeamOverviewBlockView
        location={location}
        block={{
          blockType: 'teamOverview',
          heading: 'Unsere Mitarbeitenden',
        }}
      />
    </main>
  )
}
