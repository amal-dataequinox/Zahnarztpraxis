import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

const lexicalContent = (sections: Array<{ heading?: string; text: string }>) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: sections.flatMap((section) => {
      const nodes: { type: string; version: number; [k: string]: unknown }[] = []
      if (section.heading) {
        nodes.push({
          type: 'heading',
          tag: 'h2',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              text: section.heading,
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
        })
      }
      nodes.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text: section.text,
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      })
      return nodes
    }),
  },
})

async function run() {
  const payload = await getPayload({ config })

  const locations = await payload.find({
    collection: 'locations',
    limit: 1,
    where: { active: { equals: true } },
  })
  const locationId = locations.docs[0]?.id

  const pagesToSeed = [
    {
      title: 'Leistungen',
      slug: 'leistungen',
      pageType: 'standard' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Leistungen',
          subheading:
            'Unser umfassendes Behandlungsangebot für Ihre Zahngesundheit und Ihr Wohlbefinden.',
        },
        {
          blockType: 'servicesOverview' as const,
          heading: 'Unsere Behandlungen',
          intro: 'Wir begleiten Sie mit moderner Zahnmedizin und individueller Betreuung.',
        },
      ],
    },
    {
      title: 'Team',
      slug: 'team',
      pageType: 'standard' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Team',
          subheading:
            'Lernen Sie die Menschen kennen, die sich täglich mit Fachkompetenz und Feingefühl um Ihre Zahngesundheit kümmern.',
        },
        {
          blockType: 'teamOverview' as const,
          heading: 'Unsere Mitarbeitenden',
          intro: 'Ein motiviertes und eingespieltes Team steht Ihnen in Appenzell zur Seite.',
        },
      ],
    },
    {
      title: 'Kontakt',
      slug: 'kontakt',
      pageType: 'contact' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Kontakt',
          subheading:
            'Vereinbaren Sie Ihren Termin telefonisch, per E-Mail oder direkt über unser Kontaktformular.',
        },
        {
          blockType: 'contact' as const,
          heading: 'Schreiben Sie uns',
          showContactForm: true,
          showBookingLink: true,
        },
        {
          blockType: 'locationInformation' as const,
          heading: 'Anfahrt & Zeiten',
          showAddress: true,
          showOpeningHours: true,
          showContact: true,
          showMap: true,
          showEmergencyInfo: true,
        },
      ],
    },
    {
      title: 'Notfall',
      slug: 'notfall',
      pageType: 'standard' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Notfall',
          subheading:
            'Schnelle Hilfe bei akuten Zahnschmerzen oder Zahnunfällen.',
        },
        {
          blockType: 'richText' as const,
          content: lexicalContent([
            {
              heading: 'Während unseren Öffnungszeiten',
              text: 'Bitte rufen Sie uns bei akuten Beschwerden möglichst frühzeitig an, damit wir am selben Tag ein Zeitfenster für Sie reservieren können.',
            },
            {
              heading: 'Regionaler zahnärztlicher Notfalldienst',
              text: 'Ausserhalb unserer regulären Praxiszeiten sowie an Wochenenden und Feiertagen erreichen Sie den regionalen zahnärztlichen Notfalldienst unter Telefon 0844 144 006.',
            },
          ]),
        },
        {
          blockType: 'locationInformation' as const,
          heading: 'Praxiskontakt & Öffnungszeiten',
          showAddress: true,
          showOpeningHours: true,
          showContact: true,
          showMap: false,
          showEmergencyInfo: true,
        },
      ],
    },
    {
      title: 'Jobs & Karriere',
      slug: 'jobs',
      pageType: 'standard' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Jobs & Karriere',
          subheading:
            'Verstärken Sie unser engagiertes Praxisteam im Herzen von Appenzell.',
        },
        {
          blockType: 'richText' as const,
          content: lexicalContent([
            {
              heading: 'Arbeiten bei der Zahnarztpraxis Palatty',
              text: 'Wir legen grossen Wert auf ein herzliches Arbeitsklima, moderne Arbeitsmittel und kontinuierliche Weiterbildung. Auch wenn aktuell keine spezifische Stelle ausgeschrieben ist, freuen wir uns über Ihre Spontanbewerbung.',
            },
          ]),
        },
        {
          blockType: 'callToAction' as const,
          heading: 'Spontanbewerbung senden',
          text: 'Senden Sie uns Ihre Unterlagen gerne per E-Mail oder rufen Sie uns für ein unverbindliches Gespräch an.',
        },
      ],
    },
    {
      title: 'Impressum',
      slug: 'impressum',
      pageType: 'legal' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Impressum',
          subheading: 'Gesetzliche Angaben gemäss schweizerischem Recht.',
        },
        {
          blockType: 'richText' as const,
          content: lexicalContent([
            {
              heading: 'Betreiberin der Website',
              text: 'Zahnarztpraxis Palatty AG · Zielstrasse 14B · 9050 Appenzell · Schweiz. Telefon: +41 71 787 82 82 · E-Mail: praxis@zahnarztpraxis-palatty.ch',
            },
            {
              heading: 'Haftungsausschluss & Urheberrecht',
              text: 'Alle Inhalte dieser Website dienen der allgemeinen Information und ersetzen keine persönliche zahnärztliche Beratung. Sämtliche Texte, Bilder und Gestaltungselemente sind urheberrechtlich geschützt.',
            },
          ]),
        },
      ],
    },
    {
      title: 'Datenschutz',
      slug: 'datenschutz',
      pageType: 'legal' as const,
      layout: [
        {
          blockType: 'hero' as const,
          heading: 'Datenschutz',
          subheading: 'Informationen zur Bearbeitung von Personendaten nach schweizerischem Datenschutzrecht (nDSG).',
        },
        {
          blockType: 'richText' as const,
          content: lexicalContent([
            {
              heading: 'Verantwortliche Stelle',
              text: 'Zahnarztpraxis Palatty AG, Zielstrasse 14B, 9050 Appenzell, Schweiz. Bei Fragen zum Datenschutz erreichen Sie uns unter praxis@zahnarztpraxis-palatty.ch.',
            },
            {
              heading: 'Umgang mit Personendaten',
              text: 'Wir bearbeiten Personendaten vertraulich und gemäss dem schweizerischen Bundesgesetz über den Datenschutz (DSG). Wenn Sie uns per E-Mail oder Kontaktformular kontaktieren, werden Ihre Angaben ausschliesslich zur Bearbeitung Ihrer Anfrage verwendet.',
            },
          ]),
        },
      ],
    },
  ]

  for (const page of pagesToSeed) {
    const existing = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: page.slug } },
    })

    if (existing.docs.length > 0) {
      console.log('Skipped existing page:', page.slug)
      continue
    }

    await payload.create({
      collection: 'pages',
      locale: 'de',
      data: {
        ...page,
        ...(locationId ? { location: locationId } : {}),
        _status: 'published',
      },
    })
    console.log('Seeded CMS page:', page.slug)
  }

  console.log('All CMS pages seeded cleanly.')
  process.exit(0)
}

await run()
process.exit(0)
