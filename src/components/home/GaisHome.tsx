import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import {
  Container,
  EditorialSplit,
  Eyebrow,
  Heading,
  IndexedRow,
  Lead,
  LocationSwitcher,
  Section,
  Stack,
  Text,
  TextLink,
} from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location } from '@/payload-types'
import { getServicesForLocation, getTeamForLocation } from '@/utilities/cmsQueries'
import { PRACTICE_PHOTOS } from '@/utilities/practicePhotos'

type GaisHomeProps = {
  location: Location
  locationOptions: LocationOption[]
}

/**
 * Gais homepage — structural mirror only.
 * Visual polish is deferred until the Appenzell composition is approved,
 * then the same language is applied here (photo left / type right).
 */
export async function GaisHome({ location, locationOptions }: GaisHomeProps) {
  const photos = PRACTICE_PHOTOS.gais
  const [services, team] = await Promise.all([
    getServicesForLocation(location.id),
    getTeamForLocation(location.id),
  ])

  return (
    <>
      <Section id="hero" spacing="none" className="overflow-hidden border-b border-[var(--color-border)]">
        <Container size="xl" className="px-0">
          <Text size="xs" tone="muted" className="px-[var(--container-pad)] pt-4">
            Fotografie: gemeinsames Praxisinterieur — kein Gais-spezifisches Aussenbild. Visuelle
            Feinabstimmung folgt nach Appenzell-Freigabe.
          </Text>
          <EditorialSplit
            mirror
            density="hero"
            copy={
              <Stack gap="5" className="max-w-xl motion-fade-up">
                <p className="m-0 flex items-center gap-2 font-sans text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--palatty-slate)]">
                  <span className="h-2 w-2 shrink-0 bg-[var(--accent-gais)]" aria-hidden />
                  Gais
                </p>
                <Heading level={1}>Zahnarztpraxis Palatty</Heading>
                <Lead>
                  {location.shortDescription ||
                    'Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar.'}
                </Lead>
                <BookingPlaceholder compact />
                <LocationSwitcher current="gais" options={locationOptions} />
              </Stack>
            }
            media={
              <div className="relative h-full min-h-[inherit] motion-fade-in">
                <Image
                  src={photos.hero}
                  alt="Praxisinterieur aus dem gemeinsamen Fotopaket — Standortbild für Gais folgt."
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 58vw"
                />
              </div>
            }
          />
        </Container>
      </Section>

      <Section id="vertrauen" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="4" className="max-w-2xl">
            <Eyebrow>Vertrauen</Eyebrow>
            <Heading level={2}>Dieselbe Praxis. Anderer Ort.</Heading>
            <Text tone="muted" size="lg">
              Strukturelle Spiegelung der Appenzell-Seite. Bildsprache und Feinschliff folgen der
              freigegebenen Appenzell-Komposition.
            </Text>
            <TextLink href="/team" className="font-medium">
              Zum Team →
            </TextLink>
          </Stack>
        </Container>
      </Section>

      <Section id="leistungen" tone="snow" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="6">
            <Stack gap="3" className="max-w-2xl">
              <Eyebrow>Leistungen</Eyebrow>
              <Heading level={2}>Behandlungen</Heading>
            </Stack>
            {services.length === 0 ? (
              <Text tone="muted">Leistungen folgen nach CMS-Pflege.</Text>
            ) : (
              <div>
                {services.slice(0, 6).map((service, index) => (
                  <IndexedRow
                    key={service.id}
                    index={String(index + 1).padStart(2, '0')}
                    title={service.name}
                    href={`/leistungen/${service.slug}`}
                    linkLabel="Mehr"
                  />
                ))}
              </div>
            )}
            <TextLink href="/leistungen" className="font-medium">
              Alle Leistungen →
            </TextLink>
          </Stack>
        </Container>
      </Section>

      <Section id="praxis" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="6" className="max-w-2xl">
            <Eyebrow>Praxis</Eyebrow>
            <Heading level={2}>Räume</Heading>
            <Text tone="muted">
              Geteilte Interieur-Aufnahmen — Gais-spezifische Aussenbilder und die ausgearbeitete
              Bildfolge folgen nach Appenzell-Freigabe.
            </Text>
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={photos.treatment}
                alt="Geteiltes Praxisinterieur aus dem SDN-Paket."
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 40rem"
              />
            </div>
          </Stack>
        </Container>
      </Section>

      <Section id="team" tone="snow" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="4" className="max-w-2xl">
            <Eyebrow>Team</Eyebrow>
            <Heading level={2}>Team</Heading>
            <Text tone="muted">
              {team.length === 0
                ? 'CMS-Einträge ausstehend — keine geratenen Identitäten.'
                : `${team.length} freigegebene Profile.`}
            </Text>
            <TextLink href="/team" className="font-medium">
              Team-Seite →
            </TextLink>
          </Stack>
        </Container>
      </Section>

      <Section id="kontakt" spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Stack gap="4">
              <Eyebrow>Kontakt</Eyebrow>
              <Heading level={2}>Gais</Heading>
              <Text>
                {location.address.street}
                <br />
                {location.address.postalCode} {location.address.city}
              </Text>
              {location.phone ? (
                <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</TextLink>
              ) : null}
              <LocationSwitcher current="gais" options={locationOptions} />
            </Stack>
            <Stack gap="3">
              <Text size="sm" className="font-medium uppercase tracking-[var(--tracking-wide)]">
                Öffnungszeiten
              </Text>
              <OpeningHoursList entries={location.openingHours} />
              <Text size="xs" tone="subtle">
                Angaben aus Migration — Bestätigung ausstehend.
              </Text>
              <div id="termin" className="pt-4">
                <BookingPlaceholder />
              </div>
              <Link
                href="/kontakt"
                className="font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-cyan-deep)] no-underline hover:underline"
              >
                Zur Kontaktseite →
              </Link>
            </Stack>
          </div>
        </Container>
      </Section>
    </>
  )
}
