import type { Metadata } from 'next'

import type { Location, Media, Page } from '@/payload-types'
import { toSiteImageSrc } from './media'

const WEEKDAY_TO_SCHEMA: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

/**
 * Canonical base URL of a location. Always points at the location's
 * production domain so development/preview deployments never produce
 * cross-domain or localhost canonicals.
 */
export const getLocationBaseUrl = (location: Location): string => `https://${location.domain}`

const mediaUrl = (media: Media | number | null | undefined, baseUrl: string): string | undefined => {
  if (!media || typeof media === 'number' || !media.url) return undefined
  const normalized = toSiteImageSrc(media.url) || media.url
  return normalized.startsWith('http') ? normalized : `${baseUrl}${normalized}`
}

type PageMetaArgs = {
  location: Location
  page?: Page | null
  /** Pathname starting with "/", e.g. "/" or "/team". */
  path: string
  /** Used by fixed routes (Leistungen, Team, Kontakt) without a CMS page doc. */
  fallbackTitle?: string
  fallbackDescription?: string
}

/**
 * Builds Next.js metadata for a page on a specific location domain.
 * Falls back from page SEO -> location SEO -> location name.
 */
export const generatePageMetadata = ({
  location,
  page,
  path,
  fallbackTitle,
  fallbackDescription,
}: PageMetaArgs): Metadata => {
  const baseUrl = getLocationBaseUrl(location)
  const canonical = `${baseUrl}${path === '/' ? '' : path}` || baseUrl

  const title =
    page?.meta?.title ||
    page?.title ||
    fallbackTitle ||
    location.meta?.title ||
    location.name
  const description =
    page?.meta?.description ||
    fallbackDescription ||
    location.meta?.description ||
    location.shortDescription ||
    undefined

  const ogImage = mediaUrl(page?.meta?.image ?? location.meta?.image, baseUrl)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: title ?? undefined,
      description,
      url: canonical,
      siteName: location.name,
      locale: 'de_CH',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

/**
 * schema.org structured data for a dental practice location. Built strictly
 * from CMS-managed data — nothing is fabricated here.
 */
export const buildDentistJsonLd = (location: Location): Record<string, unknown> => {
  const baseUrl = getLocationBaseUrl(location)

  const openingHoursSpecification = (location.openingHours ?? [])
    .filter((entry) => entry.closed !== true && (entry.ranges?.length ?? 0) > 0)
    .flatMap((entry) =>
      (entry.ranges ?? []).map((range) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: WEEKDAY_TO_SCHEMA[entry.day],
        opens: range.from,
        closes: range.to,
      })),
    )

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: location.name,
    url: baseUrl,
    ...(location.phone ? { telephone: location.phone } : {}),
    ...(location.email ? { email: location.email } : {}),
    ...(location.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: location.address.street,
            postalCode: location.address.postalCode,
            addressLocality: location.address.city,
            addressCountry: location.address.country === 'Schweiz' ? 'CH' : location.address.country,
          },
        }
      : {}),
    ...(typeof location.latitude === 'number' && typeof location.longitude === 'number'
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }
      : {}),
    ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
    ...(location.googleMapsUrl ? { hasMap: location.googleMapsUrl } : {}),
  }
}
