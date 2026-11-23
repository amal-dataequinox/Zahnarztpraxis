import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

import type { Location } from '@/payload-types'

import { resolveDomain } from './resolveDomain'

/**
 * Loads an active location by slug. Cached per request via React cache.
 * Returns null when the location does not exist or is inactive.
 */
export const getLocationBySlug = cache(async (slug: string): Promise<Location | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'locations',
    where: {
      and: [{ slug: { equals: slug } }, { active: { equals: true } }],
    },
    limit: 1,
    depth: 1,
  })

  return result.docs[0] ?? null
})

/**
 * Resolves the location for the current request based on the Host header.
 * This is the single entry point the frontend uses to obtain its location
 * context. Returns null for unknown domains or missing/inactive locations —
 * callers should respond with a 404 in that case.
 */
export const resolveCurrentLocation = cache(async (): Promise<Location | null> => {
  const headerList = await headers()
  const slug = resolveDomain(headerList.get('host'))
  if (!slug) return null
  return getLocationBySlug(slug)
})
