import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { ContactBlockView } from '@/components/blocks/ContactBlockView'
import { LocationInformationBlockView } from '@/components/blocks/LocationInformationBlockView'
import { Container, Eyebrow, Heading, Lead, Section, Stack } from '@/design-system'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  return generatePageMetadata({
    location,
    path: '/kontakt',
    fallbackTitle: `Kontakt | ${location.name}`,
    fallbackDescription: `Kontakt und Öffnungszeiten der ${location.name}.`,
  })
}

export default async function ContactPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>{location.address.city}</Eyebrow>
            <Heading level={1}>Kontakt</Heading>
            <Lead>
              Adresse, Telefon und Zeiten für diesen Standort. Öffnungszeiten aus der Migration —
              Bestätigung durch die Praxis ausstehend. Online-Buchung ist ein Platzhalter.
            </Lead>
          </Stack>
        </Container>
      </Section>
      <ContactBlockView
        location={location}
        block={{
          blockType: 'contact',
          heading: 'Schreiben Sie uns',
          showContactForm: true,
          showBookingLink: true,
        }}
      />
      <LocationInformationBlockView
        location={location}
        block={{
          blockType: 'locationInformation',
          heading: 'Anfahrt & Zeiten',
          showAddress: true,
          showOpeningHours: true,
          showContact: true,
          showMap: true,
          showEmergencyInfo: true,
        }}
      />
    </main>
  )
}
