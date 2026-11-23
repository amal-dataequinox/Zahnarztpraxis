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
    path: '/notfall',
    fallbackTitle: `Notfall | ${location.name}`,
    fallbackDescription: `Notfallinformationen der ${location.name}.`,
  })
}

export default async function EmergencyPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>{location.address.city}</Eyebrow>
            <Heading level={1}>Notfall</Heading>
            <Lead>
              Ausserhalb der Öffnungszeiten gilt der regionale zahnärztliche Notfalldienst. Angaben
              aus der Migration — bitte durch die Praxis bestätigen.
            </Lead>
          </Stack>
        </Container>
      </Section>
      <Section tone="snow">
        <Container size="md">
          <Stack gap="4">
            {location.emergencyInfo ? (
              <Text size="lg">{location.emergencyInfo}</Text>
            ) : (
              <Text tone="muted">Notfalltext folgt nach Freigabe im CMS.</Text>
            )}
            {location.phone ? (
              <Text>
                Praxistelefon (Öffnungszeiten):{' '}
                <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`}>
                  {location.phone}
                </TextLink>
              </Text>
            ) : null}
            <TextLink href="/kontakt" className="font-medium">
              Zur Kontaktseite →
            </TextLink>
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
