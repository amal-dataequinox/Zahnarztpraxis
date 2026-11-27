import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container, Eyebrow, Heading, Lead, Section, Stack, Text, TextLink } from '@/design-system'
import { getPageBySlug } from '@/utilities/cmsQueries'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('datenschutz', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/datenschutz',
    fallbackTitle: `Datenschutz | ${location.name}`,
    fallbackDescription: `Datenschutzerklärung der ${location.name}.`,
  })
}

export default async function PrivacyPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('datenschutz', location.id, draft)

  if (page?.layout && page.layout.length > 0) {
    return (
      <main id="main">
        <RenderBlocks blocks={page.layout} location={location} />
      </main>
    )
  }

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>Rechtliches</Eyebrow>
            <Heading level={1}>{page?.title || 'Datenschutz'}</Heading>
            <Lead>
              Informationen zur Bearbeitung von Personendaten nach schweizerischem Datenschutzrecht
              (nDSG).
            </Lead>
          </Stack>
        </Container>
      </Section>
      <Section tone="snow">
        <Container size="md">
          <Stack gap="4">
            <Text className="font-medium">Verantwortliche Stelle</Text>
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
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
