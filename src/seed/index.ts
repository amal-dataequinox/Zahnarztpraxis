/**
 * Idempotent seed for Phase 1–3 development.
 *
 * Creates:
 * - Super admin (from SEED_SUPERADMIN_* env vars)
 * - Appenzell + Gais locations with real data from the live websites
 * - The eight treatment names as published services (names only — no invented
 *   medical descriptions)
 * - Site settings defaults
 * - Shared main navigation (Start, Leistungen, Team, Kontakt)
 *
 * Does NOT create: team members, testimonials, fabricated photos or medical claims.
 *
 * Usage: `pnpm seed`
 */

import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

import { ROLES } from '@/access'
import { formatSlug } from '@/fields/slug'

type TimeRange = { from: string; to: string }
type DaySchedule = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  closed?: boolean
  ranges?: TimeRange[]
}

const appenzellOpeningHours: DaySchedule[] = [
  {
    day: 'monday',
    ranges: [
      { from: '08:00', to: '12:00' },
      { from: '14:00', to: '18:00' },
    ],
  },
  {
    day: 'tuesday',
    ranges: [
      { from: '08:00', to: '12:00' },
      { from: '13:00', to: '17:00' },
    ],
  },
  {
    day: 'wednesday',
    ranges: [
      { from: '08:00', to: '12:00' },
      { from: '13:00', to: '17:00' },
    ],
  },
  {
    day: 'thursday',
    ranges: [
      { from: '08:00', to: '12:00' },
      { from: '14:00', to: '18:00' },
    ],
  },
  {
    day: 'friday',
    ranges: [
      { from: '08:00', to: '12:00' },
      { from: '14:00', to: '18:00' },
    ],
  },
  { day: 'saturday', closed: true },
  { day: 'sunday', closed: true },
]

const gaisOpeningHours: DaySchedule[] = [
  { day: 'monday', closed: true },
  { day: 'tuesday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'wednesday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'thursday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'friday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'saturday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'sunday', closed: true },
]

const gaisTelephoneAvailability: DaySchedule[] = [
  { day: 'monday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'tuesday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'wednesday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'thursday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'friday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'saturday', ranges: [{ from: '08:00', to: '17:30' }] },
  { day: 'sunday', closed: true },
]

const EMERGENCY_INFO =
  'Ausserhalb der Öffnungszeiten können Sie sich in dringenden Fällen beim städtischen Notfalldienst unter der Nummer 0844 144 006 melden.'

const SERVICE_NAMES = [
  'Prophylaxe',
  'Dentalhygiene',
  'Zahnimplantate',
  'Zahnersatz',
  'Kieferorthopädie',
  'Ästhetische Zahnmedizin',
  'Zahnfüllungen',
  'Notfallbehandlung',
] as const

const ensureSuperAdmin = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> => {
  const email = process.env.SEED_SUPERADMIN_EMAIL
  const password = process.env.SEED_SUPERADMIN_PASSWORD

  if (!email || !password) {
    payload.logger.warn(
      'SEED_SUPERADMIN_EMAIL / SEED_SUPERADMIN_PASSWORD nicht gesetzt — Super-Admin wird übersprungen.',
    )
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    payload.logger.info(`Super-Admin bereits vorhanden: ${email}`)
    return
  }

  await payload.create({
    collection: 'users',
    data: {
      name: 'Super Admin',
      email,
      password,
      role: ROLES.SUPER_ADMIN,
      active: true,
    },
    overrideAccess: true,
  })

  payload.logger.info(`Super-Admin angelegt: ${email}`)
}

const ensureLocation = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: {
    name: string
    slug: string
    domain: string
    shortDescription: string
    address: { street: string; postalCode: string; city: string; country: string }
    phone: string
    email: string
    googleMapsUrl: string
    latitude: number
    longitude: number
    bookingUrl: string
    openingHours: DaySchedule[]
    telephoneAvailability?: DaySchedule[]
    emergencyInfo: string
  },
): Promise<number> => {
  const existing = await payload.find({
    collection: 'locations',
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    payload.logger.info(`Standort bereits vorhanden: ${data.slug}`)
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'locations',
    data: {
      ...data,
      active: true,
    },
    overrideAccess: true,
  })

  payload.logger.info(`Standort angelegt: ${data.slug}`)
  return created.id
}

const ensureServices = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  locationIds: number[],
): Promise<void> => {
  for (const [index, name] of SERVICE_NAMES.entries()) {
    const existing = await payload.find({
      collection: 'services',
      where: { name: { equals: name } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        draft: false,
        data: {
          locations: locationIds,
          displayOrder: index + 1,
          _status: 'published',
        },
        overrideAccess: true,
      })
      payload.logger.info(`Leistung aktualisiert/veröffentlicht: ${name}`)
      continue
    }

    await payload.create({
      collection: 'services',
      draft: false,
      data: {
        name,
        slug: formatSlug(name),
        locations: locationIds,
        displayOrder: index + 1,
        // Intentionally no shortDescription / detailedDescription — editors
        // supply verified medical content.
        _status: 'published',
      },
      overrideAccess: true,
    })

    payload.logger.info(`Leistung veröffentlicht: ${name}`)
  }
}

