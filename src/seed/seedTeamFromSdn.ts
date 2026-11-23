/**
 * Seed Team Members from SDN Picdrop studio filenames + existing Media uploads.
 * Names are parsed from client delivery labels only — no invented job titles.
 *
 * Run: pnpm exec tsx src/seed/seedTeamFromSdn.ts
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const STUDIO_TEAM = [
  { filename: 'BelmaMusic-15052026-303202.jpg', fullName: 'Belma Music', order: 10 },
  {
    filename: 'ChristinaMileraPoput-15052026-303141.jpg',
    fullName: 'Christina Milera Poput',
    order: 20,
  },
  { filename: 'DalinaJahiu-15052026-303097.jpg', fullName: 'Dalina Jahiu', order: 30 },
  { filename: 'JeanineWeishaupt-15052026-303168.jpg', fullName: 'Jeanine Weishaupt', order: 40 },
  { filename: 'RianaSutter-15052026-303207.jpg', fullName: 'Riana Sutter', order: 50 },
] as const

async function main() {
  const payload = await getPayload({ config })

  const locations = await payload.find({ collection: 'locations', limit: 10, depth: 0 })
  const locationIds = locations.docs.map((l) => l.id)
  if (locationIds.length === 0) {
    throw new Error('No locations found — seed locations first.')
  }

  const media = await payload.find({ collection: 'media', limit: 100, depth: 0 })
  const byFilename = new Map(
    media.docs
      .filter((m) => typeof m.filename === 'string')
      .map((m) => [m.filename as string, m.id] as const),
  )

  let created = 0
  let updated = 0

  for (const person of STUDIO_TEAM) {
    const photoId = byFilename.get(person.filename)
    if (!photoId) {
      console.warn(`Missing Media for ${person.filename} — skip`)
      continue
    }

    // Improve alt text on linked media (was placeholder)
    await payload.update({
      collection: 'media',
      id: photoId,
      data: {
        alt: `Studioaufnahme von ${person.fullName}, Mitarbeitende der Zahnarztpraxis Palatty.`,
      },
    })

    const existing = await payload.find({
      collection: 'team-members',
      limit: 1,
      where: { fullName: { equals: person.fullName } },
    })

    const data = {
      fullName: person.fullName,
      photo: photoId,
      locations: locationIds,
      displayOrder: person.order,
      active: true,
      // Position left empty until practice confirms titles
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'team-members',
        id: existing.docs[0].id,
        data,
      })
      updated += 1
      console.log(`Updated: ${person.fullName}`)
    } else {
      await payload.create({
        collection: 'team-members',
        data,
      })
      created += 1
      console.log(`Created: ${person.fullName}`)
    }
  }

  // Fix a few key interior alts while we're here
  const interiorAlts: Record<string, string> = {
    'Palatty-15052026-303287.jpg':
      'Team der Zahnarztpraxis Palatty hinter dem Empfangstresen.',
    'Palatty-15052026-303475.jpg':
      'Empfangsbereich der Zahnarztpraxis Palatty mit Tresen und Wartebereich.',
    'Palatty-15052026-303511.jpg':
      'Behandlungszimmer der Zahnarztpraxis Palatty mit Behandlungsstuhl und Tageslicht.',
    'Palatty-15052026-303541.jpg':
      'Flur und Innenraum der Zahnarztpraxis Palatty mit Glas und Pflanzen.',
    'Palatty-15052026-303305.jpg':
      'Mitarbeiterin am Empfang der Zahnarztpraxis Palatty am Telefon.',
    'Palatty-15052026-303384.jpg':
      'Zwei Mitarbeitende der Zahnarztpraxis Palatty im Flur.',
    'Palatty-15052026-303542.jpg':
      'Detail am Empfangstresen der Zahnarztpraxis Palatty.',
  }

  for (const [filename, alt] of Object.entries(interiorAlts)) {
    const id = byFilename.get(filename)
    if (!id) continue
    await payload.update({ collection: 'media', id, data: { alt } })
  }

  console.log(JSON.stringify({ created, updated, locations: locationIds.length }, null, 2))
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
