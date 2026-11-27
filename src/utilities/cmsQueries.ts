import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

import type {
  DesignSystem,
  Location,
  Navigation,
  Page,
  Service,
  SiteSetting,
  TeamMember,
} from '@/payload-types'

const fetchDesignSystemCached = unstable_cache(
  async (): Promise<DesignSystem> => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'design-system', depth: 1 })
  },
  ['cms-design-system-v1'],
  { revalidate: 60, tags: ['cms', 'cms-design-system'] },
)

export const getDesignSystem = cache(async (): Promise<DesignSystem> => {
  return fetchDesignSystemCached()
})

const fetchHomePageGlobalCached = unstable_cache(
  async (): Promise<Record<string, any> | null> => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'home-page' as any, depth: 2 }).catch(() => null)
  },
  ['cms-home-page-global-v1'],
  { revalidate: 60, tags: ['cms', 'cms-home-page'] },
)

export const getHomePageGlobal = cache(async (): Promise<Record<string, any> | null> => {
  return fetchHomePageGlobalCached()
})

const fetchSiteSettingsCached = unstable_cache(
  async (): Promise<SiteSetting> => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  ['cms-site-settings-v1'],
  { revalidate: 60, tags: ['cms', 'cms-site-settings'] },
)

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  return fetchSiteSettingsCached()
})

const fetchNavigationCached = unstable_cache(
  async (locationId: number, identifier: 'main' | 'footer'): Promise<Navigation | null> => {
    const payload = await getPayload({ config })

    const scoped = await payload.find({
      collection: 'navigation',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { identifier: { equals: identifier } },
          { location: { equals: locationId } },
        ],
      },
    })

    if (scoped.docs[0]) return scoped.docs[0]

    const shared = await payload.find({
      collection: 'navigation',
      depth: 2,
      limit: 1,
      where: {
        and: [{ identifier: { equals: identifier } }, { location: { exists: false } }],
      },
    })

    return shared.docs[0] ?? null
  },
  ['cms-navigation-v1'],
  { revalidate: 60, tags: ['cms', 'cms-navigation'] },
)

export const getNavigation = cache(
  async (locationId: number, identifier: 'main' | 'footer' = 'main'): Promise<Navigation | null> => {
    return fetchNavigationCached(locationId, identifier)
  },
)

const fetchHomePageCached = unstable_cache(
  async (locationId: number): Promise<Page | null> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 1,
      where: {
        and: [
          { pageType: { equals: 'home' } },
          { _status: { equals: 'published' } },
          {
            or: [{ location: { equals: locationId } }, { location: { exists: false } }],
          },
        ],
      },
    })
    return result.docs[0] ?? null
  },
  ['cms-home-page-doc-v1'],
  { revalidate: 60, tags: ['cms', 'cms-pages'] },
)

export const getHomePage = cache(async (locationId: number): Promise<Page | null> => {
  return fetchHomePageCached(locationId)
})

async function fetchPageBySlug(
  slug: string,
  locationId: number,
  draft: boolean,
): Promise<Page | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    draft,
    overrideAccess: draft,
    depth: 2,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        {
          or: [{ location: { equals: locationId } }, { location: { exists: false } }],
        },
      ],
    },
  })
  return result.docs[0] ?? null
}

const fetchPageBySlugCached = unstable_cache(
  async (slug: string, locationId: number): Promise<Page | null> => {
    return fetchPageBySlug(slug, locationId, false)
  },
  ['cms-page-by-slug-v1'],
  { revalidate: 60, tags: ['cms', 'cms-pages'] },
)

export const getPageBySlug = cache(
  async (slug: string, locationId: number, draft = false): Promise<Page | null> => {
    if (draft) {
      return fetchPageBySlug(slug, locationId, true)
    }
    return fetchPageBySlugCached(slug, locationId)
  },
)

const fetchServicesForLocationCached = unstable_cache(
  async (_locationId: number): Promise<Service[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'services',
      depth: 1,
      limit: 100,
      sort: 'displayOrder',
      where: {
        _status: { equals: 'published' },
      },
    })
    return result.docs
  },
  ['cms-services-list-v1'],
  { revalidate: 60, tags: ['cms', 'cms-services'] },
)

export const getServicesForLocation = cache(async (locationId: number): Promise<Service[]> => {
  return fetchServicesForLocationCached(locationId)
})

const fetchServiceBySlugCached = unstable_cache(
  async (slug: string, _locationId: number): Promise<Service | null> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'services',
      depth: 1,
      limit: 1,
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
      },
    })
    return result.docs[0] ?? null
  },
  ['cms-service-by-slug-v1'],
  { revalidate: 60, tags: ['cms', 'cms-services'] },
)

export const getServiceBySlug = cache(
  async (slug: string, locationId: number): Promise<Service | null> => {
    return fetchServiceBySlugCached(slug, locationId)
  },
)

const fetchTeamForLocationCached = unstable_cache(
  async (_locationId: number): Promise<TeamMember[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'team-members',
      depth: 1,
      limit: 100,
      sort: 'displayOrder',
      where: {
        active: { equals: true },
      },
    })
    return result.docs
  },
  ['cms-team-list-v1'],
  { revalidate: 60, tags: ['cms', 'cms-team'] },
)

export const getTeamForLocation = cache(async (locationId: number): Promise<TeamMember[]> => {
  return fetchTeamForLocationCached(locationId)
})

export const formatOpeningHours = (location: Location) => location.openingHours ?? []
