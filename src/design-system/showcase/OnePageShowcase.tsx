import {
  AppointmentCTA,
  Badge,
  Button,
  Cluster,
  ContactInfo,
  Container,
  EditorialSplit,
  Eyebrow,
  Field,
  FieldHint,
  Heading,
  IndexedRow,
  Input,
  Label,
  Lead,
  LocationSwitcher,
  MediaFrame,
  NavBar,
  OpeningHours,
  Section,
  Select,
  SiteFooterBar,
  Stack,
  StaffCard,
  Text,
  TextLink,
  Textarea,
} from '@/design-system'
import Image from 'next/image'

import { PHOTO } from '@/design-system/showcase/photos'

/**
 * Preferred Visual Identity v2 showcase — single scrolling page with hash nav.
 * Multipage workspace archived at `src/design-system/archive/multipage-workspace/`.
 */
export function OnePageShowcase() {
  return (
    <main id="main" className="min-h-dvh min-w-0 max-w-full bg-[var(--color-bg)]">
      <NavBar
        brand="Palatty / Design System v2"
        location="appenzell"
        items={[
          { label: 'Richtung', href: '#direction' },
          { label: 'Farbe', href: '#colour' },
          { label: 'Typo', href: '#typography' },
          { label: 'Homepages', href: '#homepages' },
          { label: 'Foto', href: '#photography' },
        ]}
        cta={{ label: 'Termin vereinbaren', href: '#cta' }}
      />

      <Section id="direction" spacing="tight" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="4" className="w-full max-w-3xl">
            <Eyebrow>Visual Identity v2</Eyebrow>
            <Heading level={1}>Empfangscyan · Schriftbau · Zwei Firste</Heading>
            <Lead>
              Practice materials first. Editorial structure second. Two locations under one name.
              Cyan is a signal — not a theme.
            </Lead>
            <Cluster gap="2" className="w-full">
              <Badge tone="cyan">Cyan ~2–4%</Badge>
              <Badge tone="ink">IBM Plex Sans</Badge>
              <Badge tone="appenzell">Appenzell pip</Badge>
              <Badge tone="gais">Gais pip</Badge>
            </Cluster>
            <Text size="sm" tone="muted">
              Alpine Modernism archived at <code>src/design-system/archive/</code>. Multipage
              workspace archived at <code>archive/multipage-workspace/</code>. Phase 3 not started.
            </Text>
          </Stack>
        </Container>
      </Section>

      <Section id="colour" tone="snow" spacing="default">
        <Container>
          <Stack gap="8">
            <Stack gap="3" className="w-full max-w-2xl">
              <Eyebrow>01 — Colour</Eyebrow>
              <Heading level={2}>Paper · ink · wood · navy · cyan signal</Heading>
              <Text tone="muted">
                One filled primary CTA per composition. No cyan section fills. White-on-cyan CTA meets
                WCAG AA (≥5:1 at `#147A86`).
              </Text>
            </Stack>
            <div className="grid min-w-0 grid-cols-1 gap-0 border border-[var(--color-border-strong)] sm:grid-cols-2 lg:grid-cols-5">
              {(
                [
                  ['Paper', '#F7F5F1', 'var(--palatty-paper)'],
                  ['Ink', '#141414', 'var(--palatty-ink)'],
                  ['Wood', '#3B2F28', 'var(--palatty-wood)'],
                  ['Navy', '#0C1824', 'var(--palatty-navy)'],
                  ['Cyan CTA', '#147A86', 'var(--palatty-cyan-deep)'],
                ] as const
              ).map(([name, hex, swatch]) => (
                <div
                  key={name}
                  className="min-w-0 border-b border-[var(--color-border)] sm:border-r sm:border-b-0 last:border-b-0 lg:last:border-r-0"
                >
                  <div className="h-28" style={{ background: swatch }} />
                  <div className="border-t border-[var(--color-border)] p-3">
                    <Text size="sm" className="font-medium">
                      {name}
                    </Text>
                    <Text size="xs" tone="subtle" as="p" className="tabular-nums">
                      {hex}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
            <div id="cta">
              <AppointmentCTA
                href="#cta"
                supporting="Showcase CTA — cyan budget guardrail. Not wired to booking."
              />
            </div>
          </Stack>
        </Container>
      </Section>

      <Section id="typography" spacing="default">
        <Container>
          <Stack gap="10">
            <Stack gap="4" className="max-w-3xl">
              <Eyebrow>02 — Typography</Eyebrow>
              <Heading level={2}>IBM Plex Sans — weight roles</Heading>
              <Text tone="muted">
                Regular 400 body · Medium 500 nav/labels · SemiBold 600 headings · Light 300 only for
                large editorial lines when specimens justify it · tabular nums for indexes/hours.
              </Text>
            </Stack>

            <div className="border border-[var(--color-border-strong)] bg-[var(--palatty-snow)] p-8 md:p-12">
              <Eyebrow>Critical specimens</Eyebrow>
              <Heading level={1} editorial className="mt-4">
                Natürlich. Persönlich. Präzise.
              </Heading>
              <Heading level={2} className="mt-8">
                Zahnärztliche Praxis Appenzell
              </Heading>
              <Text size="lg" tone="muted" className="mt-4 max-w-[var(--measure-lead)]">
                Body Regular 400 — Zahnmedizin, Behandlungen und Öffnungszeiten in klarer UI-Lesbarkeit.
              </Text>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Stack gap="3" className="border border-[var(--color-border-strong)] p-6">
                <Text size="sm" className="font-medium tracking-[var(--tracking-wide)] uppercase">
                  SemiBold 600 — headings
                </Text>
                {(
                  [
                    'Zahnmedizin',
                    'Natürlich',
                    'Behandlungen',
                    'Öffnungszeiten',
                    'Zahnärztliche Praxis',
                  ] as const
                ).map((word) => (
                  <p
                    key={word}
                    className="m-0 border-b border-[var(--color-border)] py-3 font-sans text-[length:var(--text-2xl)] font-semibold tracking-[var(--tracking-tight)]"
                  >
                    {word}
                  </p>
                ))}
              </Stack>
              <Stack gap="3" className="border border-[var(--color-border-strong)] p-6">
                <Text size="sm" className="font-medium tracking-[var(--tracking-wide)] uppercase">
                  Tabular numerals
                </Text>
                <p className="m-0 font-sans text-[length:var(--text-3xl)] font-medium tabular-nums tracking-[var(--tracking-tight)]">
                  01  02  03  08:00–17:30
                </p>
                <Text size="sm" tone="muted">
                  Indexed service rows and opening hours use <code>tabular-nums</code>.
                </Text>
                <Text size="sm" className="font-medium">
                  Medium 500 — navigation / labels
                </Text>
                <Text size="base">
                  Regular 400 — running body copy stays calm and clinical, not dashboard-bold.
                </Text>
              </Stack>
            </div>
          </Stack>
        </Container>
      </Section>

      <Section id="homepages" tone="snow" spacing="none" className="border-y border-[var(--color-border)]">
        <Container size="xl" className="px-0">
          <div className="px-[var(--container-pad)] py-[var(--section-y-tight)]">
            <Stack gap="3" className="max-w-2xl">
              <Eyebrow>03 — Mirrored homepages</Eyebrow>
              <Heading level={2}>Appenzell 5/7 · Gais 7/5</Heading>
              <Text tone="muted">
                Same system, different composition. Gais photos below are shared SDN interiors with
                alternate crops — not Gais-site documentation until a dedicated shoot exists.
              </Text>
            </Stack>
          </div>

          <div className="border-t border-[var(--color-border)]">
            <Text
              size="xs"
              className="px-[var(--container-pad)] pt-4 font-semibold tracking-[var(--tracking-wide)] uppercase"
            >
              <span className="mr-2 inline-block h-2 w-2 bg-[var(--accent-appenzell)]" aria-hidden />
              Appenzell — type left / photo right
            </Text>
            <EditorialSplit
              copy={
                <Stack gap="4" className="py-8 lg:py-12">
                  <Eyebrow>Appenzell</Eyebrow>
                  <Heading level={2}>Zahnarztpraxis Palatty</Heading>
                  <Lead>Natürlich. Persönlich. Präzise.</Lead>
                  <AppointmentCTA href="#cta" supporting="Showcase CTA — demo only." />
                </Stack>
              }
              media={
                <div className="relative h-full min-h-[22rem]">
                  <Image
                    src={PHOTO.team}
                    alt="Team at the cyan reception desk — Appenzell practice photography shortlist."
                    fill
                    className="object-cover object-[50%_30%]"
                    sizes="(max-width:1024px) 100vw, 58vw"
                    priority
                  />
                </div>
              }
            />
          </div>

          <div className="border-t border-[var(--color-border)]">
            <Text
              size="xs"
              className="px-[var(--container-pad)] pt-4 font-semibold tracking-[var(--tracking-wide)] uppercase"
            >
              <span className="mr-2 inline-block h-2 w-2 bg-[var(--accent-gais)]" aria-hidden />
              Gais — photo left / type right (mirror)
            </Text>
            <Text size="xs" tone="muted" className="px-[var(--container-pad)] pb-2">
              Content gap: no Gais-only exterior in current pack — using shared interior with different
              lead crop.
            </Text>
            <EditorialSplit
              mirror
              copy={
                <Stack gap="4" className="py-8 lg:py-12">
                  <Eyebrow>Gais</Eyebrow>
                  <Heading level={2}>Zahnarztpraxis Palatty</Heading>
                  <Lead>Dieselbe Praxis. Anderer Ort.</Lead>
                  <AppointmentCTA href="#cta" supporting="Showcase CTA — demo only." />
                </Stack>
              }
              media={
                <div className="relative h-full min-h-[22rem]">
                  <Image
                    src={PHOTO.hallway}
                    alt="Clinic hallway interior from shared photography pack — not a Gais-specific exterior."
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 58vw"
                  />
                </div>
              }
            />
          </div>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <Stack gap="6">
            <Stack gap="3">
              <Eyebrow>04 — Leistungen (indexed)</Eyebrow>
              <Heading level={2}>Hairlines, not cards</Heading>
            </Stack>
            <div>
              <IndexedRow
                index="01"
                title="Prophylaxe"
                summary="Illustrative CMS teaser — replace with approved service copy."
                href="#leistungen"
              />
              <IndexedRow
                index="02"
                title="Ästhetik"
                summary="Editorial rows replace soft service cards."
                href="#leistungen"
              />
              <IndexedRow
                index="03"
                title="Implantate"
                summary="One job per row."
                href="#leistungen"
              />
            </div>
          </Stack>
        </Container>
      </Section>

      <Section id="photography" tone="snow" spacing="default">
        <Container>
          <Stack gap="8">
            <Stack gap="3" className="max-w-2xl">
              <Eyebrow>05 — Photography leads</Eyebrow>
              <Heading level={2}>Evidence, not decoration</Heading>
              <Text tone="muted">
                Edge-to-edge frames. No rounded card burial. Patient-adjacent frames remain on hold.
              </Text>
            </Stack>
            <MediaFrame caption="303511 — treatment room (shared pack).">
              <Image
                src={PHOTO.interior}
                alt="Bright dental treatment room with chair and equipment."
                width={1600}
                height={1067}
                className="h-auto w-full object-cover"
              />
            </MediaFrame>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5" id="leistungen">
              {(
                [
                  [PHOTO.belma, 'Studio portrait A'],
                  [PHOTO.christina, 'Studio portrait B'],
                  [PHOTO.dalina, 'Studio portrait C'],
                  [PHOTO.jeanine, 'Studio portrait D'],
                  [PHOTO.riana, 'Studio portrait E'],
                ] as const
              ).map(([src, label]) => (
                <StaffCard
                  key={src}
                  name={label}
                  role="Rolle aus CMS"
                  image={
                    <Image
                      src={src}
                      alt="Studio portrait of a dental practice team member against a white background."
                      width={600}
                      height={600}
                      className="object-cover object-[50%_28%]"
                    />
                  }
                />
              ))}
            </div>
          </Stack>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <Stack gap="8">
            <Stack gap="3">
              <Eyebrow>06 — Location switcher</Eyebrow>
              <Heading level={2}>First-class place control</Heading>
            </Stack>
            <LocationSwitcher current="appenzell" />
            <LocationSwitcher current="gais" />
            <div className="grid gap-8 md:grid-cols-2">
              <OpeningHours
                rows={[
                  { label: 'Montag – Freitag', value: '08:00 – 12:00 / 13:30 – 17:30' },
                  { label: 'Samstag', value: 'Nach Vereinbarung' },
                  { label: 'Sonntag', value: 'Geschlossen' },
                ]}
              />
              <div>
                <Text
                  size="sm"
                  className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase"
                >
                  Forms (showcase only)
                </Text>
                <Text size="sm" tone="muted" className="mb-4">
                  Not wired to booking.
                </Text>
                <div className="grid gap-4">
                  <Field>
                    <Label htmlFor="ds-name">Name</Label>
                    <Input id="ds-name" name="name" placeholder="Ihr Name" />
                  </Field>
                  <Field>
                    <Label htmlFor="ds-loc">Standort</Label>
                    <Select id="ds-loc" name="location" defaultValue="appenzell">
                      <option value="appenzell">Appenzell</option>
                      <option value="gais">Gais</option>
                    </Select>
                    <FieldHint>CMS-driven in production.</FieldHint>
                  </Field>
                  <Field>
                    <Label htmlFor="ds-msg">Nachricht</Label>
                    <Textarea id="ds-msg" name="message" />
                  </Field>
                </div>
              </div>
            </div>
            <Cluster gap="3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>

      <SiteFooterBar
        brand="Zahnarztpraxis Palatty"
        columns={
          <>
            <ContactInfo
              title="Appenzell"
              address="CMS address"
              phone="+41 00 000 00 00"
              className="[&_p]:text-[var(--palatty-snow)] [&_a]:text-[var(--palatty-snow)]"
            />
            <ContactInfo
              title="Gais"
              address="CMS address"
              phone="+41 00 000 00 01"
              className="[&_p]:text-[var(--palatty-snow)] [&_a]:text-[var(--palatty-snow)]"
            />
            <div>
              <Text size="sm" className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase">
                v2
              </Text>
              <Text size="sm" tone="inverse" className="opacity-80">
                No Alpine WebGL identity · photography leads · Phase 3 frozen
              </Text>
            </div>
          </>
        }
        meta={
          <>
            Rollback:{' '}
            <TextLink href="#direction" className="text-[var(--palatty-snow)]">
              archive notes
            </TextLink>
            {' · '}docs/visual-identity-v2/
          </>
        }
      />
    </main>
  )
}
