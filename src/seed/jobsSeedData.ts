import type { Payload } from 'payload'

type RichBlock =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

function textNode(text: string) {
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

function buildLexicalState(blocks: RichBlock[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: blocks.map((block) => {
        if (block.type === 'h2' || block.type === 'h3') {
          return {
            type: 'heading',
            tag: block.type,
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [textNode(block.text)],
          }
        }
        if (block.type === 'ul') {
          return {
            type: 'list',
            listType: 'bullet',
            start: 1,
            tag: 'ul',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: block.items.map((item, idx) => ({
              type: 'listitem',
              value: idx + 1,
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [textNode(item)],
            })),
          }
        }
        return {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [textNode(block.text)],
        }
      }),
    },
  }
}

/**
 * Idempotently seeds JobBoardConfig, the initial PAL-ZA-001 dental role in `jobs`,
 * and switches the existing `/jobs` CMS page to the dynamic `jobsOverview` layout.
 */
export async function seedJobsPortalData(
  payload: Payload,
  options: { updateJobsPageLayout?: boolean } = {},
) {
  await payload.updateGlobal({
    slug: 'job-board-config',
    locale: 'de',
    overrideAccess: true,
    data: {
      eyebrow: 'Karriere bei Palatty',
      title: 'Offene Stellen',
      description:
        'Wir sind eine moderne Schweizer Dorfzahnarztpraxis mit Herz, zwei modernen Standorten in Gais (AR) und Appenzell (AI) sowie einem jungen, motivierten Team.',
      applicationGuide: {
        heading: 'Ihr unkomplizierter Weg ins Team.',
        description:
          'Bewerben Sie sich in wenigen Minuten online. Wir prüfen jede Bewerbung persönlich und melden uns rasch bei Ihnen.',
        steps: [
          {
            title: 'Bewerbung online einreichen',
            description:
              'Wählen Sie die passende Stelle aus und laden Sie Ihren Lebenslauf direkt im Online-Formular als PDF, DOC oder DOCX hoch.',
          },
          {
            title: 'Persönliche Rückmeldung',
            description:
              'Unsere Praxisleitung prüft Ihre Unterlagen sorgfältig und lädt Sie bei Eignung zeitnah zum Erstgespräch ein.',
          },
          {
            title: 'Kennenlernen vor Ort',
            description:
              'Beim persönlichen Besuch in Appenzell oder Gais lernen Sie unser Team, die modernen Räume und unsere Arbeitsweise kennen.',
          },
        ],
        formIntro:
          'Reichen Sie Ihre Kontaktdaten und Ihren Lebenslauf direkt über dieses Formular ein. Ihre Unterlagen werden vertraulich behandelt.',
        successMessage:
          'Vielen Dank für Ihre Bewerbung. Wir haben Ihren Lebenslauf erhalten und melden uns innerhalb weniger Arbeitstage bei Ihnen.',
      },
    } as any,
  })

  const existingJobs = await payload.find({
    collection: 'jobs',
    limit: 1,
    overrideAccess: true,
    where: {
      or: [{ jobId: { equals: 'PAL-ZA-001' } }, { slug: { equals: 'zahnaerztin-zahnarzt-60-80' } }],
    },
  })

  const initialJobData = {
    title: 'Zahnärztin / Zahnarzt (60–80 %)',
    slug: 'zahnaerztin-zahnarzt-60-80',
    jobId: 'PAL-ZA-001',
    status: 'active' as const,
    department: 'Zahnmedizin',
    location: 'Gais (AR) & Appenzell (AI)',
    workload: '60–80 %',
    employmentType: 'part-time' as const,
    startDate: 'Per sofort oder nach Vereinbarung',
    displayOrder: 1,
    summary:
      'Für unsere modernen Praxen in Gais (AR) und Appenzell (AI) sowie unsere mobile Zahnmedizin suchen wir eine engagierte Zahnärztin oder einen engagierten Zahnarzt (60–80 %).',
    description: buildLexicalState([
      {
        type: 'p',
        text: 'Wir sind eine moderne Schweizer Dorfzahnarztpraxis mit Herz und einem jungen, motivierten Team. Mit zwei modernen Praxen – einer in Gais (Appenzell Ausserrhoden) und einer in Appenzell (Appenzell Innerrhoden) – bieten wir moderne allgemeine Zahnmedizin für Patientinnen und Patienten jeden Alters an. Die mobile Zahnmedizin ergänzt unser Angebot. Persönliche Betreuung, Vertrauen und eine hochwertige zahnmedizinische Versorgung stehen bei uns an erster Stelle.',
      },
      {
        type: 'p',
        text: 'Zur Verstärkung unseres Teams suchen wir per sofort oder nach Vereinbarung eine engagierte Zahnärztin oder einen engagierten Zahnarzt (60–80 %).',
      },
    ]),
    requirements: buildLexicalState([
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
    ]),
    tasks: buildLexicalState([
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
    ]),
    benefits: buildLexicalState([
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
    ]),
    applicationNote:
      'Bitte beachten Sie: Wir können ausschliesslich Bewerbungen von Zahnärztinnen und Zahnärzten mit einem Schweizer Studienabschluss oder einem in der Schweiz anerkannten zahnärztlichen Abschluss berücksichtigen.',
    meta: {
      title: 'Zahnärztin / Zahnarzt (60–80 %) | Jobs | Zahnarztpraxis Palatty',
      description:
        'Offene Stelle: Zahnärztin / Zahnarzt (60–80 %) in Gais (AR) & Appenzell (AI). Jetzt direkt online bewerben.',
    },
  }

  if (existingJobs.docs[0]) {
    await payload.update({
      collection: 'jobs',
      id: existingJobs.docs[0].id,
      locale: 'de',
      overrideAccess: true,
      data: initialJobData as any,
    })
  } else {
    await payload.create({
      collection: 'jobs',
      locale: 'de',
      overrideAccess: true,
      data: initialJobData as any,
    })
  }

  if (options.updateJobsPageLayout !== false) {
    const jobsPages = await payload.find({
      collection: 'pages',
      limit: 5,
      overrideAccess: true,
      where: { slug: { equals: 'jobs' } },
    })

    for (const page of jobsPages.docs) {
      const existingHero = page.layout?.find((b) => b.blockType === 'hero')
      const existingCta = page.layout?.find((b) => b.blockType === 'callToAction')

      const updatedLayout = [
        existingHero
          ? {
              ...existingHero,
              eyebrow: 'Karriere bei Palatty',
              heading: 'Offene Stellen &',
              titleHighlight: 'Karriere.',
              subheading:
                'Werden Sie Teil unserer modernen Schweizer Zahnarztpraxis mit Standorten in Appenzell und Gais.',
            }
          : {
              blockType: 'hero',
              eyebrow: 'Karriere bei Palatty',
              heading: 'Offene Stellen &',
              titleHighlight: 'Karriere.',
              subheading:
                'Werden Sie Teil unserer modernen Schweizer Zahnarztpraxis mit Standorten in Appenzell und Gais.',
            },
        {
          blockType: 'jobsOverview',
          eyebrow: 'Offene Stellen',
          heading: 'Aktuelle',
          headingHighlight: 'Stellenangebote.',
          intro:
            'Wählen Sie eine Position aus und reichen Sie Ihre Bewerbung mit Lebenslauf direkt online ein.',
          showFilters: true,
          showApplicationGuide: true,
        },
        existingCta ?? {
          blockType: 'callToAction',
          eyebrow: 'Spontanbewerbung',
          heading: 'Keine passende Stelle dabei?',
          text: 'Wir freuen uns jederzeit über motivierte Fachkräfte aus den Bereichen Zahnmedizin, Dentalhygiene, Prophylaxe und Dentalassistenz an gisha@zahnarzt-palatty.ch.',
          cta: {
            label: 'Bewerbung an gisha@zahnarzt-palatty.ch',
            type: 'external',
            url: 'mailto:gisha@zahnarzt-palatty.ch?subject=Spontanbewerbung',
            newTab: false,
          },
        },
      ]

      await payload.update({
        collection: 'pages',
        id: page.id,
        locale: 'de',
        overrideAccess: true,
        data: {
          title: 'Offene Stellen',
          layout: updatedLayout as any,
          _status: 'published',
        },
      })
    }
  }
}
