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
    path: '/datenschutz',
    fallbackTitle: `Datenschutz | ${location.name}`,
    fallbackDescription: `Datenschutzerklärung der ${location.name}.`,
  })
}

export default async function PrivacyPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>Rechtliches</Eyebrow>
            <Heading level={1}>Datenschutz</Heading>
            <Lead>
              Platzhalter. Der vollständige, schweizkonforme Text (nDSG) wird nach rechtlicher
              Freigabe eingepflegt — der bisherige DSGVO-Template-Text wird nicht 1:1 übernommen.
            </Lead>
          </Stack>
        </Container>
      </Section>
      <Section tone="snow">
        <Container size="md">
          <Stack gap="4">
            <Text className="font-medium">Verantwortliche Stelle (Migrationsangabe)</Text>
            <Text>
              {location.name}
              <br />
              {location.address.street}, {location.address.postalCode} {location.address.city}
            </Text>
            {location.email ? (
              <Text>
                Kontakt:{' '}
                <TextLink href={`mailto:${location.email}`}>{location.email}</TextLink>
              </Text>
            ) : null}
            <Text size="sm" tone="muted">
              Details zu Cookies, Hosting und Drittanbietern folgen mit dem freigegebenen
              Rechtstext.
            </Text>
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
