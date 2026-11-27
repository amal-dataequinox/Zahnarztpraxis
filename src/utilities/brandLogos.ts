import type { Location, SiteSetting } from '@/payload-types'
import { getMediaAlt, isMedia, toSiteImageSrc } from '@/utilities/media'

const B = '/design-system/brand' as const

export const UNIFIED_LOGO = {
  src: `${B}/logo-palatty.png`,
  width: 596,
  height: 126,
  alt: 'Zahnarztpraxis Palatty — Dein Lächeln. Unsere Leidenschaft.',
} as const

export const PRACTICE_LOGOS = {
  appenzell: UNIFIED_LOGO,
  gais: UNIFIED_LOGO,
} as const

export type BrandLogo = {
  src: string
  width: number
  height: number
  alt: string
}

export function resolveBrandLogo(location: Location, settings?: SiteSetting | null): BrandLogo {
  const fallback = UNIFIED_LOGO
  const mediaCandidate = isMedia(location.logo)
    ? location.logo
    : isMedia(settings?.sharedMedia?.logo)
      ? settings.sharedMedia.logo
      : null

  if (mediaCandidate) {
    const src = toSiteImageSrc(mediaCandidate.sizes?.card?.url || mediaCandidate.url)
    if (src) {
      return {
        src,
        width: mediaCandidate.width || fallback.width,
        height: mediaCandidate.height || fallback.height,
        alt: getMediaAlt(mediaCandidate, settings?.brandName || fallback.alt),
      }
    }
  }

  return {
    ...fallback,
    alt: settings?.brandName || fallback.alt,
  }
}
