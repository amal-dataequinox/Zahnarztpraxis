import type { Location } from '@/payload-types'
import { getMediaAlt, isMedia, toSiteImageSrc } from '@/utilities/media'

const B = '/design-system/brand' as const

export const PRACTICE_LOGOS = {
  appenzell: {
    src: `${B}/logo-appenzell-header.png`,
    width: 852,
    height: 126,
    alt: 'Zahnarztpraxis Palatty Appenzell AG — Dein Lächeln. Unsere Leidenschaft.',
  },
  gais: {
    src: `${B}/logo-gais-on-media.png`,
    width: 744,
    height: 126,
    alt: 'Zahnarztpraxis Palatty Gais AG — Dein Lächeln. Unsere Leidenschaft.',
  },
} as const

export type BrandLogo = {
  src: string
  width: number
  height: number
  alt: string
}

export function resolveBrandLogo(location: Location): BrandLogo {
  const slug = location.slug === 'gais' ? 'gais' : 'appenzell'
  const fallback = PRACTICE_LOGOS[slug]

  if (isMedia(location.logo)) {
    const src = toSiteImageSrc(location.logo.sizes?.card?.url || location.logo.url)
    if (src) {
      return {
        src,
        width: location.logo.width || fallback.width,
        height: location.logo.height || fallback.height,
        alt: getMediaAlt(location.logo, fallback.alt),
      }
    }
  }

  return fallback
}
