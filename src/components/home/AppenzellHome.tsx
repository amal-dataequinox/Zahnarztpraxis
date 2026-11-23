import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { AppenzellMotionRoot } from '@/components/home/AppenzellMotionRoot'
import { TreatmentExplorer } from '@/components/home/TreatmentExplorer'
import { WelcomeVideoHero } from '@/components/home/WelcomeVideoHero'
import '@/components/home/appenzell-motion.css'
import { HeroEntrance } from '@/components/motion/HeroEntrance'
import { Reveal } from '@/components/motion/Reveal'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import {
  ButtonLink,
  Container,
  EditorialSplit,
  Eyebrow,
  Heading,
  Lead,
  LocationSwitcher,
  MediaFrame,
  Section,
  Stack,
  Text,
  TextLink,
} from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import { isMedia, resolveHeroVideo, toSiteImageSrc } from '@/utilities/media'
import type { Location } from '@/payload-types'
import { getServicesForLocation, getTeamForLocation } from '@/utilities/cmsQueries'
import { PRACTICE_PHOTOS, PRACTICE_VIDEOS } from '@/utilities/practicePhotos'
import { getLocationBySlug } from '@/utilities/resolveLocation'

type AppenzellHomeProps = {
  location: Location
  locationOptions: LocationOption[]
}

/**
 * Appenzell homepage — Hybrid immersive experience.
 * Photoreal Alpine + GSAP storytelling. Gais / CMS / booking unchanged.
 */
