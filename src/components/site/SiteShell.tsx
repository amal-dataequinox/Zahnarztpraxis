import { headers } from 'next/headers'
import React, { type ReactNode } from 'react'

import type { Location } from '@/payload-types'
import { resolveBrandLogo } from '@/utilities/brandLogos'
import { getNavigation, getSiteSettings } from '@/utilities/cmsQueries'
import { getLocationSwitcherOptions } from '@/utilities/locationSwitcher'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

type SiteShellProps = {
  location: Location
  children: ReactNode
  /** Hide chrome on internal tools like /design-system */
  bare?: boolean
}

export async function SiteShell({ location, children, bare = false }: SiteShellProps) {
  if (bare) return <>{children}</>

  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host')
  const locationOptions = getLocationSwitcherOptions(host)

  const [settings, mainNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation(location.id, 'main'),
    getNavigation(location.id, 'footer'),
  ])
  const brandLogo = resolveBrandLogo(location)

  return (
    <div className="flex min-h-dvh min-w-0 max-w-full flex-col bg-[var(--color-bg)]">
      <SiteHeader
        location={location}
        navigation={mainNav}
        brandLogo={brandLogo}
        locationOptions={locationOptions}
      />
      <div className="min-w-0 flex-1">{children}</div>
      <SiteFooter
        location={location}
        navigation={footerNav ?? mainNav}
        settings={settings}
        locationOptions={locationOptions}
      />
    </div>
  )
}
