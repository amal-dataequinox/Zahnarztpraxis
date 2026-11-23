import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

import type { Location, Navigation, Page, Service, SiteSetting, TeamMember } from '@/payload-types'

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getNavigation = cache(
  async (locationId: number, identifier: 'main' | 'footer' = 'main'): Promise<Navigation | null> => {
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
)

export const getHomePage = cache(async (locationId: number): Promise<Page | null> => {
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
})

export const getPageBySlug = cache(
  async (slug: string, locationId: number, draft = false): Promise<Page | null> => {
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
  },
)

export const getServicesForLocation = cache(async (locationId: number): Promise<Service[]> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    depth: 1,
    limit: 100,
    sort: 'displayOrder',
    where: {
      and: [{ _status: { equals: 'published' } }, { locations: { contains: locationId } }],
    },
  })
  return result.docs
})

export const getServiceBySlug = cache(
  async (slug: string, locationId: number): Promise<Service | null> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'services',
      depth: 1,
      limit: 1,
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: 'published' } },
          { locations: { contains: locationId } },
        ],
      },
    })
    return result.docs[0] ?? null
  },
)

export const getTeamForLocation = cache(async (locationId: number): Promise<TeamMember[]> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'team-members',
    depth: 1,
    limit: 100,
    sort: 'displayOrder',
    where: {
      and: [{ active: { equals: true } }, { locations: { contains: locationId } }],
    },
  })
  return result.docs
})

export const formatOpeningHours = (location: Location) => location.openingHours ?? []
