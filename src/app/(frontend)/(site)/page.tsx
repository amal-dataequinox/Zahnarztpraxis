import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { headers } from 'next/headers'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { DefaultHome } from '@/components/home/DefaultHome'
import { getHomePage } from '@/utilities/cmsQueries'
import { getLocationSwitcherOptions } from '@/utilities/locationSwitcher'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { buildDentistJsonLd, generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const location = await resolveCurrentLocation()
  if (!location) return { title: 'Zahnarztpraxis Palatty' }
  const home = await getHomePage(location.id)
  return generatePageMetadata({ location, page: home, path: '/' })
}

export default async function HomePage() {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const home = await getHomePage(location.id)
  const jsonLd = buildDentistJsonLd(location)
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host')
  const locationOptions = getLocationSwitcherOptions(host)

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {home?.layout && home.layout.length > 0 ? (
        <RenderBlocks blocks={home.layout} location={location} />
      ) : (
        <DefaultHome location={location} locationOptions={locationOptions} />
      )}
    </main>
  )
}
