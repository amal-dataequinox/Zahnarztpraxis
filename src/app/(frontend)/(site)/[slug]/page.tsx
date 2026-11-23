import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container, Eyebrow, Heading, Section, Stack } from '@/design-system'
import { getPageBySlug } from '@/utilities/cmsQueries'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

type RouteParams = { params: Promise<{ slug: string }> }

const RESERVED = new Set(['leistungen', 'team', 'kontakt', 'design-system', 'admin', 'api'])

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  if (RESERVED.has(slug)) return {}
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug(slug, location.id, draft)
  if (!page) return {}
  return generatePageMetadata({ location, page, path: `/${slug}` })
}

export default async function CMSPage({ params }: RouteParams) {
  const { slug } = await params
  if (RESERVED.has(slug)) notFound()

  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug(slug, location.id, draft)
  if (!page) notFound()

  const hasBlocks = (page.layout?.length ?? 0) > 0

  return (
    <main id="main">
      {!hasBlocks ? (
        <Section spacing="tight" className="alpine-grain border-b border-[var(--color-border)]">
          <Container size="md">
            <Stack gap="3">
              <Eyebrow>{location.address.city}</Eyebrow>
              <Heading level={1}>{page.title}</Heading>
            </Stack>
          </Container>
        </Section>
      ) : null}
      <RenderBlocks blocks={page.layout} location={location} />
    </main>
  )
}
