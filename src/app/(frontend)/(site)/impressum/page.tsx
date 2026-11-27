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
  const page = await getPageBySlug('impressum', location.id, draft)
  return generatePageMetadata({
    location,
    page,
    path: '/impressum',
    fallbackTitle: `Impressum | ${location.name}`,
    fallbackDescription: `Impressum der ${location.name}.`,
  })
}

export default async function ImpressumPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('impressum', location.id, draft)

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
            <Heading level={1}>{page?.title || 'Impressum'}</Heading>
            <Lead>Gesetzliche Angaben gemäss schweizerischem Recht.</Lead>
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
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
