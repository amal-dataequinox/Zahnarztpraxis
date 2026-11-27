import type { Location, Media } from '@/payload-types'

export const isMedia = (value: unknown): value is Media =>
  Boolean(value && typeof value === 'object' && 'url' in value)

export const isVideoMedia = (media: Media | number | null | undefined): media is Media =>
  isMedia(media) && Boolean(media.mimeType?.startsWith('video/'))

/** Payload may store absolute URLs (localhost or NEXT_PUBLIC_SERVER_URL); next/image needs relative local paths. */
export const toSiteImageSrc = (url: string | null | undefined): string | null => {
  if (!url) return null
  try {
    if (url.startsWith('/')) return url
    const parsed = new URL(url)
    if (
      parsed.pathname.startsWith('/api/media/') ||
      parsed.pathname.startsWith('/design-system/') ||
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.localhost')
    ) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    return url
  }
  return url
}

export const getMediaUrl = (
  media: Media | number | null | undefined,
  size?: 'thumbnail' | 'card' | 'hero',
): string | null => {
  if (!isMedia(media) || !media.url) return null
  const raw = size && media.sizes?.[size]?.url ? media.sizes[size]!.url! : media.url
  return toSiteImageSrc(raw)
}

export const getMediaAlt = (media: Media | number | null | undefined, fallback = ''): string => {
  if (!isMedia(media)) return fallback
  return media.alt || fallback
}

export type HeroVideoSource = {
  src: string
  poster: string
  alt: string
  mimeType?: string | null
}

/** Prefer CMS location hero video; fall back to static practice assets. */
export const resolveHeroVideo = (
  location: Location,
  fallback: { src: string; poster: string; alt: string; mimeType?: string },
): HeroVideoSource => {
  const loc = location as any;
  const video = isVideoMedia(loc.heroVideo) ? loc.heroVideo : null
  const src = toSiteImageSrc(video?.url) || fallback.src
  const posterMedia = isMedia(loc.heroVideoPoster) ? loc.heroVideoPoster : null
  const poster =
    toSiteImageSrc(posterMedia?.sizes?.hero?.url || posterMedia?.url) || fallback.poster
  const alt = getMediaAlt(video, fallback.alt)
  return {
    src,
    poster,
    alt,
    mimeType: video?.mimeType || fallback.mimeType || 'video/mp4',
  }
}
