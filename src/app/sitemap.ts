import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'

import { resolveDomain } from '@/utilities/resolveDomain'
import { getLocationBySlug } from '@/utilities/resolveLocation'
import { getLocationBaseUrl } from '@/utilities/seo'

/**
 * Per-domain sitemap. Includes fixed marketing routes, published CMS pages and
 * published services for the resolved location.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headerList = await headers()
  const slug = resolveDomain(headerList.get('host'))
  if (!slug) return []

  const location = await getLocationBySlug(slug)
  if (!location) return []

  const payload = await getPayload({ config })
  const baseUrl = getLocationBaseUrl(location)
  const now = new Date(location.updatedAt)

  const [pages, services, jobs] = await Promise.all([
    payload.find({
      collection: 'pages',
      limit: 500,
      overrideAccess: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          {
            or: [{ location: { equals: location.id } }, { location: { exists: false } }],
          },
        ],
      },
      select: { slug: true, pageType: true, updatedAt: true },
    }),
    payload.find({
      collection: 'services',
      limit: 100,
      overrideAccess: false,
      where: {
        and: [{ _status: { equals: 'published' } }, { locations: { contains: location.id } }],
      },
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'jobs',
      limit: 100,
      overrideAccess: false,
      where: {
        status: { equals: 'active' },
      },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const fixed = ['/leistungen', '/team', '/jobs', '/kontakt'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }))

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now },
    ...fixed,
    ...pages.docs
      .filter((page) => page.pageType !== 'home')
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updatedAt),
      })),
    ...services.docs.map((service) => ({
      url: `${baseUrl}/leistungen/${service.slug}`,
      lastModified: new Date(service.updatedAt),
    })),
    ...jobs.docs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.updatedAt),
    })),
  ]

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const entry of entries) {
    byUrl.set(entry.url, entry)
  }
  return Array.from(byUrl.values())
}
