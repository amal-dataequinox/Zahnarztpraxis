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
  TextLink,
} from '@/design-system'
import type { Location, Service, ServicesOverviewBlock } from '@/payload-types'
import { getServicesForLocation } from '@/utilities/cmsQueries'

type Props = {
  block: ServicesOverviewBlock
  location: Location
}

export async function ServicesOverviewBlockView({ block, location }: Props) {
  const selected =
    block.services?.filter((service): service is Service => typeof service === 'object') ?? []
  const services = selected.length > 0 ? selected : await getServicesForLocation(location.id)

  if (services.length === 0) return null

  return (
    <Section tone="snow" id="leistungen" className="border-y border-[var(--color-border)]">
      <Container>
        <Stack gap="8">
          <Stack gap="3" className="max-w-2xl">
            <Eyebrow>Leistungen</Eyebrow>
            <Heading level={2}>{block.heading || 'Unser Angebot'}</Heading>
            {block.intro ? (
              <Lead>{block.intro}</Lead>
            ) : (
              <Text tone="muted">
                Behandlungsnamen aus dem CMS. Geprüfte Beschreibungen folgen nach Freigabe.
              </Text>
            )}
          </Stack>
          <div>
            {services.map((service, index) => (
              <IndexedRow
                key={service.id}
                index={String(index + 1).padStart(2, '0')}
                title={service.name}
                summary={
                  service.shortDescription || 'Beschreibung folgt nach Freigabe durch die Praxis.'
                }
                href={`/leistungen/${service.slug}`}
                linkLabel="Details"
              />
            ))}
          </div>
          <TextLink href="/leistungen" className="font-medium">
            Alle Leistungen →
          </TextLink>
        </Stack>
      </Container>
    </Section>
  )
}
