/**
 * Idempotent migration seed from the legacy website https://zahnarztpraxis-palatty.ch/.
 * Imports missing leadership portraits & SSO Zahnunfall PDF into Payload Media,
 * updates Locations, HomePage, SiteSettings, Navigation, Services (all 17 Fachbereiche),
 * TeamMembers (with biographies), and all 7 CMS Pages strictly via Payload Local API.
 */
import 'dotenv/config'

import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import config from '../payload.config'

type RichBlock =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }

function makeTextNode(text: string) {
  return {
    type: 'text',
    text,
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

function makeRichText(blocks: RichBlock[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: blocks.map((b) => {
        if (b.type === 'h2' || b.type === 'h3') {
          return {
            type: 'heading',
            tag: b.type,
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [makeTextNode(b.text)],
          }
        }
        if (b.type === 'quote') {
          return {
            type: 'quote',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [makeTextNode(b.text)],
          }
        }
        if (b.type === 'ul') {
          return {
            type: 'list',
            listType: 'bullet',
            start: 1,
            tag: 'ul',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: b.items.map((item, idx) => ({
              type: 'listitem',
              value: idx + 1,
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [makeTextNode(item)],
            })),
          }
        }
        return {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children: [makeTextNode(b.text)],
        }
      }),
    },
  }
}

async function ensureRemoteMedia(
  payload: Payload,
  opts: {
    url: string
    filename: string
    alt: string
    mimeType: string
    mediaType: 'image' | 'document'
  },
): Promise<number> {
  const baseName = opts.filename.replace(/\.[^.]+$/, '').toLowerCase()
  const ext = path.extname(opts.filename).toLowerCase()
  const existing = await payload.find({ collection: 'media', limit: 100, overrideAccess: true })
  const match = existing.docs.find((doc) => {
    const fn = (doc.filename || '').toLowerCase()
    return (
      fn === opts.filename.toLowerCase() ||
      (fn.startsWith(`${baseName}-`) && fn.endsWith(ext))
    )
  })
  if (match) return match.id

  const res = await fetch(opts.url)
  if (!res.ok) {
    throw new Error(`Failed to fetch remote media ${opts.url}: HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const tmpFile = path.join(os.tmpdir(), opts.filename)
  fs.writeFileSync(tmpFile, buf)
  try {
    const created = await payload.create({
      collection: 'media',
      locale: 'de',
      overrideAccess: true,
      data: {
        alt: opts.alt,
        mediaType: opts.mediaType,
      },
      filePath: tmpFile,
    })
    return created.id
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)
  }
}

async function findMediaIdByPrefix(payload: Payload, filePrefix: string): Promise<number | null> {
  const base = filePrefix.replace(/\.[^.]+$/, '').toLowerCase()
  const ext = path.extname(filePrefix).toLowerCase()
  const all = await payload.find({ collection: 'media', limit: 150, overrideAccess: true })
  const found = all.docs.find((d) => {
    const f = (d.filename || '').toLowerCase()
    return f === filePrefix.toLowerCase() || (f.startsWith(`${base}-`) && f.endsWith(ext))
  })
  return found ? found.id : null
}

async function ensureLocalServiceMedia(
  payload: Payload,
  filename: string,
  alt: string,
): Promise<number | null> {
  const existingId = await findMediaIdByPrefix(payload, filename)
  if (existingId) return existingId

  const fullPath = path.resolve(process.cwd(), 'public/design-system/services', filename)
  if (!fs.existsSync(fullPath)) return null

  const created = await payload.create({
    collection: 'media',
    locale: 'de',
    overrideAccess: true,
    data: {
      alt,
      mediaType: 'image',
    },
    filePath: fullPath,
  })
  return created.id
}

async function seed() {
  const payload = await getPayload({ config })

  // 1. Ensure Appenzell location
  const locs = await payload.find({
    collection: 'locations',
    where: { slug: { equals: 'appenzell' } },
    limit: 1,
    overrideAccess: true,
  })
  const appenzell = locs.docs[0]
  if (!appenzell) {
    throw new Error('Appenzell location not found.')
  }
  const locationId = appenzell.id

  // 2. Ensure remote assets from zahnarztpraxis-palatty.ch into CMS Media
  const gishaPhotoId = await ensureRemoteMedia(payload, {
    url: 'https://zahnarztpraxis-palatty.ch/wp-content/uploads/2026/02/Gisha-Palatty.jpg',
    filename: 'Gisha-Palatty.jpg',
    alt: 'Porträt von Med. Dent. Gisha Palatty, Eidg. dipl. Zahnärztin & Inhaberin',
    mimeType: 'image/jpeg',
    mediaType: 'image',
  })
  const antonioPhotoId = await ensureRemoteMedia(payload, {
    url: 'https://zahnarztpraxis-palatty.ch/wp-content/uploads/2026/02/Antonio.jpg',
    filename: 'Antonio-Elenjikkal.jpg',
    alt: 'Porträt von Antonio Elenjikkal, CEO und Inhaber',
    mimeType: 'image/jpeg',
    mediaType: 'image',
  })
  const zahnunfallPdfId = await ensureRemoteMedia(payload, {
    url: 'https://zahnarztpraxis-palatty.ch/wp-content/uploads/2025/10/SSO_Plakat_Zahnunfall_d_A3_b2eea6485c.pdf',
    filename: 'SSO_Plakat_Zahnunfall.pdf',
    alt: 'SSO Merkblatt zum Zahnunfall (PDF)',
    mimeType: 'application/pdf',
    mediaType: 'document',
  })

  // Existing SDN photos in CMS Media
  const img303511 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303511.jpg')
  const img303516 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303516.jpg')
  const img303527 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303527.jpg')
  const img303529 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303529.jpg')
  const img303541 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303541.jpg')
  const img303542 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303542.jpg')
  const img303475 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303475.jpg')
  const img303384 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303384.jpg')
  const img303394 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303394.jpg')
  const img303334 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303334.jpg')
  const img303305 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303305.jpg')
  const img303287 = await findMediaIdByPrefix(payload, 'Palatty-15052026-303287.jpg')

  const belmaPhotoId = await findMediaIdByPrefix(payload, 'BelmaMusic-15052026-303202.jpg')
  const christinaPhotoId = await findMediaIdByPrefix(payload, 'ChristinaMileraPoput-15052026-303141.jpg')
  const dalinaPhotoId = await findMediaIdByPrefix(payload, 'DalinaJahiu-15052026-303097.jpg')
  const jeaninePhotoId = await findMediaIdByPrefix(payload, 'JeanineWeishaupt-15052026-303168.jpg')
  const rianaPhotoId = await findMediaIdByPrefix(payload, 'RianaSutter-15052026-303207.jpg')

  // Bespoke AI header & appointment images
  const heroLeistungenId = await ensureLocalServiceMedia(
    payload,
    'hero-leistungen.jpg',
    'Helles alpines Behandlungszimmer der Zahnarztpraxis Palatty Appenzell',
  )
  const heroKontaktId = await ensureLocalServiceMedia(
    payload,
    'hero-kontakt.jpg',
    'Ruhiger moderner Empfangs- und Loungebereich der Zahnarztpraxis Palatty Appenzell',
  )
  const heroJobsId = await ensureLocalServiceMedia(
    payload,
    'hero-jobs.jpg',
    'Moderner Arbeits- und Praxisbereich für Zahnärztinnen und Zahnärzte bei Palatty',
  )
  const heroNotfallId = await ensureLocalServiceMedia(
    payload,
    'hero-notfall.jpg',
    'Soforthilfe-Behandlungszimmer für zahnärztliche Notfälle in Appenzell',
  )
  const sectionTerminId = await ensureLocalServiceMedia(
    payload,
    'section-termin.jpg',
    'Herzlicher Empfang und Terminvereinbarung in der Zahnarztpraxis Palatty Appenzell',
  )

  // 3. Update Locations (Appenzell): HIN E-Mail, Booking URL, Opening Hours, Emergency Services & Leaflet
  await payload.update({
    collection: 'locations',
    id: locationId,
    locale: 'de',
    overrideAccess: true,
    data: {
      name: 'Zahnarztpraxis Palatty Appenzell',
      shortDescription:
        'Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar. Als Familienzahnarztpraxis im Herzen von Appenzell begleiten wir Menschen jeden Alters mit Herz, Kompetenz und einem offenen Ohr.',
      phone: '+41 71 787 82 82',
      email: 'praxis@zahnarztpraxis-palatty.ch',
      hinEmail: 'zahnarztpraxispalattyai@hin.ch',
      bookingUrl:
        'https://booking.denteo.com/de/727dc64f0602c327ce8d1c73b219bd1264e88aeaacca5c855812176dafa638da/locations/2',
      emergencyInfo:
        'Ausserhalb der Öffnungszeiten können Sie sich in dringenden Fällen beim regionalen zahnärztlichen Notfalldienst melden.',
      emergencyServices: [
        { region: 'Kanton Appenzell AR/AI', phone: '0844 144 006' },
        { region: 'Region Rheintal', phone: '0844 144 002' },
      ],
      emergencyLeaflet: zahnunfallPdfId,
      emergencyLeafletLabel: 'Merkblatt zum Zahnunfall (SSO PDF)',
    } as any,
  })
  console.log('Updated Location (Appenzell) with HIN, Denteo, emergency hotlines & Zahnunfall PDF.')

  // 4. Update SiteSettings
  const currentSettings = (await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
  })) as Record<string, any>
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'de',
    overrideAccess: true,
    data: {
      brandName: 'Zahnarztpraxis Palatty Appenzell',
      bookingCtaLabel: 'Online Terminbuchung',
      contactFormButtonLabel: 'Anfrage absenden',
      sharedMedia: {
        ...(currentSettings?.sharedMedia ?? {}),
        ...(heroLeistungenId ? { defaultHeroImage: heroLeistungenId } : {}),
        ...(sectionTerminId ? { defaultCtaImage: sectionTerminId } : {}),
      },
      footerText: makeRichText([
        { type: 'p', text: 'Dein Lächeln. Unsere Leidenschaft.' },
      ]),
      defaultSEO: {
        title: 'Zahnarztpraxis Palatty – Appenzell – Zahnärztin Gisha Palatty',
        description:
          'Willkommen in unserer Zahnarztpraxis im Herzen von Appenzell. Moderne Zahnmedizin, persönliche Betreuung und echtes Engagement unter dem Motto «Dein Lächeln. Unsere Leidenschaft.»',
      },
    } as any,
  })

  // 5. Update Navigation Collection ('main') (Start, Leistungen, Team, Jobs, Kontakt)
  const navDocs = await payload.find({
    collection: 'navigation',
    where: { identifier: { equals: 'main' } },
    limit: 5,
    overrideAccess: true,
  })
  const navItems = [
    { link: { label: 'Start', type: 'external', url: '/', newTab: false } },
    { link: { label: 'Leistungen', type: 'external', url: '/leistungen', newTab: false } },
    { link: { label: 'Team', type: 'external', url: '/team', newTab: false } },
    { link: { label: 'Jobs', type: 'external', url: '/jobs', newTab: false } },
    { link: { label: 'Kontakt', type: 'external', url: '/kontakt', newTab: false } },
  ]
  if (navDocs.docs[0]) {
    await payload.update({
      collection: 'navigation',
      id: navDocs.docs[0].id,
      locale: 'de',
      overrideAccess: true,
      data: { items: navItems } as any,
    })
  } else {
    await payload.create({
      collection: 'navigation',
      locale: 'de',
      overrideAccess: true,
      data: {
        name: 'Hauptnavigation Appenzell',
        identifier: 'main',
        location: locationId,
        items: navItems,
      } as any,
    })
  }

  // 6. Update HomePage Global with authentic copy + Tarif & Kosten
  await payload.updateGlobal({
    slug: 'home-page' as any,
    locale: 'de',
    overrideAccess: true,
    data: {
      heroBadge: 'Zahnarztpraxis Palatty Appenzell',
      heroHeadlineTop: 'Zahnmedizin,',
      heroHeadlinePrefix: 'die sich',
      heroHeadlineHighlight: 'gut\nanfühlt.',
      heroSubheadline:
        'Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar.\nWir freuen uns auf Ihren Besuch.',
      heroPrimaryCtaLabel: 'Online Terminbuchung',
      heroPrimaryCtaHref:
        'https://booking.denteo.com/de/727dc64f0602c327ce8d1c73b219bd1264e88aeaacca5c855812176dafa638da/locations/2',
      heroSecondaryCtaLabel: 'Unser Angebot',
      heroSecondaryCtaHref: '/leistungen',
      aboutEyebrow: 'Zahnarztpraxis',
      aboutHeading: 'Im Herzen von Appenzell',
      aboutLead:
        'Willkommen in unserer Zahnarztpraxis im Herzen von Appenzell – einem Ort, an dem moderne Zahnmedizin auf persönliche Betreuung und echtes Engagement trifft. Unter dem Motto „Dein Lächeln. Unsere Leidenschaft.“ setzen wir uns jeden Tag mit Freude dafür ein, dass Sie sich bei uns rundum wohlfühlen.',
      aboutBody:
        'Als Familienzahnarztpraxis begleiten wir Menschen jeden Alters mit Herz, Kompetenz und einem offenen Ohr. Unser Ziel ist es, Vertrauen aufzubauen, Sicherheit zu geben und Ihnen eine Behandlung zu bieten, die individuell auf Sie abgestimmt ist.',
      aboutExtendedParagraphs: [
        {
          text: 'Wir verbinden Erfahrung mit modernen Behandlungsmethoden und legen grossen Wert auf eine klare, verständliche Beratung. Bei uns wissen Sie jederzeit, was gemacht wird – transparent, ehrlich und nachvollziehbar.',
        },
        {
          text: 'In unseren freundlich gestalteten und modernen Räumlichkeiten schaffen wir eine angenehme Atmosphäre, in der Sie entspannt ankommen und sich gut aufgehoben fühlen können. Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch bei uns nicht nur professionell, sondern auch persönlich und angenehm ist.',
        },
      ],
      aboutHighlights: [
        { label: 'Familienzahnarztpraxis' },
        { label: 'Transparente Beratung' },
        { label: 'Mobile Zahnmedizin' },
      ],
      aboutBadgeLabel: 'Dein Lächeln. Unsere Leidenschaft.',
      aboutLinkLabel: 'Unser Team',
      aboutLinkHref: '/team',
      servicesEyebrow: 'Unser Angebot',
      servicesHeading: 'Unsere Fachbereiche',
      servicesHeadingHighlight: 'im Überblick.',
      servicesDescription:
        'Bei uns stehen Sie und Ihre Zahngesundheit im Mittelpunkt. Wir bieten Ihnen ein umfassendes Spektrum moderner Zahnmedizin – individuell abgestimmt und persönlich betreut.',
      servicesLinkLabel: 'Alle 17 Fachbereiche entdecken',
      careCards: [
        {
          id: 'pillar-vorsorge',
          eyebrow: '01 / VORSORGE',
          icon: 'shield',
          surfaceStyle: 'tinted-soft',
          title: 'Prophylaxe & Hygiene.',
          description:
            'Regelmässige professionelle Zahnreinigung und Zahnuntersuchungen für langfristige Mundgesundheit.',
          linkLabel: 'Prophylaxe',
          href: '/leistungen/prophylaxe',
        },
        {
          id: 'pillar-zahnerhalt',
          eyebrow: '02 / ZAHNERHALT',
          icon: 'tooth',
          surfaceStyle: 'white',
          title: 'Konservierend & Digital.',
          description:
            'Hochwertige Füllungstherapien, Keramiklösungen, Wurzelkanalbehandlungen und digitale 3Shape Abdrücke.',
          linkLabel: 'Konservierende Zahnheilkunde',
          href: '/leistungen/zahnfuellungen',
        },
        {
          id: 'pillar-aesthetik',
          eyebrow: '03 / ÄSTHETIK & MOBIL',
          icon: 'sparkles',
          surfaceStyle: 'tinted-cool',
          title: 'Aligner, Ästhetik & Mobil.',
          description:
            'Sanfte Aligner-Zahnkorrektur, Bleaching, Veneers sowie mobile Zahnmedizin für Altersheime und zu Hause.',
          linkLabel: 'Ästhetische Zahnmedizin',
          href: '/leistungen/aesthetische-zahnmedizin',
        },
      ],
      teamEyebrow: 'Team',
      teamHeading: 'Erfahren Sie mehr über unser Team.',
      teamDescription:
        'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch bei uns nicht nur professionell, sondern auch persönlich und angenehm ist.',
      teamLinkLabel: 'Unser Team',
      pricingEyebrow: 'Kosten – Zahnarzt',
      pricingHeading: 'Transparenter Tarif nach',
      pricingHighlight: 'SSO & DENTOTAR®.',
      pricingTaxPointLabel: 'Unser Taxpunkt',
      pricingTaxPointValue: '1.10',
      pricingDescription:
        'Wir halten uns an die Richtlinien der SSO (Schweizerische Zahnärztegesellschaft) und an den Vertrag mit den Sozialversicherungspartnern. Der mit Januar 2018 eingeführte Mindesttarif (DENTOTAR)® ist für Krankenkassen und auch für Privatpatienten gültig.',
      pricingNote:
        'Es ist wichtig, dass Sie nach der Zahnarztuntersuchung über den Befund, die Diagnose, mögliche Behandlungsvarianten und die damit verbundenen Kosten informiert werden. Natürlich können wir Ihnen einen schriftlichen Kostenvoranschlag erstellen, um Ihnen eine genaue Vorstellung der zu erwartenden Kosten für Ihre Behandlung zu geben.',
      locationEyebrow: 'Kontakt Informationen',
      locationHeading: 'Zahnarztpraxis Palatty Appenzell',
      locationHeadingHighlight: 'im Herzen der Region.',
      locationDescription:
        'Bei Fragen oder Wünschen dürfen Sie sich gerne telefonisch, per E-Mail, über HIN oder direkt über das Kontaktformular mit uns in Verbindung setzen.',
      appointmentEyebrow: 'Termine',
      appointmentHeading: 'Wir freuen uns auf Sie!',
      appointmentDescription:
        'Nutzen Sie die Online Terminbuchung. Sie können uns natürlich auch anrufen, per E-Mail schreiben oder das Kontaktformular benutzen.',
      appointmentLinkLabel: 'Zum Kontaktformular',
      ...(img303384 ? { aboutDetailImage: img303384 } : {}),
      ...(sectionTerminId ? { appointmentImage: sectionTerminId } : {}),
    } as any,
  })
  console.log('Updated HomePage global with authentic Palatty copy and DENTOTAR 1.10 section.')

  // 7. Seed All 17 Authentic Fachbereiche into Services Collection
  const legacyServices: Array<{
    targetSlug: string
    legacyExistingSlug?: string
    name: string
    category: 'vorsorge' | 'zahnerhalt' | 'aesthetik' | 'notfall'
    order: number
    imageId: number | null
    shortDescription: string
    blocks: RichBlock[]
  }> = [
    {
      targetSlug: 'prophylaxe',
      legacyExistingSlug: 'prophylaxe',
      name: 'Prophylaxe',
      category: 'vorsorge',
      order: 1,
      imageId: img303529,
      shortDescription:
        'Regelmässige professionelle Zahnreinigung und Zahnuntersuchungen für langfristige Mundgesundheit und ein frisches Gefühl.',
      blocks: [
        { type: 'h2', text: 'Prophylaxe' },
        {
          type: 'p',
          text: 'Regelmässige professionelle Behandlungen und Zahnuntersuchungen beim Zahnarzt sind entscheidend, um Ihre Mundgesundheit zu erhalten. Durch diese regelmässigen Termine können potenzielle Probleme frühzeitig erkannt und behandelt werden. Darüber hinaus ist eine richtige Ernährung ein wichtiger Faktor, um Karies und Parodontitis vorzubeugen.',
        },
        {
          type: 'p',
          text: 'Unsere Experten stehen Ihnen zur Verfügung, um Sie zu beraten und zu motivieren. Wir können Ihnen dabei helfen, die richtigen Produkte und Techniken zur schonenden und gründlichen Reinigung Ihrer Zähne zu finden. Gemeinsam können wir einen individuellen Plan entwickeln, der auf Ihre Bedürfnisse zugeschnitten ist.',
        },
        {
          type: 'p',
          text: 'Unser Ziel ist es, Ihre Mundgesundheit zu verbessern und Ihnen dabei zu helfen, ein strahlendes Lächeln zu erhalten.',
        },
      ],
    },
    {
      targetSlug: 'zirkonoxid-kronen',
      name: 'Zirkonoxid-Kronen',
      category: 'zahnerhalt',
      order: 2,
      imageId: img303542,
      shortDescription:
        'Präziser, ästhetischer Zahnersatz aus Zirkonoxid – digital gescannt, am Computer geplant und direkt in der Praxis gefräst.',
      blocks: [
        { type: 'h2', text: 'Zirkonoxid-Kronen – Direkt in unserer Praxis' },
        {
          type: 'p',
          text: 'Mit modernster digitaler Technologie planen und fertigen wir hochwertigen Zahnersatz aus Zirkonoxid – präzise, ästhetisch und individuell.',
        },
        {
          type: 'ul',
          items: [
            'Digitale Abformung: Komfortabel und präzise mit 3Shape Scanner.',
            'Individuelle Planung: Am Computer für eine optimale Passform.',
            'Hochmoderne Frästechnologie: Amann Girrbach Ceramill Motion 3 Air.',
            'Hochwertiger Zahnersatz: Natürliche Ästhetik aus Zirkonoxid.',
          ],
        },
      ],
    },
    {
      targetSlug: 'digitale-zahnabdruecke',
      name: 'Digitale Zahnabdrücke',
      category: 'zahnerhalt',
      order: 3,
      imageId: img303541,
      shortDescription:
        'Modern scannen mit dem kabellosen 3Shape TRIOS 5 – dreidimensional, präzise und ohne unangenehme Abdruckmasse.',
      blocks: [
        { type: 'h2', text: 'Modern scannen. Angenehmer behandeln.' },
        {
          type: 'p',
          text: 'Keine unangenehme Abdruckmasse mehr. Mit unserem kabellosen 3Shape TRIOS 5 erfassen wir Ihre Zähne digital und dreidimensional – komfortabel, präzise und flexibel.',
        },
        { type: 'h3', text: 'Was sind digitale Zahnabdrücke?' },
        {
          type: 'p',
          text: 'Mit unserem modernen 3Shape TRIOS 5 scannen wir Ihre Zähne mit einer kleinen Kamera. Dabei entsteht direkt am Bildschirm ein dreidimensionales Modell Ihrer Zahnsituation. Die digitale Abformung ist für viele Patientinnen und Patienten angenehmer als die herkömmliche Abdruckmasse. Besonders bei ausgeprägtem Würgereiz kann sie eine hilfreiche Alternative sein.',
        },
        { type: 'h3', text: 'Ihre Vorteile auf einen Blick' },
        {
          type: 'ul',
          items: [
            'Präzise Erfassung: Detaillierte digitale Darstellung Ihrer Zahnsituation.',
            'Mehr Komfort: Ohne herkömmliche Abdruckmasse, sofern die Behandlung dafür geeignet ist.',
            'Digitale Planung: Die Scandaten dienen als Grundlage für individuell angepassten Zahnersatz.',
            'Mobil verfügbar: Wir können den Scanner bei Bedarf auch zu Einsätzen ausserhalb der Praxis mitnehmen – beispielsweise in Pflegeheime.',
          ],
        },
        { type: 'h3', text: 'Vom Scan zum Zahnersatz' },
        {
          type: 'p',
          text: 'Die erfassten Daten können zur Planung von passgenauem Zahnersatz verwendet werden. Mit unserer Amann Girrbach Ceramill Motion 3 Air fertigen wir geeignete Restaurationen aus Zirkonoxid.',
        },
      ],
    },
    {
      targetSlug: 'zahnfuellungen',
      legacyExistingSlug: 'zahnfuellungen',
      name: 'Konservierende Zahnheilkunde',
      category: 'zahnerhalt',
      order: 4,
      imageId: img303511,
      shortDescription:
        'Versorgung kariöser oder abgebrochener Zähne mit zahnfarbenem Komposit oder laborgefertigten Vollkeramikkronen.',
      blocks: [
        { type: 'h2', text: 'Konservierende Zahnheilkunde' },
        {
          type: 'p',
          text: 'Wir bieten verschiedene Optionen zur Versorgung von kariösen oder abgebrochenen Zähnen an. Eine Möglichkeit ist die Verwendung von zahnfarbenem Kunststoff, auch bekannt als Komposit. Dieses Material wird verwendet, um den Zahn zu reparieren und ihm ein ästhetisch ansprechendes Aussehen zu verleihen.',
        },
        {
          type: 'p',
          text: 'Je nach Grösse der Schädigung oder den ästhetischen Anforderungen können wir auch laborgefertigte Vollkeramikkronen verwenden. Diese Kronen bieten eine hohe Haltbarkeit und ein natürliches Aussehen. Bei der Behandlung besprechen wir gemeinsam mit dem Patienten die verschiedenen Optionen und wählen die beste Lösung aus, die dem individuellen Bedürfnis entspricht.',
        },
        {
          type: 'p',
          text: 'Unser Ziel ist es, die Zahngesundheit wiederherzustellen und ein ästhetisch ansprechendes Ergebnis zu erzielen.',
        },
      ],
    },
    {
      targetSlug: 'aesthetische-zahnmedizin',
      legacyExistingSlug: 'aesthetische-zahnmedizin',
      name: 'Ästhetische Zahnmedizin',
      category: 'aesthetik',
      order: 5,
      imageId: img303475,
      shortDescription:
        'Homebleaching, internes Bleaching, Power Bleaching, Veneers, Zahnformkorrekturen und Lückenschluss.',
      blocks: [
        { type: 'h2', text: 'Ästhetische Zahnmedizin' },
        {
          type: 'p',
          text: 'Wir bieten verschiedene Arten des Bleachings an, darunter das Homebleaching mit einer Schiene, internes Bleaching von wurzelbehandelten Zähnen und Power Bleaching. Diese Behandlungen tragen dazu bei, Ihre Zähne aufzuhellen und ein strahlendes Lächeln zu erzielen.',
        },
        {
          type: 'p',
          text: 'Darüber hinaus bieten wir auch Veneers an – dünne Keramikschalen, die auf die Vorderseite der Zähne aufgebracht werden, um ihre Form, Farbe und Ausrichtung zu verbessern. Zahnformkorrekturen und Lückenschluss sind weitere Optionen, um das Erscheinungsbild Ihrer Zähne zu optimieren.',
        },
        {
          type: 'p',
          text: 'Unser Team steht Ihnen gerne zur Verfügung, um Sie umfassend zu beraten und die für Sie am besten geeigneten ästhetischen Behandlungen zu besprechen.',
        },
      ],
    },
    {
      targetSlug: 'kieferorthopaedie',
      legacyExistingSlug: 'kieferorthopaedie',
      name: 'Aligner Behandlung',
      category: 'aesthetik',
      order: 6,
      imageId: img303334,
      shortDescription:
        'Nahezu unsichtbare, durchsichtige Kunststoffschienen zur sanften und komfortablen Korrektur von Zahnfehlstellungen.',
      blocks: [
        { type: 'h2', text: 'Aligner Behandlung' },
        {
          type: 'p',
          text: 'Aligner sind eine orthopädische ästhetische Behandlungsmethode, die zur Ausrichtung von Zähnen benutzt werden. Aligner bestehen aus durchsichtigen Kunststoffen. Durch eine Aligner-Behandlung können Zahnfehlstellungen wie Zahnkippungen, Kopfbiss, Tiefbiss, Überbiss, offener Biss und Diasthema behandelt werden.',
        },
        {
          type: 'p',
          text: 'Nach einer zahnärztlichen Untersuchung wird beurteilt, ob eine Aligner Behandlung geeignet ist. Bei schweren kieferorthopädischen Fällen arbeiten wir mit unseren Spezialisten zusammen und sorgen dafür, dass Sie die bestmögliche Behandlung bekommen.',
        },
      ],
    },
    {
      targetSlug: 'zahnimplantate',
      legacyExistingSlug: 'zahnimplantate',
      name: 'Implantologie',
      category: 'zahnerhalt',
      order: 7,
      imageId: img303516,
      shortDescription:
        'Dauerhafter Ersatz verlorener Zähne – festsitzende Implantatkronen oder sicherer Halt für abnehmbare Rekonstruktionen.',
      blocks: [
        { type: 'h2', text: 'Implantologie' },
        {
          type: 'p',
          text: 'Zahnimplantate sind eine moderne Methode, um verlorene Zähne dauerhaft zu ersetzen. Sie bieten eine festsitzende Lösung und können auch abnehmbaren Rekonstruktionen einen verbesserten Halt geben. Das Einsetzen der Implantate erfordert jedoch spezialisiertes Wissen und Fähigkeiten; dafür arbeiten wir eng mit Chirurgie-Spezialisten zusammen.',
        },
        {
          type: 'p',
          text: 'Diese Experten haben das nötige Fachwissen und die Erfahrung, um die Implantate sicher und effektiv einzusetzen. Während des gesamten Prozesses arbeiten wir eng mit Ihnen zusammen, um sicherzustellen, dass Ihre Bedürfnisse und Erwartungen erfüllt werden. Unser Ziel ist es, Ihnen eine hochwertige und langfristige Lösung für Ihren Zahnersatz zu bieten.',
        },
      ],
    },
    {
      targetSlug: 'zahnersatz',
      legacyExistingSlug: 'zahnersatz',
      name: 'Kronen und Brückenprothetik',
      category: 'zahnerhalt',
      order: 8,
      imageId: img303542,
      shortDescription:
        'Vollkeramikkronen, Teilkronen, Brücken, Klebebrücken und Inlays in Zusammenarbeit mit unserem Dentallabor.',
      blocks: [
        { type: 'h2', text: 'Kronen und Brückenprothetik' },
        {
          type: 'p',
          text: 'Bei grossflächigen und stark beschädigten Zähnen bieten wir die Möglichkeit, Vollkeramikkronen oder Teilkronen zu verwenden, um den Zahn sowohl funktionell als auch ästhetisch aufzubauen. Diese Kronen helfen dabei, den Zahn langfristig zu stabilisieren und seine Funktion wiederherzustellen.',
        },
        {
          type: 'p',
          text: 'Wenn ein Zahn fehlt, können wir auch eine Brücke verwenden, um den fehlenden Zahn zu ersetzen. Dabei dienen die Nachbarzähne als Brückenpfeiler, um den fehlenden Zahn „schwebend“ zu ersetzen. In Zusammenarbeit mit unserem Dentallabor sind wir in der Lage, verschiedene Arten von Kronen, Brücken, Klebebrücken und Inlays herzustellen.',
        },
        {
          type: 'p',
          text: 'Unser Ziel ist es, Ihnen eine individuelle Lösung anzubieten, die sowohl funktional als auch ästhetisch Ihren Bedürfnissen entspricht.',
        },
      ],
    },
    {
      targetSlug: 'parodontitis-behandlung',
      legacyExistingSlug: 'dentalhygiene',
      name: 'Parodontitis Behandlung',
      category: 'vorsorge',
      order: 9,
      imageId: img303516,
      shortDescription:
        'Systematische Behandlung von Zahnfleischentzündungen und Zahnfleischtaschen zur Stabilisierung des Zahnhalteapparates.',
      blocks: [
        { type: 'h2', text: 'Parodontitis Behandlung' },
        {
          type: 'p',
          text: 'Bei einer Entzündung des Zahnhalteapparates, auch Parodontitis genannt, ist eine Behandlung in mehreren Sitzungen erforderlich. Durch regelmässige umfassende Reinigung der Zahnfleischtaschen mit einem Intervall von 3–4 Monaten oder 6–7 Monaten können subgingivale Konkremente entfernt werden. Die Intervalle werden je nach Zustand des Zahnhalteapparates bestimmt.',
        },
        {
          type: 'p',
          text: 'Je nach Bedarf verwenden wir während der Behandlung eine Lokalanästhesie, um mögliche Schmerzen zu minimieren. In einigen Fällen kann auch die Verwendung von Antibiotika erforderlich sein, um die Entzündung gezielt zu bekämpfen. Unser Ziel ist es, die Entzündung zu stoppen, den Zahnhalteapparat zu stabilisieren und Ihre Mundgesundheit wiederherzustellen.',
        },
      ],
    },
    {
      targetSlug: 'wurzelkanalbehandlungen',
      name: 'Wurzelkanal Behandlungen',
      category: 'zahnerhalt',
      order: 10,
      imageId: img303511,
      shortDescription:
        'Sorgfältige Entfernung entzündeter Zahnnerven und gründliche Reinigung zum nachhaltigen Erhalt des eigenen Zahnes.',
      blocks: [
        { type: 'h2', text: 'Wurzelkanal Behandlungen' },
        {
          type: 'p',
          text: 'Der Zahnnerv wird entfernt, wenn der Zahn stark geschädigt oder gereizt ist und eine irreversible Zahnnervenentzündung vorliegt. Dies geschieht, um den Zahn zu erhalten.',
        },
        {
          type: 'p',
          text: 'Während der Behandlung werden verschiedene Instrumente verwendet, um den Zahnnerv zu entfernen und den Wurzelkanal gründlich zu reinigen. Anschliessend wird der Wurzelkanal mit einem biologisch verträglichen Material gefüllt. Dieser Prozess hilft, Infektionen zu bekämpfen und den Zahn langfristig zu stabilisieren.',
        },
      ],
    },
    {
      targetSlug: 'teil-und-totalprothetik',
      name: 'Teil- und Totalprothetik',
      category: 'zahnerhalt',
      order: 11,
      imageId: img303541,
      shortDescription:
        'Abnehmbare Versorgungen wie Totalprothesen, Teilprothesen, provisorische Prothesen und Druckknopfsysteme.',
      blocks: [
        { type: 'h2', text: 'Teil- und Totalprothetik' },
        {
          type: 'p',
          text: 'Wenn es nicht möglich ist, Zähne zu retten oder festsitzende Versorgungen wie Brücken oder Implantate zu ergänzen, bieten wir verschiedene abnehmbare Lösungen an.',
        },
        {
          type: 'p',
          text: 'Dazu gehören totale Prothesen, Teilprothesen, provisorische Prothesen oder Prothesen mit Druckknopfsystemen.',
        },
      ],
    },
    {
      targetSlug: 'kinderzahnmedizin-und-schulzahnpflege',
      name: 'Kinderzahnmedizin und Schulzahnpflege',
      category: 'vorsorge',
      order: 12,
      imageId: img303394,
      shortDescription:
        'Einfühlsame Kinderzahnmedizin ab 3 Jahren – spielerischer Vertrauensaufbau für angstfreie Zahnarztbesuche.',
      blocks: [
        { type: 'h2', text: 'Kinderzahnmedizin und Schulzahnpflege' },
        {
          type: 'p',
          text: 'Uns ist es wichtig, dass der erste Zahnarztbesuch Ihrem Kind positiv in Erinnerung bleibt. Unser Fachpersonal weiss, wie es auf Kinder zugehen und ihnen die vorhandenen Ängste nehmen kann. Durch spielerische Methoden und altersgerechtes Informationsmaterial bauen wir gezielt Vertrauen auf.',
        },
        {
          type: 'p',
          text: 'Unser Ziel ist es, Kindern und Eltern eine umfassende Beratung und Versorgung in allen Fragen der Kinder- und Jugendzahnheilkunde zu bieten. Wir empfehlen den ersten Zahnarztbesuch ab 3 Jahren.',
        },
      ],
    },
    {
      targetSlug: 'kiefergelenkbeschwerden-knirschen-pressen',
      name: 'Kiefergelenk-beschwerden, Knirschen, Pressen',
      category: 'aesthetik',
      order: 13,
      imageId: img303384,
      shortDescription:
        'Gezielte Schienentherapie und Physiotherapie-Übungen zur Entlastung des Kiefers und Linderung von Schmerzen.',
      blocks: [
        { type: 'h2', text: 'Kiefergelenk-Beschwerden, Knirschen, Pressen' },
        {
          type: 'p',
          text: 'Schmerzen im Kiefergelenkbereich und Kaufunktionsstörungen sind heutzutage häufig anzutreffen. Glücklicherweise können viele Fälle mit vielfältigen Mitteln wie Physiotherapie-Übungen oder einer Schienentherapie erfolgreich behandelt werden.',
        },
        {
          type: 'p',
          text: 'Physiotherapie-Übungen können helfen, die Muskulatur im Kiefergelenkbereich zu stärken und die Beweglichkeit zu verbessern. Eine Schienentherapie trägt dazu bei, den Kiefer zu entlasten und die Symptome zu lindern. Unser Ziel ist es, Ihre Beschwerden nachhaltig zu reduzieren und Ihre Kaufunktion wiederherzustellen.',
        },
      ],
    },
    {
      targetSlug: 'alltaegliche-zahnchirurgie',
      name: 'Alltägliche Zahnchirurgie',
      category: 'zahnerhalt',
      order: 14,
      imageId: img303527,
      shortDescription:
        'Schonende Zahnextraktionen, Wurzelrestentfernungen, Weisheitszähne und Abszesseröffnungen direkt in unserer Praxis.',
      blocks: [
        { type: 'h2', text: 'Alltägliche Zahnchirurgie' },
        {
          type: 'p',
          text: 'Viele kleinere oralchirurgische Eingriffe können direkt bei uns in der Zahnarztpraxis durchgeführt werden. Dazu gehören Zahnextraktionen, Wurzelrestentfernungen, operative Entfernung von retinierten Weisheitszähnen und Abszesseröffnungen.',
        },
        {
          type: 'p',
          text: 'Komplexe oder grössere Fälle werden in enger Abstimmung an einen Oralchirurgen überwiesen.',
        },
      ],
    },
    {
      targetSlug: 'sportmundschutz',
      name: 'Sportmundschutz',
      category: 'vorsorge',
      order: 15,
      imageId: img303305,
      shortDescription:
        'Massgeschneiderte Sportschutzschienen per berührungsfreiem 3D-Scan – zuverlässiger Schutz für Kinder, Jugendliche und Erwachsene.',
      blocks: [
        { type: 'h2', text: 'Sportmundschutz – Zahnschutz für Kinder, Jugendliche und Sportler:innen' },
        {
          type: 'p',
          text: 'Ob beim Fussball, Handball, Boxen, Eishockey oder Schwingen – wo körperlicher Einsatz gefragt ist, kann es leicht zu Stössen oder Zusammenprallen kommen. Dabei sind Zähne und Kiefer besonders gefährdet. Ein individuell angepasster Sportmundschutz schützt zuverlässig vor Zahnverletzungen, Abbrüchen und Kieferbrüchen – und kann sogar helfen, das Risiko einer Gehirnerschütterung zu verringern.',
        },
        { type: 'h3', text: 'Massgeschneidert – sicher, leicht und angenehm' },
        {
          type: 'p',
          text: 'Damit ein Mundschutz wirklich schützt, muss er perfekt passen. Wir fertigen jede Schiene individuell an: Zuerst erstellen wir einen präzisen 3D-Scan des Gebisses – schnell, berührungsfrei und ohne Abdruckmasse. Auf dieser Grundlage entsteht eine passgenaue Sportschutzschiene aus hautfreundlichem Kunststoff, die angenehm zu tragen und trotzdem äusserst stabil ist.',
        },
      ],
    },
    {
      targetSlug: 'mobile-zahnarzteinheit',
      name: 'Mobile Zahnarzteinheit',
      category: 'vorsorge',
      order: 16,
      imageId: img303287,
      shortDescription:
        'Persönliche zahnärztliche Betreuung direkt zu Hause sowie in Alters- und Pflegeheimen mit vollständiger mobiler Ausrüstung.',
      blocks: [
        { type: 'h2', text: 'Mobile Zahnarzteinheit' },
        {
          type: 'p',
          text: 'Damit wir unsere immobilen Patientinnen und Patienten auch zu Hause sowie in Alters- und Pflegeheimen behandeln können, besitzen wir eine mobile zahnärztliche Einheit. Voraussetzung ist eine detaillierte Beschreibung der dentalen Probleme mit einer genauen Medikamentenliste.',
        },
        {
          type: 'p',
          text: 'Gerade Senioren, Personen mit Beeinträchtigung und Angstpatienten unterstützen wir gerne und behandeln sie in Ihrer gewohnten Umgebung zu Hause. Wir bringen die gesamte Ausstattung und unser Material mit. Rufen Sie uns an unter +41 71 787 82 82 – wir beraten Sie gerne.',
        },
      ],
    },
    {
      targetSlug: 'notfallbehandlung',
      legacyExistingSlug: 'notfallbehandlung',
      name: 'Notfall',
      category: 'notfall',
      order: 17,
      imageId: img303527,
      shortDescription:
        'Tägliche Notfallzeiten bei akuten Zahnschmerzen oder Zahnunfällen – in der Regel noch am selben Tag.',
      blocks: [
        { type: 'h2', text: 'Notfall! Zahnschmerzen oder Zahnunfall? Wir sind für Sie da.' },
        {
          type: 'p',
          text: 'Zahnschmerzen oder ein Zahnunfall kommen oft ganz plötzlich – und meist genau dann, wenn man sie am wenigsten gebrauchen kann. Bitte seien Sie unbesorgt: Wir lassen Sie damit nicht allein. Unser Team ist für Sie da, wenn es schnell gehen muss.',
        },
        {
          type: 'p',
          text: 'Während unserer Öffnungszeiten halten wir täglich Notfallzeiten frei. So können wir Patientinnen und Patienten mit akuten Beschwerden rasch und einfühlsam behandeln – in der Regel noch am selben Tag.',
        },
        { type: 'h3', text: 'Was tun im Notfall?' },
        {
          type: 'ul',
          items: [
            'Während den Öffnungszeiten: Bitte rufen Sie uns an unter +41 71 787 82 82.',
            'Ausserhalb der Öffnungszeiten – Kanton Appenzell AR/AI: 0844 144 006',
            'Ausserhalb der Öffnungszeiten – Region Rheintal: 0844 144 002',
          ],
        },
        {
          type: 'p',
          text: 'Bei einem Zahnunfall zählt jede Minute: Bitte melden Sie sich sofort bei Ihrer Zahnärztin oder Ihrem Zahnarzt und folgen Sie den Anweisungen auf dem SSO-Merkblatt zum Zahnunfall.',
        },
      ],
    },
  ]

  const existingServices = await payload.find({
    collection: 'services',
    limit: 100,
    draft: true,
    overrideAccess: true,
  })

  const serviceImageSpecs: Record<string, { file: string; alt: string }> = {
    prophylaxe: {
      file: 'service-prophylaxe.jpg',
      alt: 'Prophylaxe-Instrumente und Air-Polishing-Handstück auf Alabasterstein',
    },
    'zirkonoxid-kronen': {
      file: 'service-zirkonoxid-kronen.jpg',
      alt: 'Hochwertige Zirkonoxid-Zahnkrone im digitalen Praxislabor',
    },
    'digitale-zahnabdruecke': {
      file: 'service-digitale-zahnabdruecke.jpg',
      alt: 'Kabelloser 3D-Intraoralscanner für digitale Zahnabdrücke',
    },
    zahnfuellungen: {
      file: 'service-zahnfuellungen.jpg',
      alt: 'Konservierende Zahnheilkunde: Komposit-Instrumente und Keramik-Inlay',
    },
    'aesthetische-zahnmedizin': {
      file: 'service-aesthetische-zahnmedizin.jpg',
      alt: 'Hauchdünne Keramik-Veneers und Farbskala für ästhetische Zahnmedizin',
    },
    kieferorthopaedie: {
      file: 'service-aligner-behandlung.jpg',
      alt: 'Transparente Aligner-Zahnschiene auf mattiertem Glas',
    },
    zahnimplantate: {
      file: 'service-implantologie.jpg',
      alt: 'Präzisions-Zahnimplantat aus Titan mit Keramikkrone',
    },
    zahnersatz: {
      file: 'service-kronen-bruecken.jpg',
      alt: 'Vollkeramische Krone und Brücke auf Präzisionsmodell',
    },
    'parodontitis-behandlung': {
      file: 'service-parodontitis.jpg',
      alt: 'Ultraschall-Instrument für schonende Parodontitis-Behandlung',
    },
    wurzelkanalbehandlungen: {
      file: 'service-wurzelkanal.jpg',
      alt: 'Mikroskopische Lupenbrille und feine Instrumente für Wurzelkanalbehandlungen',
    },
    'teil-und-totalprothetik': {
      file: 'service-prothetik.jpg',
      alt: 'Präzise gefertigter abnehmbarer Zahnersatz auf Keramikschale',
    },
    'kinderzahnmedizin-und-schulzahnpflege': {
      file: 'service-kinderzahnmedizin.jpg',
      alt: 'Kindgerechte Zahnbürste und Zahnmodell in heller Kinderzahnmedizin-Praxis',
    },
    'kiefergelenkbeschwerden-knirschen-pressen': {
      file: 'service-kiefergelenk.jpg',
      alt: 'Entspannungs-Aufbissschiene bei Kiefergelenkbeschwerden und Knirschen',
    },
    'alltaegliche-zahnchirurgie': {
      file: 'service-zahnchirurgie.jpg',
      alt: 'Steriles chirurgisches Instrumentarium für alltägliche Zahnchirurgie',
    },
    sportmundschutz: {
      file: 'service-sportmundschutz.jpg',
      alt: 'Individuell angepasster Sportmundschutz für Kinder, Jugendliche und Erwachsene',
    },
    'mobile-zahnarzteinheit': {
      file: 'service-mobile-zahnarzteinheit.jpg',
      alt: 'Kompakte mobile Zahnarzteinheit für Haus- und Pflegeheimbesuche',
    },
    notfallbehandlung: {
      file: 'service-notfallbehandlung.jpg',
      alt: 'Helles Behandlungszimmer für rasche zahnärztliche Notfallhilfe',
    },
  }

  for (const spec of legacyServices) {
    const existing = existingServices.docs.find(
      (s) => s.slug === spec.targetSlug || (spec.legacyExistingSlug && s.slug === spec.legacyExistingSlug),
    )
    const imgSpec = serviceImageSpecs[spec.targetSlug]
    const bespokeImgId = imgSpec
      ? await ensureLocalServiceMedia(payload, imgSpec.file, imgSpec.alt)
      : null

    const serviceData = {
      name: spec.name,
      slug: spec.targetSlug,
      shortDescription: spec.shortDescription,
      detailedDescription: makeRichText(spec.blocks),
      category: spec.category,
      displayOrder: spec.order,
      featuredImage: bespokeImgId ?? spec.imageId ?? undefined,
      locations: [locationId],
      _status: 'published',
    } as any

    if (existing) {
      await payload.update({
        collection: 'services',
        id: existing.id,
        locale: 'de',
        overrideAccess: true,
        data: serviceData,
      })
    } else {
      await payload.create({
        collection: 'services',
        locale: 'de',
        overrideAccess: true,
        data: serviceData,
      })
    }
  }
  console.log('Seeded all 17 Fachbereiche into Services collection.')

  // 8. Seed Full Team Members (Leadership + Staff + Biographies)
  const gishaBio = makeRichText([
    {
      type: 'p',
      text: 'Ich, Gisha Palatty, bin eidgenössisch diplomierte Zahnärztin und absolvierte meinen Bachelor- sowie Masterstudiengang am Universitären Zentrum für Zahnmedizin Basel.',
    },
    {
      type: 'p',
      text: 'Mit indischen Wurzeln wurde ich im Kanton Nidwalden geboren und bin in den beiden Halbkantonen Basel-Stadt und Basel-Landschaft aufgewachsen.',
    },
    {
      type: 'p',
      text: 'Für mich steht der Mensch im Mittelpunkt, und ich bin davon überzeugt, dass jeder Mensch Zugang zu einer hochwertigen zahnmedizinischen Versorgung verdient. Deshalb lege ich grossen Wert darauf, meine Praxis, mein Team und auch mich selbst stets auf dem neuesten Stand der Zahnmedizin zu halten.',
    },
    {
      type: 'p',
      text: 'Durch regelmässige Weiterbildungen und moderne Behandlungsmethoden möchte ich meinen Patientinnen und Patienten die bestmögliche Betreuung bieten.',
    },
    {
      type: 'quote',
      text: '„Jeder Patient und jeder Zahn ist es wert, die bestmögliche Behandlung zu erhalten“',
    },
  ])

  const christinaBio = makeRichText([
    {
      type: 'p',
      text: 'Ich, Christina Poput, absolvierte mein Zahnmedizinstudium an der Universität Hamburg und stamme aus einer zahnärztlichen Familie. Meine Leidenschaft für die Zahnmedizin wurde mir bereits in jungen Jahren vermittelt und begleitet mich bis heute in meinem beruflichen Alltag.',
    },
    {
      type: 'p',
      text: 'Mit über 35 Jahren Berufserfahrung verfüge ich über ein breites Fachwissen und eine fundierte Expertise in den verschiedensten Bereichen der Zahnmedizin. Dabei verbinde ich langjährige Erfahrung und bewährte Werte mit modernen Behandlungsmethoden. Regelmässige Weiterbildungen sind für mich selbstverständlich, um meinen Patientinnen und Patienten stets eine zeitgemässe und qualitativ hochwertige Behandlung anbieten zu können.',
    },
    {
      type: 'p',
      text: 'Besonders wichtig sind mir eine persönliche Betreuung, eine vertrauensvolle Atmosphäre und die individuelle Beratung meiner Patientinnen und Patienten. Mit viel Engagement, Präzision und Einfühlungsvermögen setze ich mich täglich dafür ein, die bestmögliche zahnmedizinische Versorgung zu gewährleisten.',
    },
    {
      type: 'quote',
      text: '„Mit Erfahrung, Vertrauen und Sorgfalt für Ihre Zahngesundheit.“',
    },
  ])

  const legacyTeam: Array<{
    matchNames: string[]
    fullName: string
    professionalTitle?: string
    position: string
    photoId: number | null
    displayOrder: number
    biography?: ReturnType<typeof makeRichText>
  }> = [
    {
      matchNames: ['Gisha Palatty', 'Med. Dent Gisha Palatty'],
      fullName: 'Med. Dent Gisha Palatty',
      professionalTitle: 'Eidg. dipl. Zahnärztin',
      position: 'Inhaberin',
      photoId: gishaPhotoId,
      displayOrder: 10,
      biography: gishaBio,
    },
    {
      matchNames: [
        'Christina Milera Poput',
        'Christina Mirela Poput',
        'Poput Christina Mirela',
        'Dr. med. dent. Christina Mirela Poput',
      ],
      fullName: 'Christina Mirela Poput',
      professionalTitle: 'Dr. med. dent.',
      position: 'Zahnärztin',
      photoId: christinaPhotoId,
      displayOrder: 20,
      biography: christinaBio,
    },
    {
      matchNames: ['Jeanine Weishaupt'],
      fullName: 'Jeanine Weishaupt',
      position: 'Praxismanagerin, Prophylaxeassistentin & Dentalassistentin EFZ',
      photoId: jeaninePhotoId,
      displayOrder: 30,
    },
    {
      matchNames: ['Belma Music'],
      fullName: 'Belma Music',
      position: 'Prophylaxeassistentin & Dentalassistentin EFZ',
      photoId: belmaPhotoId,
      displayOrder: 40,
    },
    {
      matchNames: ['Riana Sutter'],
      fullName: 'Riana Sutter',
      position: 'Dentalassistentin EFZ in Ausbildung',
      photoId: rianaPhotoId,
      displayOrder: 50,
    },
    {
      matchNames: ['Dalina Jahiu'],
      fullName: 'Dalina Jahiu',
      position: 'Praxisteam Appenzell',
      photoId: dalinaPhotoId,
      displayOrder: 60,
    },
    {
      matchNames: ['Judith Dörig'],
      fullName: 'Judith Dörig',
      position: 'Dentalassistentin EFZ in Ausbildung',
      photoId: null,
      displayOrder: 70,
    },
    {
      matchNames: ['Antonio Elenjikkal'],
      fullName: 'Antonio Elenjikkal',
      position: 'CEO und Inhaber',
      photoId: antonioPhotoId,
      displayOrder: 80,
    },
  ]

  const existingTeam = await payload.find({
    collection: 'team-members',
    limit: 100,
    overrideAccess: true,
  })
  for (const person of legacyTeam) {
    const existing = existingTeam.docs.find((t) =>
      person.matchNames.some((n) => n.toLowerCase() === (t.fullName || '').toLowerCase()),
    )
    const data: Record<string, any> = {
      fullName: person.fullName,
      professionalTitle: person.professionalTitle ?? null,
      position: person.position,
      displayOrder: person.displayOrder,
      locations: [locationId],
      active: true,
    }
    if (person.photoId) data.photo = person.photoId
    if (person.biography) data.biography = person.biography

    if (existing) {
      await payload.update({
        collection: 'team-members',
        id: existing.id,
        locale: 'de',
        overrideAccess: true,
        data,
      })
    } else {
      await payload.create({
        collection: 'team-members',
        locale: 'de',
        overrideAccess: true,
        data: data as any,
      })
    }
  }
  console.log('Seeded full TeamMembers with titles, roles & biographies.')

  // 9. Update All 7 CMS Pages (`jobs`, `notfall`, `team`, `leistungen`, `kontakt`, `impressum`, `datenschutz`)
  const existingPages = await payload.find({
    collection: 'pages',
    where: { location: { equals: locationId } },
    limit: 50,
    draft: true,
    overrideAccess: true,
  })

  const pageUpdates: Array<{
    slug: string
    title: string
    metaTitle: string
    metaDescription: string
    featuredImage?: number | null
    layout: any[]
  }> = [
    {
      slug: 'jobs',
      title: 'Offene Stellen',
      metaTitle: 'Jobs & Karriere | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Offene Stelle: Zahnärztin / Zahnarzt (60–80 %) – Gais (AR) & Appenzell (AI) bei der Zahnarztpraxis Palatty.',
      featuredImage: heroJobsId ?? img303287,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Offene Stellen',
          heading: 'Zahnärztin / Zahnarzt (60–80 %)',
          titleHighlight: 'Gais (AR) & Appenzell (AI)',
          subheading:
            'Wir sind eine moderne Schweizer Dorfzahnarztpraxis mit Herz und einem jungen, motivierten Team.',
          image: heroJobsId ?? img303287 ?? undefined,
        },
        {
          blockType: 'richText',
          eyebrow: 'Stellenausschreibung',
          appearance: 'bento-sections',
          content: makeRichText([
            { type: 'h2', text: 'Zahnärztin / Zahnarzt (60–80 %) – Gais (AR) & Appenzell (AI)' },
            {
              type: 'p',
              text: 'Wir sind eine moderne Schweizer Dorfzahnarztpraxis mit Herz und einem jungen, motivierten Team. Mit zwei modernen Praxen – einer in Gais (Appenzell Ausserrhoden) und einer in Appenzell (Appenzell Innerrhoden) – bieten wir moderne allgemeine Zahnmedizin für Patientinnen und Patienten jeden Alters an. Die mobile Zahnmedizin ergänzt unser Angebot. Persönliche Betreuung, Vertrauen und eine hochwertige zahnmedizinische Versorgung stehen bei uns an erster Stelle.',
            },
            {
              type: 'p',
              text: 'Zur Verstärkung unseres Teams suchen wir per sofort oder nach Vereinbarung eine engagierte Zahnärztin oder einen engagierten Zahnarzt (60–80 %).',
            },
            { type: 'h3', text: 'Ihr Profil' },
            {
              type: 'ul',
              items: [
                'Abgeschlossenes Studium der Zahnmedizin (Schweizer Studienabschluss bevorzugt)',
                'Alternativ ein in der Schweiz anerkannter zahnärztlicher Abschluss',
                'Mindestens 2–3 Jahre Berufserfahrung in der allgemeinen Zahnmedizin',
                'Erfahrung mit dem Schweizer Dentotar®-Tarif von Vorteil',
                'Sehr gute Deutschkenntnisse in Wort und Schrift (zwingend erforderlich)',
                'Selbstständige, verantwortungsbewusste und patientenorientierte Arbeitsweise',
                'Freude an der Zusammenarbeit in einem jungen Team',
              ],
            },
            { type: 'h3', text: 'Ihre Aufgaben' },
            {
              type: 'ul',
              items: [
                'Selbstständige Durchführung allgemeinzahnmedizinischer Behandlungen',
                'Umfassende Beratung und Betreuung unserer Patientinnen und Patienten',
                'Erstellung individueller Behandlungspläne',
                'Mitarbeit in der mobilen Zahnmedizin',
                'Zusammenarbeit mit unserem motivierten Praxisteam',
              ],
            },
            { type: 'h3', text: 'Wir bieten' },
            {
              type: 'ul',
              items: [
                'Fixlohn nach den SSO-Richtlinien',
                'Feste und planbare Arbeitszeiten',
                'Nur zwei Samstage pro Monat',
                'Moderne, digital ausgestattete Praxen',
                'Ein junges, motiviertes und wertschätzendes Team',
              ],
            },
            { type: 'h3', text: 'Hinweis zur Bewerbung' },
            {
              type: 'p',
              text: 'Bitte beachten Sie: Wir können ausschliesslich Bewerbungen von Zahnärztinnen und Zahnärzten mit einem Schweizer Studienabschluss oder einem in der Schweiz anerkannten zahnärztlichen Abschluss berücksichtigen.',
            },
          ]),
        },
        {
          blockType: 'callToAction',
          eyebrow: 'Bewerbung',
          heading: 'Haben wir Ihr Interesse geweckt?',
          text: 'Wenn Sie sich in einem engagierten Team einbringen möchten und die beschriebenen Anforderungen erfüllen, freuen wir uns auf Ihre Bewerbung an gisha@zahnarzt-palatty.ch.',
          image: sectionTerminId ?? img303475 ?? undefined,
          cta: {
            label: 'Bewerbung an gisha@zahnarzt-palatty.ch',
            type: 'external',
            url: 'mailto:gisha@zahnarzt-palatty.ch?subject=Bewerbung%20Zahn%C3%A4rztin%20%2F%20Zahnarzt',
            newTab: false,
          },
        },
      ],
    },
    {
      slug: 'notfall',
      title: 'Notfall',
      metaTitle: 'Notfall | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Zahnschmerzen oder Zahnunfall? Tägliche Notfallzeiten während den Öffnungszeiten und regionale Notfalldienstnummern (Appenzell AR/AI & Rheintal).',
      featuredImage: heroNotfallId ?? img303527,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Notfall!',
          heading: 'Zahnschmerzen oder Zahnunfall?',
          titleHighlight: 'Wir sind für Sie da.',
          subheading:
            'Während unserer Öffnungszeiten halten wir täglich Notfallzeiten frei – in der Regel behandeln wir Sie noch am selben Tag.',
          image: heroNotfallId ?? img303527 ?? undefined,
        },
        {
          blockType: 'richText',
          eyebrow: 'Notfall-Leitfaden',
          appearance: 'urgent-split',
          content: makeRichText([
            { type: 'h2', text: 'Notfall! Zahnschmerzen oder Zahnunfall? Wir sind für Sie da.' },
            {
              type: 'p',
              text: 'Zahnschmerzen oder ein Zahnunfall kommen oft ganz plötzlich – und meist genau dann, wenn man sie am wenigsten gebrauchen kann. Bitte seien Sie unbesorgt: Wir lassen Sie damit nicht allein. Unser Team ist für Sie da, wenn es schnell gehen muss.',
            },
            {
              type: 'p',
              text: 'Während unserer Öffnungszeiten halten wir täglich Notfallzeiten frei. So können wir Patientinnen und Patienten mit akuten Beschwerden rasch und einfühlsam behandeln – in der Regel noch am selben Tag.',
            },
            { type: 'h3', text: 'Was tun im Notfall?' },
            {
              type: 'ul',
              items: [
                'Während den Öffnungszeiten: Bitte rufen Sie uns an unter +41 71 787 82 82, damit wir Ihnen so schnell wie möglich helfen können.',
                'Ausserhalb der Öffnungszeiten – Kanton Appenzell AR/AI: 0844 144 006',
                'Ausserhalb der Öffnungszeiten – Region Rheintal: 0844 144 002',
              ],
            },
            { type: 'h3', text: 'Zahnunfall – was jetzt wichtig ist' },
            {
              type: 'p',
              text: 'Ein Zahnunfall kann schnell passieren – etwa beim Sport oder Spielen. In solchen Momenten zählt jede Minute. Bitte melden Sie sich sofort bei Ihrer Zahnärztin oder Ihrem Zahnarzt und folgen Sie den Anweisungen auf dem Merkblatt zum Zahnunfall. So erhöhen Sie die Chance, den Zahn zu erhalten und Folgeschäden zu vermeiden.',
            },
          ]),
        },
        {
          blockType: 'locationInformation',
          heading: 'Direktkontakt & Notfalldienst',
          showAddress: true,
          showContact: true,
          showOpeningHours: true,
          showEmergencyInfo: true,
        },
      ],
    },
    {
      slug: 'team',
      title: 'Unser Team',
      metaTitle: 'Unser Team | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Lernen Sie unser Team rund um Med. Dent. Gisha Palatty und Dr. med. dent. Christina Mirela Poput in Appenzell kennen.',
      featuredImage: img303287,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Team',
          heading: 'Unser Team',
          titleHighlight: 'für Ihr Lächeln.',
          subheading:
            '«Wir freuen uns Sie in unserer Praxis begrüssen zu dürfen.»',
          image: img303287 ?? undefined,
        },
        {
          blockType: 'teamOverview',
          eyebrow: 'Praxisteam Appenzell',
          heading: 'Menschen mit Herz und Kompetenz',
          intro:
            'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch bei uns professionell, persönlich und angenehm ist.',
          defaultRoleLabel: 'Praxisteam Appenzell',
          showBiographies: true,
        },
      ],
    },
    {
      slug: 'leistungen',
      title: 'Unser Angebot',
      metaTitle: 'Unser Angebot & Fachbereiche | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Alle 17 Fachbereiche moderner Zahnmedizin bei Zahnarztpraxis Palatty Appenzell – von Prophylaxe und 3Shape Scan bis Zirkonoxid-Kronen und mobiler Zahnmedizin.',
      featuredImage: heroLeistungenId ?? img303511,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Unser Angebot',
          heading: 'Moderne Zahnmedizin',
          titleHighlight: 'persönlich betreut.',
          subheading:
            'Bei uns stehen Sie und Ihre Zahngesundheit im Mittelpunkt – mit dem Ziel, Ihr Lächeln langfristig zu erhalten.',
          image: heroLeistungenId ?? img303511 ?? undefined,
        },
        {
          blockType: 'servicesOverview',
          eyebrow: 'Unsere Fachbereiche',
          heading: 'Umfassende Zahnmedizin',
          headingHighlight: 'in Appenzell.',
          intro:
            'Wir bieten Ihnen ein umfassendes Spektrum moderner Zahnmedizin – individuell abgestimmt, persönlich betreut und auf dem neuesten Stand der Technik.',
          cardLinkLabel: 'Mehr erfahren',
          journeyEyebrow: 'Kosten & Beratung',
          journeyHeading: 'Klarheit von Anfang an',
          journeyHighlight: 'DENTOTAR® Taxpunkt 1.10.',
          journeyDescription:
            'Wir halten uns an die SSO-Richtlinien und informieren Sie nach der Untersuchung transparent über Befund, Behandlungsvarianten und schriftlichen Kostenvoranschlag.',
          journeySteps: [
            {
              step: '01',
              title: 'Untersuchung & Befund',
              description:
                'Ausführliche Diagnostik – auf Wunsch berührungsfrei digital erfasst mit 3Shape TRIOS 5.',
              icon: 'chat',
            },
            {
              step: '02',
              title: 'Individueller Kostenvoranschlag',
              description:
                'Klare Darstellung möglicher Behandlungsvarianten nach SSO / DENTOTAR® (Taxpunkt 1.10).',
              icon: 'compass',
            },
            {
              step: '03',
              title: 'Schonende Behandlung & Nachsorge',
              description:
                'Präzise Umsetzung in unserer Praxis oder über unsere mobile Zahnarzteinheit vor Ort.',
              icon: 'shield',
            },
          ],
          ctaEyebrow: 'Termine',
          ctaHeading: 'Online Terminbuchung',
          ctaHighlight: 'oder persönlich am Telefon.',
          ctaDescription:
            'Nutzen Sie bequem unsere Online Terminbuchung über Denteo oder rufen Sie uns unter +41 71 787 82 82 an.',
          ctaButtonLabel: 'Online Terminbuchung',
          ctaButtonHref:
            'https://booking.denteo.com/de/727dc64f0602c327ce8d1c73b219bd1264e88aeaacca5c855812176dafa638da/locations/2',
          ctaImage: sectionTerminId ?? img303475 ?? undefined,
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt Informationen',
      metaTitle: 'Kontakt & Termine | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Kontakt, Öffnungszeiten, HIN-Adresse und Online Terminbuchung der Zahnarztpraxis Palatty Appenzell AG an der Zielstrasse 14B.',
      featuredImage: heroKontaktId ?? img303475,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Kontakt Informationen',
          heading: 'Kontakt &',
          titleHighlight: 'Termine.',
          subheading:
            'Nutzen Sie die Online Terminbuchung, rufen Sie uns an, schreiben Sie per E-Mail oder nutzen Sie unser Kontaktformular. Wir freuen uns auf Sie!',
          image: heroKontaktId ?? img303475 ?? undefined,
        },
        {
          blockType: 'contact',
          heading: 'Schreiben Sie uns',
          showContactForm: true,
          showBookingLink: true,
        },
        {
          blockType: 'locationInformation',
          heading: 'Zahnarztpraxis Palatty Appenzell',
          showAddress: true,
          showContact: true,
          showOpeningHours: true,
          showEmergencyInfo: true,
        },
      ],
    },
    {
      slug: 'impressum',
      title: 'Impressum',
      metaTitle: 'Impressum | Zahnarztpraxis Palatty Appenzell',
      metaDescription: 'Impressum und Urheberrecht der Zahnarztpraxis Palatty Appenzell AG.',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Rechtliches',
          heading: 'Impressum',
          subheading: 'Zahnarztpraxis Palatty Appenzell AG · Zielstrasse 14B · 9050 Appenzell.',
          hideDefaultActions: true,
        },
        {
          blockType: 'richText',
          eyebrow: 'Impressum',
          appearance: 'editorial-card',
          sidebarTitle: 'Zahnarztpraxis Palatty Appenzell AG',
          sidebarText:
            'Gesetzliche Anbieterkennzeichnung und urheberrechtliche Hinweise für zahnarztpraxis-palatty.ch.',
          content: makeRichText([
            { type: 'h2', text: 'Zahnarztpraxis Palatty Appenzell AG' },
            {
              type: 'p',
              text: 'Zielstrasse 14B, 9050 Appenzell, Schweiz · Tel.: +41 71 787 82 82 · E-Mail: praxis@zahnarztpraxis-palatty.ch · HIN: zahnarztpraxispalattyai@hin.ch · Web: https://zahnarztpraxis-palatty.ch',
            },
            { type: 'h2', text: 'Urheberrecht' },
            {
              type: 'p',
              text: '© Gisha Palatty, Zielstrasse 14B, 9050 Appenzell. Alle Rechte vorbehalten.',
            },
            {
              type: 'p',
              text: 'Falls nicht anders angegeben, unterliegen alle Seiten dieser Website dem Urheberrecht (Copyright). Dies gilt insbesondere für Texte, Bilder, Grafiken, Ton-, Video- oder Animationsdateien einschliesslich deren Anordnung auf den Web-Seiten. Eine Vervielfältigung oder Verwendung solcher Seiten (oder Teilen davon) in anderen elektronischen oder gedruckten Publikationen und deren Veröffentlichung (auch im Internet) ist nur nach vorheriger Genehmigung gestattet.',
            },
          ]),
        },
      ],
    },
    {
      slug: 'datenschutz',
      title: 'Datenschutzerklärung',
      metaTitle: 'Datenschutzerklärung | Zahnarztpraxis Palatty Appenzell',
      metaDescription:
        'Datenschutzerklärung der Zahnarztpraxis Palatty Appenzell AG – Umgang mit Personendaten, Cookies, Kontaktformular und Google Maps.',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Rechtliches',
          heading: 'Datenschutzerklärung',
          subheading:
            'Informationen zur Erfassung und Bearbeitung von Personendaten bei Ihrem Besuch auf unserer Website.',
          hideDefaultActions: true,
        },
        {
          blockType: 'richText',
          eyebrow: 'Datenschutz (nDSG / DSG)',
          appearance: 'editorial-card',
          sidebarTitle: 'Inhaltsübersicht',
          sidebarText:
            'Transparenz über den vertraulichen Umgang mit Ihren Daten in unserer Zahnarztpraxis.',
          content: makeRichText([
            { type: 'h2', text: 'Verantwortliche Stelle' },
            {
              type: 'p',
              text: 'Zahnarztpraxis Palatty Appenzell AG, Zielstrasse 14B, 9050 Appenzell, Schweiz. Telefon: +41 71 787 82 82, E-Mail: praxis@zahnarztpraxis-palatty.ch.',
            },
            { type: 'h2', text: 'Datenerfassung auf unserer Website — Cookies' },
            {
              type: 'p',
              text: 'Unsere Internetseiten verwenden teilweise sogenannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Die meisten verwendeten Cookies sind sogenannte «Session-Cookies», die nach Ende Ihres Besuchs automatisch gelöscht werden.',
            },
            {
              type: 'p',
              text: 'Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschliessen sowie das automatische Löschen beim Schliessen des Browsers aktivieren.',
            },
            { type: 'h2', text: 'Server-Log-Dateien' },
            {
              type: 'p',
              text: 'Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.',
            },
            { type: 'h2', text: 'Kontaktformular' },
            {
              type: 'p',
              text: 'Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
            },
            { type: 'h2', text: 'Google Maps' },
            {
              type: 'p',
              text: 'Zur leichten Auffindbarkeit unseres Standortes in Appenzell verweisen wir auf Google Maps (Google Ireland / Google Inc.). Bei Aufruf externer Routenplaner-Links gelten die Datenschutzbestimmungen von Google.',
            },
          ]),
        },
      ],
    },
  ]

  for (const pSpec of pageUpdates) {
    const existing = existingPages.docs.find((p) => p.slug === pSpec.slug)
    const data: Record<string, any> = {
      title: pSpec.title,
      slug: pSpec.slug,
      location: locationId,
      pageType: 'standard',
      layout: pSpec.layout,
      meta: {
        title: pSpec.metaTitle,
        description: pSpec.metaDescription,
      },
      _status: 'published',
    }
    if (pSpec.featuredImage) {
      data.featuredImage = pSpec.featuredImage
    }
    if (existing) {
      await payload.update({
        collection: 'pages',
        id: existing.id,
        locale: 'de',
        overrideAccess: true,
        data,
      })
    } else {
      await payload.create({
        collection: 'pages',
        locale: 'de',
        overrideAccess: true,
        data: data as any,
      })
    }
  }
  console.log('Updated all 7 CMS Pages cleanly from legacy site.')
  console.log('SEED_LEGACY_WEBSITE_CONTENT_COMPLETE')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
