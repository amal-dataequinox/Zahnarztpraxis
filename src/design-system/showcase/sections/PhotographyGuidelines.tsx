import Image from 'next/image'

import {
  Container,
  Eyebrow,
  Heading,
  MediaFrame,
  Section,
  Stack,
  StaffCard,
  Text,
} from '@/design-system'
import { PHOTO } from '@/design-system/showcase/photos'

export function PhotographyGuidelines() {
  return (
    <Section tone="snow" spacing="default">
      <Container>
        <Stack gap="8">
          <Stack gap="3" className="max-w-2xl">
            <Eyebrow>05 — Photography leads</Eyebrow>
            <Heading level={2}>Evidence, not decoration</Heading>
            <Text tone="muted">
              Edge-to-edge frames. No rounded card burial. Patient-adjacent frames remain on hold.
              Use approved SDN review images only; invent no staff identities.
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
  )
}
