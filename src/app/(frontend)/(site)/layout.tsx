import { notFound } from 'next/navigation'
import React from 'react'

import { SiteShell } from '@/components/site/SiteShell'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  return <SiteShell location={location}>{children}</SiteShell>
}
