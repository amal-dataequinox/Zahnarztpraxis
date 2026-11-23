import Image from 'next/image'

import {
  AppointmentCTA,
  Badge,
  Cluster,
  Container,
  EditorialSplit,
  Eyebrow,
  Heading,
  Lead,
  LocationSwitcher,
  Section,
  Stack,
  Text,
} from '@/design-system'
import { PHOTO } from '@/design-system/showcase/photos'

type LocationPreviewProps = {
  location: 'appenzell' | 'gais'
}

export function LocationPreview({ location }: LocationPreviewProps) {
  const isAppenzell = location === 'appenzell'

  return (
    <>
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container>
          <Stack gap="4" className="max-w-2xl">
            <Eyebrow>Location preview</Eyebrow>
            <Heading level={1}>{isAppenzell ? 'Appenzell' : 'Gais'}</Heading>
            <Lead>
              {isAppenzell
                ? 'Type-led 5/7 composition. Reception cyan appears once as the booking signal.'
                : 'Mirrored 7/5 composition. Shared SDN interior stands in until a Gais-specific shoot exists.'}
            </Lead>
            <Cluster gap="2">
              <Badge tone={isAppenzell ? 'appenzell' : 'gais'}>
                {isAppenzell ? 'Appenzell pip' : 'Gais pip'}
              </Badge>
              {!isAppenzell ? <Badge tone="ink">Shared interior</Badge> : null}
            </Cluster>
            <LocationSwitcher current={location} />
          </Stack>
        </Container>
      </Section>

      <Section tone="snow" spacing="none">
        <Container size="xl" className="px-0">
          {!isAppenzell ? (
            <Text size="xs" tone="muted" className="px-[var(--container-pad)] pt-4">
              Labelled content gap: hallway crop is from the shared photography pack — not a
              Gais-only exterior.
            </Text>
          ) : null}
          <EditorialSplit
            mirror={!isAppenzell}
            copy={
              <Stack gap="4" className="py-8 lg:py-12">
                <Eyebrow>{isAppenzell ? 'Appenzell' : 'Gais'}</Eyebrow>
                <Heading level={2}>Zahnarztpraxis Palatty</Heading>
                <Lead>
                  {isAppenzell ? 'Natürlich. Persönlich. Präzise.' : 'Dieselbe Praxis. Anderer Ort.'}
                </Lead>
                <AppointmentCTA
                  href="/design-system/components#cta"
                  supporting="Showcase CTA — demo only."
                />
              </Stack>
            }
            media={
              <div className="relative h-full min-h-[22rem]">
                <Image
                  src={isAppenzell ? PHOTO.team : PHOTO.hallway}
                  alt={
                    isAppenzell
                      ? 'Team at the cyan reception desk — Appenzell practice photography shortlist.'
                      : 'Clinic hallway interior from shared photography pack — not a Gais-specific exterior.'
                  }
                  fill
                  className={
                    isAppenzell ? 'object-cover object-[50%_30%]' : 'object-cover'
                  }
                  sizes="(max-width:1024px) 100vw, 58vw"
                  priority
                />
              </div>
            }
          />
        </Container>
      </Section>
    </>
  )
}
