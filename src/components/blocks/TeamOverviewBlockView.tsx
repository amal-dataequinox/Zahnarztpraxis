import React from 'react'

import { CMSImage } from '@/components/cms/CMSImage'
import { Container, Eyebrow, Heading, Lead, MediaFrame, Section, Stack, Text } from '@/design-system'
import type { Location, TeamMember, TeamOverviewBlock } from '@/payload-types'
import { getTeamForLocation } from '@/utilities/cmsQueries'
import { isMedia } from '@/utilities/media'

type Props = {
  block: TeamOverviewBlock
  location: Location
}

export async function TeamOverviewBlockView({ block, location }: Props) {
  const selected =
    block.teamMembers?.filter((member): member is TeamMember => typeof member === 'object') ?? []
  const members = selected.length > 0 ? selected : await getTeamForLocation(location.id)

  return (
    <Section id="team">
      <Container>
        <Stack gap="10">
          <Stack gap="3" className="max-w-2xl">
            <Eyebrow>Team</Eyebrow>
            <Heading level={2}>{block.heading || 'Unser Team'}</Heading>
            {block.intro ? (
              <Lead>{block.intro}</Lead>
            ) : (
              <Lead>
                Authentische Porträts und Profile werden von der Praxis gepflegt — ohne generierte
                Identitäten.
              </Lead>
            )}
          </Stack>

          {members.length === 0 ? (
            <Text tone="muted">Teaminformationen folgen in Kürze.</Text>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Stack key={member.id} gap="3">
                  <MediaFrame aspect="portrait">
                    {isMedia(member.photo) ? (
                      <CMSImage media={member.photo} size="card" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full min-h-72 items-end bg-[var(--palatty-limestone)] p-4">
                        <Text size="sm" tone="muted">
                          Porträt folgt
                        </Text>
                      </div>
                    )}
                  </MediaFrame>
                  <div>
                    <Heading level={4} as="h3">
                      {member.fullName}
                    </Heading>
                    {member.professionalTitle || member.position ? (
                      <Text size="sm" tone="muted" className="mt-1">
                        {[member.professionalTitle, member.position].filter(Boolean).join(' · ')}
                      </Text>
                    ) : null}
                  </div>
                </Stack>
              ))}
            </div>
          )}
        </Stack>
      </Container>
    </Section>
  )
}