export async function AppenzellHome({ location, locationOptions }: AppenzellHomeProps) {
  const photos = PRACTICE_PHOTOS.appenzell
  const heroVideo = resolveHeroVideo(location, {
    src: PRACTICE_VIDEOS.appenzell.welcoming,
    poster: PRACTICE_VIDEOS.appenzell.welcomingPoster,
    alt: 'Alpines Appenzellerland — Wiesen, Kühe und Bergkulisse bei Appenzell.',
    mimeType: 'video/mp4',
  })
  const [services, team, gais] = await Promise.all([
    getServicesForLocation(location.id),
    getTeamForLocation(location.id),
    getLocationBySlug('gais'),
  ])

  const treatmentItems = services.slice(0, 6).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    shortDescription: s.shortDescription,
  }))

  return (
    <AppenzellMotionRoot>
      {/* Full-viewport alpine video — header overlays transparently */}
      <Section
        id="hero"
        spacing="none"
        className="relative min-h-dvh overflow-hidden border-b border-[var(--color-border)]"
      >
        <div className="appenzell-hero-media absolute inset-0">
          <WelcomeVideoHero
            src={heroVideo.src}
            poster={heroVideo.poster}
            alt={heroVideo.alt}
            mimeType={heroVideo.mimeType}
            variant="fullBleed"
          />
        </div>
        <Container className="relative z-[2] flex min-h-dvh items-end justify-center pb-14 pt-28 sm:items-center sm:justify-start sm:pb-20 sm:pl-[min(10vw,5.5rem)] sm:pt-32 lg:pl-[min(14vw,8rem)]">
          <HeroEntrance className="w-full max-w-2xl">
            <Stack gap="6">
              <p
                data-ax-enter="label"
                className="m-0 flex items-center gap-2.5 font-sans text-[length:var(--text-xs)] font-bold uppercase tracking-[0.16em] text-[#132624]"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#008768]" aria-hidden />
                Zahnarztpraxis Palatty · Appenzell
              </p>
              <div data-ax-enter="heading">
                <h1 className="font-sans text-[clamp(2.75rem,7.5vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#112926] text-balance drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  Zahnmedizin,<br />
                  die sich <span className="text-[#008768]">gut</span><br />
                  <span className="text-[#008768]">anfühlt.</span>
                </h1>
              </div>
              <div data-ax-enter="lead">
                <p className="font-sans text-[length:var(--text-base)] sm:text-lg font-medium leading-relaxed text-[#142824] text-pretty">
                  Moderne Behandlung. Persönliche Betreuung.<br />
                  Für Sie und Ihre Familie.
                </p>
              </div>
              <div
                data-ax-enter="cta"
                className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6"
              >
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
          </HeroEntrance>
        </Container>
      </Section>

      {/* Praxis — one clear photo + live-site copy (not a collage) */}
      <Section id="praxis" spacing="none" className="border-b border-[var(--color-border)]">
        <Container size="xl" className="px-0">
          <EditorialSplit
            density="hero"
            mirror
            copy={
              <Reveal className="h-full">
                <Stack gap="5" className="max-w-md px-[var(--container-pad)] py-14 lg:py-0">
                  <Eyebrow>Zahnarztpraxis</Eyebrow>
                  <Heading level={2}>Im Herzen von Appenzell</Heading>
                  <Text tone="muted" size="lg">
                    Willkommen in unserer Zahnarztpraxis — wo moderne Zahnmedizin auf persönliche
                    Betreuung trifft. Unter dem Motto «Dein Lächeln. Unsere Leidenschaft.» setzen wir
                    uns dafür ein, dass Sie sich rundum wohlfühlen.
                  </Text>
                  <Text tone="muted">
                    Als Familienzahnarztpraxis begleiten wir Menschen jeden Alters mit klarer Beratung
                    und modernen Räumen. Bei uns wissen Sie jederzeit, was gemacht wird — transparent
                    und nachvollziehbar.
                  </Text>
                  <TextLink href="/team" className="font-medium">
                    Zum Team <span className="appenzell-link-arrow" aria-hidden>→</span>
                  </TextLink>
                </Stack>
              </Reveal>
            }
            media={
              <Reveal variant="mask" className="relative h-full min-h-[inherit] overflow-hidden">
                <Image
                  src={photos.treatment}
                  alt="Behandlungszimmer der Zahnarztpraxis Palatty in Appenzell."
                  fill
                  priority
                  quality={90}
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 58vw"
                />
              </Reveal>
            }
          />
        </Container>
      </Section>

      {/* Leistungen — TreatmentExplorer */}
      <Section id="leistungen" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Stack gap="4">
                <Eyebrow>Leistungen</Eyebrow>
                <Heading level={2}>Behandlungen</Heading>
                <Text tone="muted">
                  Namen aus dem CMS. Medizinische Beschreibungen erscheinen nach Praxisprüfung.
                </Text>
                <TextLink href="/leistungen" className="font-medium">
                  Alle Leistungen <span className="appenzell-link-arrow" aria-hidden>→</span>
                </TextLink>
              </Stack>
            </Reveal>
            <div className="min-w-0 lg:col-span-8">
              <TreatmentExplorer services={treatmentItems} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Team — portraits only, like the live site’s calm team beat */}
      <Section id="team" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="8">
            <Reveal>
              <Stack gap="4" className="max-w-2xl">
                <Eyebrow>Team</Eyebrow>
                <Heading level={2}>Erfahren Sie mehr über unser Team</Heading>
                <Text tone="muted" size="lg">
                  Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch professionell und
                  persönlich ist.
                </Text>
                <TextLink href="/team" className="font-medium">
                  Team-Seite <span className="appenzell-link-arrow" aria-hidden>→</span>
                </TextLink>
              </Stack>
            </Reveal>
            {team.length > 0 ? (
              <Reveal variant="stagger">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                  {team.slice(0, 5).map((member) => {
                    const photoSrc = isMedia(member.photo)
                      ? toSiteImageSrc(member.photo.url || undefined)
                      : null
                    return (
                      <Stack key={member.id} gap="3" className="appenzell-reveal-item">
                        <MediaFrame aspect="portrait">
                          {photoSrc ? (
                            <Image
                              src={photoSrc}
                              alt={
                                isMedia(member.photo)
                                  ? member.photo.alt || `Porträt von ${member.fullName}`
                                  : `Porträt von ${member.fullName}`
                              }
                              fill
                              quality={90}
                              className="object-cover object-top"
                              sizes="(max-width:768px) 50vw, 16rem"
                            />
                          ) : (
                            <div className="flex h-full min-h-48 items-end bg-[var(--palatty-limestone)] p-3">
                              <Text size="sm" tone="muted">
                                Porträt folgt
                              </Text>
                            </div>
                          )}
                        </MediaFrame>
                        <div>
                          <p className="m-0 font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-ink)]">
                            {member.fullName}
                          </p>
                          {member.position ? (
                            <Text size="xs" tone="muted" className="mt-1">
                              {member.position}
                            </Text>
                          ) : null}
                        </div>
                      </Stack>
                    )
                  })}
                </div>
              </Reveal>
            ) : null}
          </Stack>
        </Container>
      </Section>

      {/* Standorte */}
      <Section id="standorte" tone="snow" spacing="default" className="border-b border-[var(--color-border)]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Stack gap="4">
                <Eyebrow>Standorte</Eyebrow>
                <Heading level={2}>Zwei Praxen. Ein Anspruch.</Heading>
                <Text tone="muted">
                  Sie sind auf dem Appenzell-Auftritt. Gais spiegelt dieselbe Sprache mit anderer
                  Bildkomposition.
                </Text>
                <LocationSwitcher current="appenzell" options={locationOptions} />
              </Stack>
            </Reveal>
            <Reveal
              className="grid gap-8 border-t border-[var(--color-border-strong)] pt-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:border-t-0 lg:pt-0"
              delayMs={120}
            >
              <Stack gap="2">
                <Text className="font-medium">
                  <span
                    className="mr-2 inline-block h-2 w-2 bg-[var(--accent-appenzell)]"
                    aria-hidden
                  />
                  Appenzell
                </Text>
                <Text size="sm" tone="muted">
                  {location.address.street}
                  <br />
                  {location.address.postalCode} {location.address.city}
                </Text>
                {location.phone ? (
                  <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`} className="text-sm">
                    {location.phone}
                  </TextLink>
                ) : null}
              </Stack>
              {gais ? (
                <Stack gap="2">
                  <Text className="font-medium">
                    <span
                      className="mr-2 inline-block h-2 w-2 bg-[var(--accent-gais)]"
                      aria-hidden
                    />
                    Gais
                  </Text>
                  <Text size="sm" tone="muted">
                    {gais.address.street}
                    <br />
                    {gais.address.postalCode} {gais.address.city}
                  </Text>
                  {gais.phone ? (
                    <TextLink href={`tel:${gais.phone.replace(/\s+/g, '')}`} className="text-sm">
                      {gais.phone}
                    </TextLink>
                  ) : null}
                </Stack>
              ) : null}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Kontakt */}
      <Section id="kontakt" spacing="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Stack gap="5">
                <Eyebrow>Kontakt</Eyebrow>
                <Heading level={2}>Appenzell</Heading>
                <Text size="lg">
                  {location.address.street}
                  <br />
                  {location.address.postalCode} {location.address.city}
                </Text>
                {location.phone ? (
                  <Text>
                    Telefon:{' '}
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
                {location.googleMapsUrl ? (
                  <TextLink href={location.googleMapsUrl} className="font-medium">
                    Route planen <span className="appenzell-link-arrow" aria-hidden>→</span>
                  </TextLink>
                ) : null}
              </Stack>
            </Reveal>
            <Reveal className="lg:col-span-5 lg:col-start-7" delayMs={100}>
              <Stack gap="4">
                <Text size="sm" className="font-medium uppercase tracking-[var(--tracking-wide)]">
                  Öffnungszeiten
                </Text>
                <OpeningHoursList entries={location.openingHours} />
                <Text size="xs" tone="subtle">
                  Angaben aus Migration — Bestätigung durch die Praxis ausstehend.
                </Text>
              </Stack>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section
        id="termin"
        tone="snow"
        spacing="default"
        className="border-t border-[var(--color-border)]"
      >
        <Container>
          <Reveal>
            <Stack gap="5" className="max-w-xl">
              <Eyebrow>Termin</Eyebrow>
              <Heading level={2}>Wir freuen uns auf Sie</Heading>
              <Text tone="muted">
                Rufen Sie an, schreiben Sie eine E-Mail oder nutzen Sie die Kontaktseite. Online-Buchung
                folgt nach Freigabe.
              </Text>
              <BookingPlaceholder />
              <Link
                href="/kontakt"
                className="font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-cyan-deep)] no-underline hover:underline"
              >
                Zur Kontaktseite <span className="appenzell-link-arrow" aria-hidden>→</span>
              </Link>
            </Stack>
          </Reveal>
        </Container>
      </Section>
    </AppenzellMotionRoot>
  )
}
