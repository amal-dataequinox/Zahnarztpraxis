import React from 'react'

import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import { Container, Eyebrow, Heading, Section, Stack, Text, TextLink } from '@/design-system'
import type { Location, LocationInformationBlock } from '@/payload-types'

type Props = {
  block: LocationInformationBlock
  location: Location
}

export function LocationInformationBlockView({ block, location }: Props) {
  return (
    <Section tone="snow" id="standort" className="border-t border-[var(--color-border)]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <Stack gap="4">
            <Eyebrow>Standort</Eyebrow>
            <Heading level={2}>{block.heading || location.name}</Heading>
            {block.showAddress !== false ? (
              <address className="not-italic font-sans text-[length:var(--text-lg)] leading-[var(--leading-relaxed)] text-[var(--color-fg)]">
                {location.address.street}
                <br />
                {location.address.postalCode} {location.address.city}
                <br />
                {location.address.country}
              </address>
            ) : null}
            {block.showContact !== false ? (
              <Stack gap="2">
                {location.phone ? (
                  <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</TextLink>
                ) : null}
                {location.email ? (
                  <TextLink href={`mailto:${location.email}`}>{location.email}</TextLink>
                ) : null}
                {location.googleMapsUrl ? (
                  <TextLink href={location.googleMapsUrl} target="_blank" rel="noreferrer">
                    Route planen
                  </TextLink>
                ) : null}
              </Stack>
            ) : null}
          </Stack>

          <Stack gap="6">
            {block.showOpeningHours !== false ? (
              <Stack gap="3">
                <Heading level={4} as="h3">
                  Öffnungszeiten
                </Heading>
                <OpeningHoursList entries={location.openingHours} />
              </Stack>
            ) : null}
            {block.showEmergencyInfo && location.emergencyInfo ? (
              <Stack gap="2">
                <Heading level={4} as="h3">
                  Notfall
                </Heading>
                <Text>{location.emergencyInfo}</Text>
              </Stack>
            ) : null}
            {block.showMap && location.googleMapsUrl ? (
              <Text size="sm" tone="muted">
                Kartenansicht:{' '}
                <TextLink href={location.googleMapsUrl} target="_blank" rel="noreferrer">
                  Google Maps öffnen
                </TextLink>
              </Text>
            ) : null}
          </Stack>
        </div>
      </Container>
    </Section>
  )
}
