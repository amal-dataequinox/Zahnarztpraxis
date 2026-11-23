import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import {
  ButtonLink,
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
              <Stack gap="6" className="max-w-xl motion-fade-up">
                <p className="m-0 flex items-center gap-2.5 font-sans text-[length:var(--text-xs)] font-bold uppercase tracking-[0.16em] text-[#132624]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#008768]" aria-hidden />
                  Zahnarztpraxis Palatty · Gais
                </p>
                <h1 className="font-sans text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#112926] text-balance drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  Zahnmedizin,<br />
                  die sich <span className="text-[#008768]">gut</span><br />
                  <span className="text-[#008768]">anfühlt.</span>
                </h1>
                <p className="font-sans text-[length:var(--text-base)] sm:text-lg font-medium leading-relaxed text-[#142824] text-pretty">
                  Moderne Behandlung. Persönliche Betreuung.<br />
                  Für Sie und Ihre Familie.
                </p>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6">
                  <ButtonLink
                    href="/kontakt#termin"
                    size="lg"
                    className="rounded-xl bg-[#008768] text-white hover:bg-[#007358] px-7 py-4 font-sans font-semibold text-base shadow-[0_4px_16px_rgba(0,135,104,0.25)] hover:shadow-[0_6px_22px_rgba(0,135,104,0.35)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Termin vereinbaren
                    <span aria-hidden className="text-[1.15em] leading-none ml-1">
                      ↗
                    </span>
                  </ButtonLink>
                  <Link
                    href="/leistungen"
                    className="group inline-flex items-center gap-2 font-sans font-semibold text-base text-[#112926] hover:text-[#008768] bg-white/90 hover:bg-white px-6 py-4 rounded-xl border border-black/[0.08] backdrop-blur-xs shadow-xs transition-all duration-200 no-underline"
                  >
                    Behandlungen entdecken
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
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