const ensureSiteSettings = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> => {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brandName: 'Zahnarztpraxis Palatty',
      defaultLanguage: 'de',
      defaultSEO: {
        title: 'Zahnarztpraxis Palatty',
        description:
          'Zahnarztpraxis Palatty — Standorte in Appenzell und Gais. Professionelle zahnärztliche Fachkompetenz.',
      },
    },
    overrideAccess: true,
  })
  payload.logger.info('Website-Einstellungen aktualisiert.')
}

const MAIN_NAV_ITEMS = [
  { label: 'Start', url: '/' },
  { label: 'Leistungen', url: '/leistungen' },
  { label: 'Team', url: '/team' },
  { label: 'Kontakt', url: '/kontakt' },
] as const

const ensureNavigation = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> => {
  const items = MAIN_NAV_ITEMS.map((item) => ({
    link: {
      label: item.label,
      type: 'external' as const,
      url: item.url,
      newTab: false,
    },
  }))

  const existing = await payload.find({
    collection: 'navigation',
    where: {
      and: [{ identifier: { equals: 'main' } }, { location: { exists: false } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'navigation',
      id: existing.docs[0].id,
      data: { items },
      overrideAccess: true,
    })
    payload.logger.info('Gemeinsame Hauptnavigation aktualisiert.')
    return
  }

  await payload.create({
    collection: 'navigation',
    data: {
      name: 'Hauptnavigation (gemeinsam)',
      identifier: 'main',
      items,
    },
    overrideAccess: true,
  })

  payload.logger.info('Gemeinsame Hauptnavigation angelegt.')
}

export const seed = async (): Promise<void> => {
  const payload = await getPayload({ config })

  payload.logger.info('— Seed startet —')

  await ensureSuperAdmin(payload)

  const appenzellId = await ensureLocation(payload, {
    name: 'Zahnarztpraxis Palatty Appenzell',
    slug: 'appenzell',
    domain: 'zahnarztpraxis-palatty.ch',
    shortDescription:
      'Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar. Wir freuen uns auf Ihren Besuch.',
    address: {
      street: 'Zielstrasse 14B',
      postalCode: '9050',
      city: 'Appenzell',
      country: 'Schweiz',
    },
    phone: '+41 71 787 82 82',
    email: 'praxis@zahnarztpraxis-palatty.ch',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Zielstrasse+14B,+9050+Appenzell,+Schweiz',
    latitude: 47.332946,
    longitude: 9.4091072,
    bookingUrl:
      'https://booking.denteo.com/de/727dc64f0602c327ce8d1c73b219bd1264e88aeaacca5c855812176dafa638da/locations/2',
    openingHours: appenzellOpeningHours,
    emergencyInfo: EMERGENCY_INFO,
  })

  const gaisId = await ensureLocation(payload, {
    name: 'Zahnarztpraxis Palatty Gais',
    slug: 'gais',
    domain: 'zahnarzt-palatty.ch',
    shortDescription:
      'Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar. Wir freuen uns auf Ihren Besuch.',
    address: {
      street: 'Zellwegstrasse 4',
      postalCode: '9056',
      city: 'Gais',
      country: 'Schweiz',
    },
    phone: '+41 71 793 10 20',
    email: 'praxis@zahnarzt-palatty.ch',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Zellwegstrasse+4,+9056+Gais,+Schweiz',
    latitude: 47.3607862,
    longitude: 9.4450596,
    bookingUrl:
      'https://booking.denteo.com/de/727dc64f0602c327ce8d1c73b219bd1264e88aeaacca5c855812176dafa638da/locations/1',
    openingHours: gaisOpeningHours,
    telephoneAvailability: gaisTelephoneAvailability,
    emergencyInfo: EMERGENCY_INFO,
  })

  await ensureServices(payload, [appenzellId, gaisId])
  await ensureSiteSettings(payload)
  await ensureNavigation(payload)

  payload.logger.info('— Seed abgeschlossen —')
}

await seed()
process.exit(0)
