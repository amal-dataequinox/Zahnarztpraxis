import Image from 'next/image'

import {
  AppointmentCTA,
  Container,
  EditorialSplit,
  Eyebrow,
  Heading,
  Lead,
  Section,
  Stack,
  Text,
} from '@/design-system'
import { PHOTO } from '@/design-system/showcase/photos'

export function HomepageConcepts() {
  return (
    <Section tone="snow" spacing="none" className="border-y border-[var(--color-border)]">
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
            <span
              className="mr-2 inline-block h-2 w-2 bg-[var(--accent-appenzell)]"
              aria-hidden
            />
            Appenzell — type left / photo right
          </Text>
          <EditorialSplit
            copy={
              <Stack gap="4" className="py-8 lg:py-12">
                <Eyebrow>Appenzell</Eyebrow>
                <Heading level={2}>Zahnarztpraxis Palatty</Heading>
                <Lead>Natürlich. Persönlich. Präzise.</Lead>
                <AppointmentCTA
                  href="/design-system/components#cta"
                  supporting="Showcase CTA — demo only."
                />
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
                <AppointmentCTA
                  href="/design-system/components#cta"
                  supporting="Showcase CTA — demo only."
                />
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
  )
}
