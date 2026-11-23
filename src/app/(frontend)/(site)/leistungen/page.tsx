import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import {
  Container,
  Eyebrow,
  Heading,
  IndexedRow,
  Lead,
  Section,
  Stack,
  Text,
} from '@/design-system'
import { getServicesForLocation } from '@/utilities/cmsQueries'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return {}
  return generatePageMetadata({
    location,
    path: '/leistungen',
    fallbackTitle: `Leistungen | ${location.name}`,
    fallbackDescription: `Behandlungsangebot der ${location.name}.`,
  })
}

export default async function ServicesPage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const services = await getServicesForLocation(location.id)

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>{location.address.city}</Eyebrow>
            <Heading level={1}>Leistungen</Heading>
            <Lead>
              Unser Behandlungsangebot. Ausführliche medizinische Beschreibungen werden von der
              Praxis geprüft und im CMS gepflegt — ohne erfundene Aussagen.
            </Lead>
          </Stack>
        </Container>
      </Section>

      <Section tone="snow">
        <Container>
          {services.length === 0 ? (
            <Text tone="muted">Aktuell sind keine veröffentlichten Leistungen hinterlegt.</Text>
          ) : (
            <div>
              {services.map((service, index) => (
                <IndexedRow
                  key={service.id}
                  index={String(index + 1).padStart(2, '0')}
                  title={service.name}
                  summary={
                    service.shortDescription ||
                    'Beschreibung folgt nach Freigabe durch die Praxis.'
                  }
                  href={`/leistungen/${service.slug}`}
                  linkLabel="Details"
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}
