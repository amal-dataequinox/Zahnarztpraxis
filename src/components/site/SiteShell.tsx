import { headers } from 'next/headers'
import React, { type ReactNode } from 'react'

import type { Location } from '@/payload-types'
import { resolveBrandLogo } from '@/utilities/brandLogos'
import { getDesignSystem, getNavigation, getSiteSettings } from '@/utilities/cmsQueries'
import { getLocationSwitcherOptions } from '@/utilities/locationSwitcher'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

type SiteShellProps = {
  location: Location
  children: ReactNode
  /** Hide chrome on internal tools like /design-system */
  bare?: boolean
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i

const FONT_STACK: Record<string, string> = {
  'ibm-plex': "var(--font-ibm-plex-sans), 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  general: "'General Sans', var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif",
  switzer: "'Switzer', var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif",
  system: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
}

export async function SiteShell({ location, children, bare = false }: SiteShellProps) {
  if (bare) return <>{children}</>

  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host')
  const locationOptions = getLocationSwitcherOptions(host)

  const [settings, mainNav, footerNav, designSystem] = await Promise.all([
    getSiteSettings(),
    getNavigation(location.id, 'main'),
    getNavigation(location.id, 'footer'),
    getDesignSystem().catch(() => null),
  ])

  const rawAccent = (location as { primaryColor?: string | null })?.primaryColor || designSystem?.accent || '#00a887'
  const safeAccent = HEX_COLOR.test(rawAccent) ? rawAccent : '#00a887'
  const rawAccentText = designSystem?.accentText || '#FFFFFF'
  const safeAccentText = HEX_COLOR.test(rawAccentText) ? rawAccentText : '#FFFFFF'
  const safeInk = HEX_COLOR.test(designSystem?.ink || '') ? designSystem!.ink : '#0e2a2f'
  const safePaper = HEX_COLOR.test(designSystem?.paper || '') ? designSystem!.paper : '#f7faf9'
  const safeSurface = HEX_COLOR.test(designSystem?.surface || '') ? designSystem!.surface : '#ffffff'

  const radiusPx = typeof designSystem?.cardRadius === 'number' ? designSystem.cardRadius : 16
  const spacingPx = typeof designSystem?.sectionSpacing === 'number' ? designSystem.sectionSpacing : 96
  const contentWidthPx = typeof designSystem?.contentWidth === 'number' ? designSystem.contentWidth : 1152
  const headerWidthPx = typeof (designSystem as { headerWidth?: number | null })?.headerWidth === 'number' ? (designSystem as { headerWidth?: number }).headerWidth! : 1440
  const headerScrolledWidthPx = headerWidthPx
  const headingFont = FONT_STACK[designSystem?.headingFont || 'ibm-plex'] || FONT_STACK['ibm-plex']
  const bodyFont = FONT_STACK[designSystem?.bodyFont || 'ibm-plex'] || FONT_STACK['ibm-plex']
  const motionEnabled = designSystem?.motionEnabled !== false

  const deepAccent = `color-mix(in oklab, ${safeAccent} 88%, black)`
  const brightAccent = `color-mix(in oklab, ${safeAccent} 82%, white)`

  const themeCssVars = {
    '--palatty-cyan': safeAccent,
    '--palatty-cyan-deep': deepAccent,
    '--palatty-cyan-bright': brightAccent,
    '--accent-appenzell': safeAccent,
    '--palatty-focus': safeAccent,
    '--palatty-glacier-deep': safeAccent,
    '--palatty-moss': safeAccent,
    '--palatty-ink': safeInk,
    '--palatty-paper': safePaper,
    '--palatty-snow': safeSurface,
    '--color-bg': safePaper,
    '--color-bg-elevated': safeSurface,
    '--color-fg': safeInk,
    '--palatty-fir-soft': `color-mix(in oklab, ${safeAccent} 12%, ${safePaper})`,
    '--color-accent': safeAccent,
    '--color-accent-hover': deepAccent,
    '--color-accent-soft': `color-mix(in oklab, ${safeAccent} 10%, ${safePaper})`,
    '--color-accent-text': safeAccentText,
    '--color-interactive': safeAccent,
    '--color-interactive-hover': deepAccent,
    '--color-cyan': safeAccent,
    '--studio-accent': safeAccent,
    '--focus-ring': `0 0 0 2px ${safeSurface}, 0 0 0 4px ${safeAccent}`,
    '--font-sans': bodyFont,
    '--font-display': headingFont,
    '--radius-sm': `${Math.max(radiusPx, 14)}px`,
    '--radius-md': `${radiusPx}px`,
    '--radius-lg': `${Math.max(radiusPx, 18)}px`,
    '--radius-pill': `${Math.max(radiusPx, 12)}px`,
    '--section-y': `clamp(${Math.round(spacingPx * 0.65)}px, 9vw, ${spacingPx}px)`,
    '--section-y-tight': `clamp(${Math.round(spacingPx * 0.4)}px, 5vw, ${Math.round(spacingPx * 0.65)}px)`,
    '--container-lg': `${contentWidthPx}px`,
    '--container-xl': `${Math.round(contentWidthPx * 1.11)}px`,
    '--header-max-width': `${headerWidthPx}px`,
    '--header-scrolled-width': `${headerScrolledWidthPx}px`,
  } as React.CSSProperties

  const rootStyleRule = `:root {\n${Object.entries(themeCssVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}`

  const brandLogo = resolveBrandLogo(location, settings)
  const announcementActive = Boolean(settings.announcement?.enabled && settings.announcement?.message)

  return (
    <div
      className="flex min-h-dvh min-w-0 max-w-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)]"
      data-motion-enabled={motionEnabled ? 'on' : 'off'}
      style={themeCssVars}
    >
      <style dangerouslySetInnerHTML={{ __html: rootStyleRule }} />
      {announcementActive ? (
        <div
          role="status"
          className="relative z-50 px-4 py-2 text-center font-sans text-xs sm:text-sm font-medium"
          style={{ backgroundColor: safeAccent, color: safeAccentText }}
        >
          {settings.announcement?.message}
        </div>
      ) : null}
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
