import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Reveal } from '@/components/motion/Reveal'
import { Container, Stack, Text } from '@/design-system'
import type { Location, TeamMember, TeamOverviewBlock } from '@/payload-types'
import { getTeamForLocation } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type Props = {
  block: TeamOverviewBlock
  location: Location
}

function hasRichTextContent(doc: unknown): doc is SerializedEditorState {
  if (!doc || typeof doc !== 'object') return false
  const root = (doc as { root?: { children?: unknown[] } }).root
  return Boolean(root && Array.isArray(root.children) && root.children.length > 0)
}

function getInitials(fullName: string): string {
  const parts = fullName
    .replace(/^(Med\.\s*Dent\.?|Dr\.\s*med\.\s*dent\.?)\s+/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'ZP'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export async function TeamOverviewBlockView({ block, location }: Props) {
  const selected =
    block.teamMembers?.filter((member): member is TeamMember => typeof member === 'object') ?? []
  const members = selected.length > 0 ? selected : await getTeamForLocation(location.id)
  const eyebrow = block.eyebrow || 'Praxisteam'
  const defaultRoleLabel = block.defaultRoleLabel || 'Praxisteam Appenzell'
  const showBiographies = (block as { showBiographies?: boolean | null }).showBiographies !== false
  const membersWithBios = showBiographies
    ? members.filter((member) => hasRichTextContent(member.biography))
    : []

  return (
    <section id="team" className="py-[var(--section-y)] bg-white">
      <Container>
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <span className="palatty-pill-eyebrow mb-3">
              <span className="palatty-pill-dot" aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className="palatty-display-h2">{block.heading || 'Unser Team'}</h2>
            <p className="mt-3 mb-0 font-sans text-[1rem] leading-relaxed text-[#4f6468]">
              {block.intro ||
                'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch professionell und persönlich ist.'}
            </p>
          </div>
        </Reveal>

        {members.length === 0 ? (
          <Text tone="muted">Teaminformationen folgen in Kürze.</Text>
        ) : (
          <>
            <Reveal variant="stagger">
              <div className="team-portrait-subpage-grid">
                {members.map((member) => {
                  const photoSrc = isMedia(member.photo)
                    ? toSiteImageSrc(member.photo.sizes?.card?.url || member.photo.url || undefined)
                    : null
                  const initials = getInitials(member.fullName)

                  return (
                    <article key={member.id} className="appenzell-reveal-item team-card">
                      <div className="team-card-media">
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
                            className="team-card-img"
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="team-monogram-card">
                            <div className="team-monogram-ring" aria-hidden="true">
                              {initials}
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#496064] shadow-xs">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-accent)' }}
                                aria-hidden="true"
                              />
                              Praxisteam
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="team-card-body">
                        <h3 className="team-card-name text-lg">{member.fullName}</h3>
                        {member.professionalTitle || member.position ? (
                          <p className="team-card-role">
                            {[member.professionalTitle, member.position].filter(Boolean).join(' · ')}
                          </p>
                        ) : (
                          <p className="team-card-role">{defaultRoleLabel}</p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </Reveal>

            {membersWithBios.length > 0 ? (
              <div className="mt-16 grid gap-6 lg:grid-cols-2">
                {membersWithBios.map((member, idx) => {
                  const thumbSrc = isMedia(member.photo)
                    ? toSiteImageSrc(
                        member.photo.sizes?.thumbnail?.url ||
                          member.photo.sizes?.card?.url ||
                          member.photo.url ||
                          undefined,
                      )
                    : null

                  return (
                    <Reveal key={`bio-${member.id}`} delayMs={idx * 90}>
                      <article className="editorial-prose-card h-full">
                        <Stack gap="4">
                          <div className="flex items-center gap-4 border-b border-black/[0.07] pb-4">
                            {thumbSrc ? (
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f3f9f7]">
                                <Image
                                  src={thumbSrc}
                                  alt={member.fullName}
                                  fill
                                  className="object-cover object-[50%_15%]"
                                  sizes="64px"
                                />
                              </div>
                            ) : null}
                            <div className="min-w-0">
                              <span className="palatty-pill-eyebrow mb-1.5">
                                <span className="palatty-pill-dot" aria-hidden="true" />
                                {[member.professionalTitle, member.position]
                                  .filter(Boolean)
                                  .join(' · ') || defaultRoleLabel}
                              </span>
                              <h3 className="m-0 font-display text-2xl font-semibold text-[#0e2a2f]">
                                {member.fullName}
                              </h3>
                            </div>
                          </div>

                          <div className="font-sans text-[0.95rem] leading-relaxed text-[#496064] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_blockquote]:mt-4 [&_blockquote]:rounded-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:bg-[#f7faf9] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:font-medium [&_blockquote]:text-[#0e2a2f]">
                            <LexicalRichText
                              data={member.biography as SerializedEditorState}
                              className="max-w-none"
                            />
                          </div>
                        </Stack>
                      </article>
                    </Reveal>
                  )
                })}
              </div>
            ) : null}
          </>
        )}
      </Container>
    </section>
  )
}
