import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CMSImage } from '@/components/cms/CMSImage'
import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import {
  Container,
  Eyebrow,
  Heading,
  Lead,
  MediaFrame,
  Section,
  Stack,
  Text,
  TextLink,
} from '@/design-system'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getServiceBySlug, getServicesForLocation } from '@/utilities/cmsQueries'
import { isMedia } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

type RouteParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const service = await getServiceBySlug(slug, location.id)
  if (!service) return {}
  return generatePageMetadata({
    location,
    path: `/leistungen/${slug}`,
    fallbackTitle: service.meta?.title || service.name,
    fallbackDescription: service.meta?.description || service.shortDescription || undefined,
  })
}

export default async function ServiceDetailPage({ params }: RouteParams) {
  const { slug } = await params
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const service = await getServiceBySlug(slug, location.id)
  if (!service) notFound()

  const related = (await getServicesForLocation(location.id)).filter((item) => item.id !== service.id).slice(0, 3)

  return (
    <main id="main">
      <Section spacing="tight" className="border-b border-[var(--color-border)]">
        <Container size="md">
          <Stack gap="4" className="motion-fade-up">
            <Eyebrow>
              <TextLink href="/leistungen" tone="muted">
                Leistungen
              </TextLink>
            </Eyebrow>
            <Heading level={1}>{service.name}</Heading>
            {service.shortDescription ? (
              <Lead>{service.shortDescription}</Lead>
            ) : (
              <Lead>Geprüfte Beschreibung folgt nach Freigabe durch die Praxis.</Lead>
            )}
            <BookingPlaceholder />
          </Stack>
        </Container>
      </Section>

      <Section tone="snow">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <Stack gap="6">
              {service.detailedDescription ? (
                <LexicalRichText data={service.detailedDescription as SerializedEditorState} />
              ) : (
                <Text tone="muted">
                  Eine ausführliche Beschreibung folgt, sobald die Praxis geprüfte Inhalte im CMS
                  hinterlegt.
                </Text>
              )}
            </Stack>
            {isMedia(service.featuredImage) ? (
              <MediaFrame aspect="photo">
                <CMSImage
                  media={service.featuredImage}
                  size="card"
                  className="h-full w-full object-cover"
                />
              </MediaFrame>
            ) : (
              <div className="min-h-64 border border-[var(--color-border)] bg-[var(--palatty-paper)]" />
            )}
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section>
          <Container>
            <Stack gap="6">
              <Heading level={3}>Weitere Leistungen</Heading>
              <ul className="m-0 grid list-none gap-0 border-t border-[var(--color-border-strong)] p-0 sm:grid-cols-3 sm:gap-6 sm:border-t-0">
                {related.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-[var(--color-border)] sm:border-b-0 sm:border-t sm:border-[var(--color-border-strong)] sm:pt-4"
                  >
                    <Link
                      href={`/leistungen/${item.slug}`}
                      className="flex min-h-11 items-center font-sans font-medium text-[var(--palatty-ink)] no-underline hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Stack>
          </Container>
        </Section>
      ) : null}
    </main>
  )
}
