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
    path: '/impressum',
    fallbackTitle: `Impressum | ${location.name}`,
    fallbackDescription: `Impressum der ${location.name}.`,
  })
}

export default async function ImpressumPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>Rechtliches</Eyebrow>
            <Heading level={1}>Impressum</Heading>
            <Lead>
              Platzhalter mit Migrationsdaten. Rechtsgültiger Text und Firmierung folgen nach
              Praxis-/Anwaltsfreigabe (siehe Content-Audit).
            </Lead>
          </Stack>
        </Container>
      </Section>
      <Section tone="snow">
        <Container size="md">
          <Stack gap="4">
            <Text className="font-medium">{location.name}</Text>
            <Text>
              {location.address.street}
              <br />
              {location.address.postalCode} {location.address.city}
              <br />
              {location.address.country}
            </Text>
            {location.phone ? (
              <Text>
                Tel.:{' '}
                <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`}>
                  {location.phone}
                </TextLink>
              </Text>
            ) : null}
            {location.email ? (
              <Text>
                E-Mail: <TextLink href={`mailto:${location.email}`}>{location.email}</TextLink>
              </Text>
            ) : null}
            <Text size="sm" tone="muted">
              Veraltete Drittanbieter-Kontakte aus dem WordPress-Theme werden nicht übernommen.
            </Text>
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
