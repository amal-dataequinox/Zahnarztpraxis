/**
 * Idempotent photography, video, logo, and full-CMS seeding.
 * Ensures every media slot and text/list section across the site has a live CMS record in PostgreSQL.
 */
import 'dotenv/config'

import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DS_DIR = path.resolve(dirname, '../../public/design-system')
const PHOTO_DIR = path.join(PUBLIC_DS_DIR, 'photography')

const ASSETS_TO_INGEST: Array<{ file: string; dir: string; alt: string; mediaType: 'image' | 'video' }> = [
  { file: 'BelmaMusic-15052026-303202.jpg', dir: PHOTO_DIR, alt: 'Studioaufnahme von Belma Music, Mitarbeitende der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'ChristinaMileraPoput-15052026-303141.jpg', dir: PHOTO_DIR, alt: 'Studioaufnahme von Christina Milera Poput, Mitarbeitende der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'DalinaJahiu-15052026-303097.jpg', dir: PHOTO_DIR, alt: 'Studioaufnahme von Dalina Jahiu, Mitarbeitende der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'JeanineWeishaupt-15052026-303168.jpg', dir: PHOTO_DIR, alt: 'Studioaufnahme von Jeanine Weishaupt, Mitarbeitende der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'RianaSutter-15052026-303207.jpg', dir: PHOTO_DIR, alt: 'Studioaufnahme von Riana Sutter, Mitarbeitende der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'Palatty-15052026-303287.jpg', dir: PHOTO_DIR, alt: 'Team der Zahnarztpraxis Palatty hinter dem Empfangstresen in Appenzell.', mediaType: 'image' },
  { file: 'Palatty-15052026-303305.jpg', dir: PHOTO_DIR, alt: 'Mitarbeiterin am Empfang der Zahnarztpraxis Palatty am Telefon.', mediaType: 'image' },
  { file: 'Palatty-15052026-303334.jpg', dir: PHOTO_DIR, alt: 'Persönliche Begrüssung und Abstimmung am Praxisempfang.', mediaType: 'image' },
  { file: 'Palatty-15052026-303384.jpg', dir: PHOTO_DIR, alt: 'Zwei Mitarbeitende der Zahnarztpraxis Palatty im hellen Praxisflur.', mediaType: 'image' },
  { file: 'Palatty-15052026-303394.jpg', dir: PHOTO_DIR, alt: 'Behandlungszimmer der Zahnarztpraxis Palatty Appenzell.', mediaType: 'image' },
  { file: 'Palatty-15052026-303475.jpg', dir: PHOTO_DIR, alt: 'Empfangsbereich der Zahnarztpraxis Palatty mit Tresen und Wartebereich.', mediaType: 'image' },
  { file: 'Palatty-15052026-303508.jpg', dir: PHOTO_DIR, alt: 'Lichtdurchflutetes Behandlungszimmer der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'Palatty-15052026-303511.jpg', dir: PHOTO_DIR, alt: 'Helles Eck-Behandlungszimmer mit Panoramafenstern in Appenzell.', mediaType: 'image' },
  { file: 'Palatty-15052026-303516.jpg', dir: PHOTO_DIR, alt: 'Moderner zahnmedizinischer Behandlungsplatz in Appenzell.', mediaType: 'image' },
  { file: 'Palatty-15052026-303527.jpg', dir: PHOTO_DIR, alt: 'Klar gestalteter Praxisgang mit satiniertem Glas.', mediaType: 'image' },
  { file: 'Palatty-15052026-303529.jpg', dir: PHOTO_DIR, alt: 'Behandlungsraum für Prophylaxe, Füllungen und Zahnerhalt.', mediaType: 'image' },
  { file: 'Palatty-15052026-303541.jpg', dir: PHOTO_DIR, alt: 'Flur und Innenraum der Zahnarztpraxis Palatty mit Glas und Pflanzen.', mediaType: 'image' },
  { file: 'Palatty-15052026-303542.jpg', dir: PHOTO_DIR, alt: 'Detail am Empfangstresen der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'Palatty-15052026-303542-2.jpg', dir: PHOTO_DIR, alt: 'Empfangsbereich Detailaufnahme in der Zahnarztpraxis Palatty.', mediaType: 'image' },
  { file: 'logo-palatty.png', dir: path.join(PUBLIC_DS_DIR, 'brand'), alt: 'Zahnarztpraxis Palatty — Dein Lächeln. Unsere Leidenschaft.', mediaType: 'image' },
  { file: 'welcoming-hero-poster.jpg', dir: path.join(PUBLIC_DS_DIR, 'video'), alt: 'Zahnarztpraxis Palatty Appenzell — Hero Vorschaubild.', mediaType: 'image' },
  { file: 'welcoming-hero.mp4', dir: path.join(PUBLIC_DS_DIR, 'video'), alt: 'Zahnarztpraxis Palatty Appenzell — Willkommensvideo.', mediaType: 'video' },
]

async function main() {
  const payload = await getPayload({ config })
  const mediaByKey = new Map<string, number>()

  const existingMedia = await payload.find({ collection: 'media', limit: 300, overrideAccess: true })
  for (const doc of existingMedia.docs) {
    if (doc.filename) {
      mediaByKey.set(doc.filename, doc.id as number)
    }
  }

  for (const item of ASSETS_TO_INGEST) {
    const ext = path.extname(item.file).toLowerCase()
    const baseName = item.file.slice(0, -ext.length)
    let matchedId: number | undefined
    for (const [fname, id] of mediaByKey.entries()) {
      if (fname === item.file || (fname.toLowerCase().endsWith(ext) && fname.startsWith(`${baseName}-`))) {
        matchedId = id
        break
      }
    }
    if (matchedId) {
      mediaByKey.set(item.file, matchedId)
      continue
    }

    const created = await payload.create({
      collection: 'media',
      filePath: path.join(item.dir, item.file),
      data: {
        alt: item.alt,
        mediaType: item.mediaType,
      },
      locale: 'de',
      overrideAccess: true,
    })
    mediaByKey.set(item.file, created.id as number)
    console.log('Ingested media:', item.file, '-> id:', created.id)
  }

  const receptionId = mediaByKey.get('Palatty-15052026-303475.jpg')
  const treatmentMainId = mediaByKey.get('Palatty-15052026-303511.jpg')
  const detailDeskId = mediaByKey.get('Palatty-15052026-303384.jpg')
  const teamGroupId = mediaByKey.get('Palatty-15052026-303287.jpg')
  const hallwayAltId = mediaByKey.get('Palatty-15052026-303527.jpg')
  const teamPairId = mediaByKey.get('Palatty-15052026-303334.jpg')
  const logoId = mediaByKey.get('logo-palatty.png')
  const heroVideoId = mediaByKey.get('welcoming-hero.mp4')
  const heroPosterId = mediaByKey.get('welcoming-hero-poster.jpg')

  // 1. Update Locations with CMS media
  const locations = await payload.find({ collection: 'locations', limit: 10, depth: 0, overrideAccess: true })
  const locationIds = locations.docs.map((l) => l.id as number)
  for (const loc of locations.docs) {
    const locPatch: Record<string, any> = {}
    if (!loc.mainImage && treatmentMainId) locPatch.mainImage = treatmentMainId
    if (!loc.logo && logoId) locPatch.logo = logoId
    if (!loc.heroVideo && heroVideoId) locPatch.heroVideo = heroVideoId
    if (!loc.heroVideoPoster && heroPosterId) locPatch.heroVideoPoster = heroPosterId
    if (Object.keys(locPatch).length > 0) {
      await payload.update({
        collection: 'locations',
        id: loc.id,
        data: locPatch,
        overrideAccess: true,
      })
    }
  }
  console.log('Linked Locations CMS media.')

  // 2. Update SiteSettings sharedMedia + UI texts
  const currentSettings = (await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
  })) as Record<string, any>
  const sharedMedia = { ...(currentSettings?.sharedMedia || {}) }
  if (!sharedMedia.logo && logoId) sharedMedia.logo = logoId
  if (!sharedMedia.fallbackOgImage && receptionId) sharedMedia.fallbackOgImage = receptionId
  if (!sharedMedia.defaultHeroImage && treatmentMainId) sharedMedia.defaultHeroImage = treatmentMainId
  if (!sharedMedia.defaultCtaImage && receptionId) sharedMedia.defaultCtaImage = receptionId

  const settingsPatch: Record<string, any> = { sharedMedia }
  if (!currentSettings?.bookingCtaLabel) settingsPatch.bookingCtaLabel = 'Termin anfragen'
  if (!currentSettings?.contactFormButtonLabel) settingsPatch.contactFormButtonLabel = 'Nachricht senden'
  if (!currentSettings?.serviceSidebarEyebrow) settingsPatch.serviceSidebarEyebrow = 'Termin & Beratung'
  if (!currentSettings?.relatedServicesHeading) settingsPatch.relatedServicesHeading = 'Weitere Behandlungen'
  if (!currentSettings?.serviceSidebarDescription) {
    settingsPatch.serviceSidebarDescription =
      'Vereinbaren Sie Ihren Termin bequem telefonisch oder online – unser Praxisteam in Appenzell berät Sie gerne persönlich.'
  }
  if (!currentSettings?.serviceFallbackDetail) {
    settingsPatch.serviceFallbackDetail =
      'Jede zahnmedizinische Behandlung beginnt bei uns mit einem ruhigen Gespräch und einer verständlichen Diagnostik. Gerne erläutern wir Ihnen alle passenden Behandlungsschritte direkt in unserer Praxis.'
  }
  if (!currentSettings?.footerHoursLabel) settingsPatch.footerHoursLabel = 'Öffnungszeiten'
  if (!currentSettings?.footerNavLabel) settingsPatch.footerNavLabel = 'Navigation'
  if (!currentSettings?.footerLegalLabel) settingsPatch.footerLegalLabel = 'Praxis & Rechtliches'

  await payload.updateGlobal({
    slug: 'site-settings',
    data: settingsPatch,
    overrideAccess: true,
  })
  console.log('Updated SiteSettings sharedMedia & UI labels.')

  // 3. Ensure 5 TeamMembers linked to portraits
  const studioTeam = [
    { filename: 'BelmaMusic-15052026-303202.jpg', fullName: 'Belma Music', order: 10 },
    { filename: 'ChristinaMileraPoput-15052026-303141.jpg', fullName: 'Christina Milera Poput', order: 20 },
    { filename: 'DalinaJahiu-15052026-303097.jpg', fullName: 'Dalina Jahiu', order: 30 },
    { filename: 'JeanineWeishaupt-15052026-303168.jpg', fullName: 'Jeanine Weishaupt', order: 40 },
    { filename: 'RianaSutter-15052026-303207.jpg', fullName: 'Riana Sutter', order: 50 },
  ]
  for (const person of studioTeam) {
    const photoId = mediaByKey.get(person.filename)
    if (!photoId) continue
    const existing = await payload.find({
      collection: 'team-members',
      limit: 1,
      where: { fullName: { equals: person.fullName } },
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      if (!existing.docs[0].photo) {
        await payload.update({
          collection: 'team-members',
          id: existing.docs[0].id,
          data: { photo: photoId, active: true },
          overrideAccess: true,
        })
      }
    } else {
      await payload.create({
        collection: 'team-members',
        locale: 'de',
        overrideAccess: true,
        data: {
          fullName: person.fullName,
          photo: photoId,
          locations: locationIds,
          displayOrder: person.order,
          active: true,
        },
      })
    }
  }

  // 4. Link featuredImage & category on Services
  const serviceMetaMap: Record<string, { file: string; category: 'vorsorge' | 'zahnerhalt' | 'aesthetik' | 'notfall' }> = {
    prophylaxe: { file: 'Palatty-15052026-303529.jpg', category: 'vorsorge' },
    dentalhygiene: { file: 'Palatty-15052026-303516.jpg', category: 'vorsorge' },
    zahnimplantate: { file: 'Palatty-15052026-303511.jpg', category: 'zahnerhalt' },
    zahnersatz: { file: 'Palatty-15052026-303542.jpg', category: 'zahnerhalt' },
    kieferorthopaedie: { file: 'Palatty-15052026-303334.jpg', category: 'aesthetik' },
    'aesthetische-zahnmedizin': { file: 'Palatty-15052026-303475.jpg', category: 'aesthetik' },
    zahnfuellungen: { file: 'Palatty-15052026-303511.jpg', category: 'zahnerhalt' },
    notfallbehandlung: { file: 'Palatty-15052026-303527.jpg', category: 'notfall' },
  }
  const existingServices = await payload.find({ collection: 'services', limit: 50, overrideAccess: true })
  for (const svc of existingServices.docs) {
    const spec = svc.slug ? serviceMetaMap[svc.slug] : undefined
    if (!spec) continue
    const svcPatch: Record<string, any> = {}
    if (!svc.featuredImage) {
      const mId = mediaByKey.get(spec.file)
      if (mId) svcPatch.featuredImage = mId
    }
    if (!(svc as any).category) svcPatch.category = spec.category
    if (Object.keys(svcPatch).length > 0) {
      await payload.update({
        collection: 'services',
        id: svc.id,
        data: svcPatch,
        locale: 'de',
        overrideAccess: true,
      })
    }
  }
  console.log('Updated Services category & featuredImage.')

  // 5. Update HomePage Global with full media + editable text lists
  const currentHome = (await payload.findGlobal({
    slug: 'home-page' as any,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, any>
  const g1 = receptionId
  const g2 = mediaByKey.get('Palatty-15052026-303541.jpg')
  const g3 = mediaByKey.get('Palatty-15052026-303529.jpg')
  const g4 = teamGroupId

  const homePatch: Record<string, any> = {}
  if (!currentHome?.heroMedia && heroVideoId) homePatch.heroMedia = heroVideoId
  if (!currentHome?.heroVideoPoster && heroPosterId) homePatch.heroVideoPoster = heroPosterId
  if (!currentHome?.heroScrollLabel) homePatch.heroScrollLabel = 'Entdecken'
  if (!currentHome?.aboutImage && treatmentMainId) homePatch.aboutImage = treatmentMainId
  if (!currentHome?.aboutDetailImage && detailDeskId) homePatch.aboutDetailImage = detailDeskId
  if (!currentHome?.aboutBadgeLabel) homePatch.aboutBadgeLabel = 'Im Herzen der Praxis'
  if (!Array.isArray(currentHome?.aboutHighlights) || currentHome.aboutHighlights.length === 0) {
    homePatch.aboutHighlights = [
      { label: 'Moderne Behandlungstechnik' },
      { label: 'Persönliche Betreuung' },
      { label: 'Zentral in Appenzell' },
    ]
  }
  if (!currentHome?.servicesHeadingHighlight) homePatch.servicesHeadingHighlight = 'in Appenzell.'
  if (!currentHome?.teamDefaultRoleLabel) homePatch.teamDefaultRoleLabel = 'Praxisteam Appenzell'
  if (!currentHome?.locationHeadingHighlight) homePatch.locationHeadingHighlight = 'erreichen.'
  if (!currentHome?.appointmentImage && receptionId) homePatch.appointmentImage = receptionId

  if (!currentHome?.galleryEyebrow) homePatch.galleryEyebrow = 'Atmosphäre & Räume'
  if (!currentHome?.galleryHeading) homePatch.galleryHeading = 'Einblicke in unsere Praxis.'
  if (!currentHome?.galleryHighlight) homePatch.galleryHighlight = 'Helle Räume in Appenzell.'
  if (!currentHome?.galleryDescription) {
    homePatch.galleryDescription =
      'Lichtdurchflutete Behandlungszimmer, ruhige Materialien und ein herzlicher Empfang – damit Sie sich vom ersten Moment an gut aufgehoben fühlen.'
  }
  if ((!currentHome?.galleryItems || currentHome.galleryItems.length === 0) && g1 && g2 && g3 && g4) {
    homePatch.galleryItems = [
      {
        image: g1,
        category: 'Empfang',
        caption: 'Herzliche Begrüssung an unserer Empfangstheke in Appenzell',
        layoutSpan: 'wide',
      },
      {
        image: g2,
        category: 'Architektur',
        caption: 'Klare Linien, viel Tageslicht und ruhige Glasflächen',
        layoutSpan: 'standard',
      },
      {
        image: g3,
        category: 'Behandlung',
        caption: 'Moderne Behandlungsräume für Vorsorge & Zahnerhalt',
        layoutSpan: 'standard',
      },
      {
        image: g4,
        category: 'Praxisteam',
        caption: 'Eingespieltes Team mit persönlicher Betreuung',
        layoutSpan: 'wide',
      },
    ]
  }

  if (Object.keys(homePatch).length > 0) {
    await payload.updateGlobal({
      slug: 'home-page' as any,
      data: homePatch,
      overrideAccess: true,
    })
  }
  console.log('Updated HomePage global.')

  // 6. Populate CMS Page block images & rich defaults on Pages
  const heroImageBySlug: Record<string, number | undefined> = {
    leistungen: treatmentMainId,
    team: teamGroupId,
    kontakt: receptionId,
    notfall: hallwayAltId,
    jobs: teamPairId,
  }
  const allPages = await payload.find({ collection: 'pages', limit: 20, depth: 0, overrideAccess: true })
  for (const p of allPages.docs) {
    if (!Array.isArray(p.layout) || p.layout.length === 0) continue
    let changed = false
    const updatedLayout = p.layout.map((block: any) => {
      const next = { ...block }
      if (next.blockType === 'hero') {
        if (!next.image && p.slug && heroImageBySlug[p.slug]) {
          next.image = heroImageBySlug[p.slug]
          changed = true
        }
        if (!next.eyebrow && p.slug) {
          next.eyebrow = p.slug === 'impressum' || p.slug === 'datenschutz' ? 'Rechtliches' : 'Appenzell'
          changed = true
        }
      }
      if (next.blockType === 'callToAction' && !next.image && receptionId) {
        next.image = receptionId
        changed = true
      }
      if (next.blockType === 'teamOverview') {
        if (!next.eyebrow) { next.eyebrow = 'Praxisteam'; changed = true }
        if (!next.defaultRoleLabel) { next.defaultRoleLabel = 'Praxisteam Appenzell'; changed = true }
      }
      if (next.blockType === 'servicesOverview') {
        if (!next.eyebrow) { next.eyebrow = 'Leistungen'; changed = true }
        if (!next.headingHighlight) { next.headingHighlight = 'in Appenzell.'; changed = true }
        if (!next.cardLinkLabel) { next.cardLinkLabel = 'Behandlung entdecken'; changed = true }
        if (!next.journeyEyebrow) { next.journeyEyebrow = 'Unser Ablauf'; changed = true }
        if (!next.journeyHeading) { next.journeyHeading = 'Ihr Besuch'; changed = true }
        if (!next.journeyHighlight) { next.journeyHighlight = 'in drei klaren Schritten.'; changed = true }
        if (!next.journeyDescription) {
          next.journeyDescription =
            'Von der ersten Untersuchung bis zur nachhaltigen Nachsorge begleiten wir Sie strukturiert und verständlich.'
          changed = true
        }
        if (!Array.isArray(next.journeySteps) || next.journeySteps.length === 0) {
          next.journeySteps = [
            {
              step: '01 / BERATUNG',
              icon: 'chat',
              title: 'Ankommen & Diagnose',
              description:
                'Wir nehmen uns Zeit für Ihr Anliegen, klären alle Fragen in Ruhe und verschaffen uns ein präzises Bild.',
            },
            {
              step: '02 / PLANUNG',
              icon: 'compass',
              title: 'Klare Empfehlung',
              description:
                'Sie erhalten verständliche Behandlungsoptionen inklusive transparentem Ablauf und nachvollziehbarer Kostenübersicht.',
            },
            {
              step: '03 / BEHANDLUNG',
              icon: 'shield',
              title: 'Schonende Umsetzung',
              description:
                'Moderne Technik, ein eingespieltes Team und eine ruhige Atmosphäre sorgen für eine angenehme Behandlung.',
            },
          ]
          changed = true
        }
        if (!next.ctaEyebrow) { next.ctaEyebrow = 'Termin & Beratung'; changed = true }
        if (!next.ctaHeading) { next.ctaHeading = 'Persönliche Beratung'; changed = true }
        if (!next.ctaHighlight) { next.ctaHighlight = 'in Appenzell.'; changed = true }
        if (!next.ctaDescription) {
          next.ctaDescription =
            'Sie möchten wissen, welche Behandlung optimal zu Ihren Zähnen passt? Vereinbaren Sie gerne Ihren Termin telefonisch oder direkt online.'
          changed = true
        }
        if (!next.ctaButtonLabel) { next.ctaButtonLabel = 'Termin vereinbaren'; changed = true }
        if (!next.ctaImage && receptionId) { next.ctaImage = receptionId; changed = true }
      }
      return next
    })

    if (changed) {
      await payload.update({
        collection: 'pages',
        id: p.id,
        data: { layout: updatedLayout, _status: 'published' },
        locale: 'de',
        overrideAccess: true,
      })
      console.log('Updated CMS layout blocks for page:', p.slug)
    }
  }

  console.log('SEED_FULL_CMS_COMPLETE')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
