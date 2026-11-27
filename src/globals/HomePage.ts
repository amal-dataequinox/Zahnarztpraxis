import type { GlobalConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { cmsGlobalRevalidateHooks } from '@/utilities/cacheRevalidation'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Startseite & Inhalte',
  admin: { group: 'Inhalte' },
  access: {
    read: anyone,
    update: editorOrAbove,
  },
  hooks: cmsGlobalRevalidateHooks(['cms-home-page']),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero-Bereich',
          fields: [
            {
              name: 'heroBadge',
              label: 'Badge / Oberzeile',
              type: 'text',
              defaultValue: 'Zahnarztpraxis Palatty',
            },
            {
              name: 'heroHeadlineTop',
              label: 'Überschrift Zeile 1 (Weiss)',
              type: 'text',
              defaultValue: 'Zahnmedizin,',
            },
            {
              name: 'heroHeadlinePrefix',
              label: 'Überschrift Zeile 2 (Weiss)',
              type: 'text',
              defaultValue: 'die sich',
            },
            {
              name: 'heroHeadlineHighlight',
              label: 'Hervorgehobener Text (Primärfarbe)',
              type: 'textarea',
              defaultValue: 'gut\nanfühlt.',
              admin: {
                description: 'Wird in der Primärfarbe dargestellt. Zeilenumbruch erzeugt zwei Zeilen.',
              },
            },
            {
              name: 'heroSubheadline',
              label: 'Untertitel / Beschreibung',
              type: 'textarea',
              defaultValue: 'Moderne Behandlung. Persönliche Betreuung.\nFür Sie und Ihre Familie.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroPrimaryCtaLabel',
                  label: 'Primärer Button (Text)',
                  type: 'text',
                  defaultValue: 'Termin vereinbaren',
                  admin: { width: '50%' },
                },
                {
                  name: 'heroPrimaryCtaHref',
                  label: 'Primärer Button (Link)',
                  type: 'text',
                  defaultValue: '/kontakt#termin',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroSecondaryCtaLabel',
                  label: 'Sekundärer Button (Text)',
                  type: 'text',
                  defaultValue: 'Behandlungen entdecken',
                  admin: { width: '50%' },
                },
                {
                  name: 'heroSecondaryCtaHref',
                  label: 'Sekundärer Button (Link)',
                  type: 'text',
                  defaultValue: '/leistungen',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'heroScrollLabel',
              label: 'Scroll-Hinweis (Unten)',
              type: 'text',
              defaultValue: 'Entdecken',
            },
            {
              name: 'heroBackgroundType',
              label: 'Hero-Hintergrundtyp',
              type: 'select',
              enumName: 'enum_home_page_hero_background_type',
              defaultValue: 'media',
              options: [
                { label: 'Medium (HLS-Stream / Video / Bild)', value: 'media' },
                { label: 'Einfarbig (Solid Color)', value: 'color' },
                { label: 'Farbverlauf (Gradient)', value: 'gradient' },
              ],
              admin: {
                description:
                  'Wählen Sie Medium (inkl. adaptives HLS-Streaming wie bei DEQX), eine Volltonfarbe oder einen CSS-Verlauf.',
              },
            },
            {
              name: 'heroBackgroundColor',
              label: 'Hero-Hintergrundfarbe',
              type: 'text',
              defaultValue: '#0c1824',
              admin: {
                condition: (_data, siblingData) => siblingData?.heroBackgroundType === 'color',
                description: 'Gültige CSS-Farbe (z. B. #0c1824 oder rgba(0,0,0,0.8)).',
              },
            },
            {
              name: 'heroBackgroundGradient',
              label: 'Hero-Farbverlauf (CSS)',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.heroBackgroundType === 'gradient',
                description: 'z. B. linear-gradient(135deg, #0c1824 0%, #00a887 100%)',
              },
            },
            {
              name: 'heroMedia',
              label: 'Hero-Medium (HLS-Stream, Video oder Bild)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_data, siblingData) => !siblingData?.heroBackgroundType || siblingData?.heroBackgroundType === 'media',
                description:
                  'Wählen Sie ein HLS-Medium (.m3u8 aus Medien), ein Video (MP4/WebM) oder ein Foto.',
              },
            },
            {
              name: 'heroHlsUrl',
              label: 'Oder direkte HLS Playlist-URL (.m3u8)',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => !siblingData?.heroBackgroundType || siblingData?.heroBackgroundType === 'media',
                description:
                  'Optional: Direkte .m3u8 Stream-URL (überschreibt falls ausgefüllt). Für adaptive Wiedergabe über hls.js.',
              },
            },
            {
              name: 'heroVideo',
              label: 'Legacy Hero-Video',
              type: 'upload',
              relationTo: 'media',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'heroVideoPoster',
              label: 'Hero-Video Vorschaubild (Poster)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                condition: (_data, siblingData) => !siblingData?.heroBackgroundType || siblingData?.heroBackgroundType === 'media',
                description: 'Optionales Vorschaubild vor dem ersten Frame und bei reduzierter Bewegung.',
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_data, siblingData) => !siblingData?.heroBackgroundType || siblingData?.heroBackgroundType === 'media',
              },
              fields: [
                {
                  name: 'heroVideoAutoplay',
                  label: 'Automatisch abspielen (Autoplay)',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'heroVideoLoop',
                  label: 'Endlosschleife (Loop)',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'heroVideoMuted',
                  label: 'Stummgeschaltet (Muted)',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Praxis & Über uns',
          fields: [
            {
              name: 'aboutEyebrow',
              label: 'Oberzeile',
              type: 'text',
              defaultValue: 'Zahnarztpraxis',
            },
            {
              name: 'aboutHeading',
              label: 'Überschrift',
              type: 'text',
              defaultValue: 'Im Herzen von Appenzell',
            },
            {
              name: 'aboutLead',
              label: 'Einleitungstext',
              type: 'textarea',
              defaultValue:
                'Willkommen in unserer Zahnarztpraxis — wo moderne Zahnmedizin auf persönliche Betreuung trifft. Unter dem Motto «Dein Lächeln. Unsere Leidenschaft.» setzen wir uns dafür ein, dass Sie sich rundum wohlfühlen.',
            },
            {
              name: 'aboutBody',
              label: 'Haupttext',
              type: 'textarea',
              defaultValue:
                'Als Familienzahnarztpraxis begleiten wir Menschen jeden Alters mit klarer Beratung und modernen Räumen. Bei uns wissen Sie jederzeit, was gemacht wird — transparent und nachvollziehbar.',
            },
            {
              name: 'aboutExtendedParagraphs',
              label: 'Weitere Absätze (Praxisvorstellung)',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'text',
                  label: 'Absatztext',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'aboutLinkLabel',
                  label: 'Link-Text',
                  type: 'text',
                  defaultValue: 'Zum Team',
                  admin: { width: '50%' },
                },
                {
                  name: 'aboutLinkHref',
                  label: 'Link-Ziel',
                  type: 'text',
                  defaultValue: '/team',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'aboutImage',
              label: 'Praxis-Hauptbild',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              name: 'aboutDetailImage',
              label: 'Praxis-Detailbild (Schwebende Überlagerung)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              name: 'aboutBadgeLabel',
              label: 'Foto-Abzeichen Text (Oben rechts im Bild)',
              type: 'text',
              defaultValue: 'Im Herzen der Praxis',
            },
            {
              name: 'aboutHighlights',
              label: 'Praxis-Vorteile (Chips)',
              type: 'array',
              maxRows: 6,
              fields: [
                {
                  name: 'label',
                  label: 'Stichpunkt',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Schwerpunkte / Lebensphasen',
          fields: [
            {
              name: 'careHeadlineTop',
              label: 'Überschrift Zeile 1 (Dunkel)',
              type: 'text',
              defaultValue: 'Für gesunde Zähne.',
            },
            {
              name: 'careHeadlineHighlight',
              label: 'Überschrift Zeile 2 (Primärfarbe)',
              type: 'text',
              defaultValue: 'In jeder Lebensphase.',
            },
            {
              name: 'careSubtitle',
              label: 'Einleitungstext (Rechts)',
              type: 'textarea',
              defaultValue: 'Von der Vorsorge bis zur individuellen Behandlung: Wir begleiten Ihr Lächeln.',
            },
            {
              name: 'careCards',
              label: 'Schwerpunkt-Karten (3er-Raster)',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              admin: {
                description: 'Die drei interaktiven Karten unter dem Praxis-Abschnitt.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'eyebrow',
                      label: 'Nummer / Kategorie',
                      type: 'text',
                      required: true,
                      admin: { width: '34%', placeholder: '01 / VORSORGE' },
                    },
                    {
                      name: 'icon',
                      label: 'Symbol',
                      type: 'select',
                      enumName: 'enum_home_page_care_cards_icon',
                      defaultValue: 'shield',
                      options: [
                        { label: 'Schutzschild (Vorsorge)', value: 'shield' },
                        { label: 'Zahn (Zahnerhalt)', value: 'tooth' },
                        { label: 'Glanz / Sterne (Ästhetik)', value: 'sparkles' },
                      ],
                      admin: { width: '33%' },
                    },
                    {
                      name: 'surfaceStyle',
                      label: 'Karten-Stil',
                      type: 'select',
                      enumName: 'enum_home_page_care_cards_surface_style',
                      defaultValue: 'tinted-soft',
                      options: [
                        { label: 'Sanft getönt (Mint / Primär)', value: 'tinted-soft' },
                        { label: 'Reinweiss (Elevated)', value: 'white' },
                        { label: 'Kühl getönt (Aqua / Primär)', value: 'tinted-cool' },
                      ],
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  name: 'title',
                  label: 'Kartentitel',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Beschreibung',
                  type: 'textarea',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'linkLabel',
                      label: 'Fusszeilen-Linktext',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'href',
                      label: 'Ziel-URL / Pfad',
                      type: 'text',
                      required: true,
                      admin: { width: '50%', placeholder: '/leistungen/prophylaxe' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Praxis-Einblicke',
          fields: [
            {
              name: 'galleryEyebrow',
              label: 'Galerie Oberzeile',
              type: 'text',
              defaultValue: 'Atmosphäre & Räume',
            },
            {
              name: 'galleryHeading',
              label: 'Galerie Überschrift',
              type: 'text',
              defaultValue: 'Einblicke in unsere Praxis.',
            },
            {
              name: 'galleryHighlight',
              label: 'Galerie Akzent-Zeile (Primärfarbe)',
              type: 'text',
              defaultValue: 'Helle Räume in Appenzell.',
            },
            {
              name: 'galleryDescription',
              label: 'Galerie Einleitung',
              type: 'textarea',
              defaultValue:
                'Lichtdurchflutete Behandlungszimmer, ruhige Materialien und ein herzlicher Empfang – damit Sie sich vom ersten Moment an gut aufgehoben fühlen.',
            },
            {
              name: 'galleryItems',
              label: 'Galerie-Aufnahmen (Bento-Mosaik)',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              fields: [
                {
                  name: 'image',
                  label: 'Praxisfoto',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  filterOptions: { mimeType: { contains: 'image' } },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'category',
                      label: 'Bereich / Etikett',
                      type: 'text',
                      required: true,
                      admin: { width: '35%', placeholder: 'Empfang' },
                    },
                    {
                      name: 'caption',
                      label: 'Bildunterschrift',
                      type: 'text',
                      required: true,
                      admin: { width: '40%', placeholder: 'Freundlicher Empfang & Beratung' },
                    },
                    {
                      name: 'layoutSpan',
                      label: 'Format',
                      type: 'select',
                      enumName: 'enum_home_page_gallery_items_layout_span',
                      defaultValue: 'standard',
                      options: [
                        { label: 'Standard', value: 'standard' },
                        { label: 'Grossformat (Breit)', value: 'wide' },
                      ],
                      admin: { width: '25%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Leistungen & Team',
          fields: [
            {
              name: 'servicesEyebrow',
              label: 'Leistungen Oberzeile',
              type: 'text',
              defaultValue: 'Leistungen',
            },
            {
              name: 'servicesHeading',
              label: 'Leistungen Überschrift',
              type: 'text',
              defaultValue: 'Behandlungen',
            },
            {
              name: 'servicesHeadingHighlight',
              label: 'Leistungen Akzent-Teil (Primärfarbe)',
              type: 'text',
              defaultValue: 'in Appenzell.',
            },
            {
              name: 'servicesDescription',
              label: 'Leistungen Beschreibung',
              type: 'textarea',
              defaultValue: 'Moderne Zahnmedizin und einfühlsame Behandlungskonzepte für Ihre Zahngesundheit.',
            },
            {
              name: 'servicesLinkLabel',
              label: 'Leistungen Link-Text',
              type: 'text',
              defaultValue: 'Alle Leistungen',
            },
            {
              name: 'teamEyebrow',
              label: 'Team Oberzeile',
              type: 'text',
              defaultValue: 'Team',
            },
            {
              name: 'teamHeading',
              label: 'Team Überschrift',
              type: 'text',
              defaultValue: 'Erfahren Sie mehr über unser Team',
            },
            {
              name: 'teamDescription',
              label: 'Team Beschreibung',
              type: 'textarea',
              defaultValue:
                'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch professionell und persönlich ist.',
            },
            {
              name: 'teamLinkLabel',
              label: 'Team Link-Text',
              type: 'text',
              defaultValue: 'Team-Seite',
            },
            {
              name: 'teamDefaultRoleLabel',
              label: 'Standard-Rolle (falls Funktion beim Teammitglied leer)',
              type: 'text',
              defaultValue: 'Praxisteam Appenzell',
            },
          ],
        },
        {
          label: 'Standort & Termin',
          fields: [
            {
              name: 'locationEyebrow',
              label: 'Standort Oberzeile',
              type: 'text',
              defaultValue: 'Standort',
            },
            {
              name: 'locationHeading',
              label: 'Standort Überschrift',
              type: 'text',
              defaultValue: 'Zahnarztpraxis Appenzell',
            },
            {
              name: 'locationHeadingHighlight',
              label: 'Standort Akzent-Teil (Primärfarbe)',
              type: 'text',
              defaultValue: 'erreichen.',
            },
            {
              name: 'locationDescription',
              label: 'Standort Beschreibung',
              type: 'textarea',
              defaultValue:
                'Ihre Praxis für zahnärztliche Fachkompetenz und moderne Behandlung im Herzen von Appenzell.',
            },
            {
              name: 'hoursDisclaimer',
              label: 'Hinweis unter Öffnungszeiten (Optional)',
              type: 'text',
              defaultValue: '',
            },
            {
              name: 'appointmentEyebrow',
              label: 'Termin Oberzeile',
              type: 'text',
              defaultValue: 'Termin',
            },
            {
              name: 'appointmentHeading',
              label: 'Termin Überschrift',
              type: 'text',
              defaultValue: 'Wir freuen uns auf Sie',
            },
            {
              name: 'appointmentDescription',
              label: 'Termin Beschreibung',
              type: 'textarea',
              defaultValue:
                'Rufen Sie an, schreiben Sie eine E-Mail oder nutzen Sie die Kontaktseite.',
            },
            {
              name: 'appointmentLinkLabel',
              label: 'Termin Link-Text',
              type: 'text',
              defaultValue: 'Zur Kontaktseite',
            },
            {
              name: 'appointmentImage',
              label: 'Termin-Karte Bild (Empfang / Praxis)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'locationAddressLabel',
                  label: 'Label Praxisadresse',
                  type: 'text',
                  defaultValue: 'Praxisadresse',
                  admin: { width: '50%' },
                },
                {
                  name: 'locationMapLabel',
                  label: 'Button-Text Route',
                  type: 'text',
                  defaultValue: 'Route planen',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Tarif & Kosten',
          fields: [
            {
              name: 'pricingEyebrow',
              label: 'Kosten Oberzeile',
              type: 'text',
              defaultValue: 'Transparenz & Tarif',
            },
            {
              name: 'pricingHeading',
              label: 'Kosten Überschrift',
              type: 'text',
              defaultValue: 'Kosten – Zahnarzt',
            },
            {
              name: 'pricingHighlight',
              label: 'Kosten Akzent-Teil (Primärfarbe)',
              type: 'text',
              defaultValue: 'fair und nachvollziehbar.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pricingCardEyebrow',
                  label: 'Tarif-Karte Etikett',
                  type: 'text',
                  defaultValue: '01 / SSO & DENTOTAR®',
                  admin: { width: '34%' },
                },
                {
                  name: 'pricingChipOne',
                  label: 'Tarif-Chip 1',
                  type: 'text',
                  defaultValue: 'Krankenkassen',
                  admin: { width: '33%' },
                },
                {
                  name: 'pricingChipTwo',
                  label: 'Tarif-Chip 2',
                  type: 'text',
                  defaultValue: 'Privatpatienten',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pricingTaxPointLabel',
                  label: 'Taxpunkt-Bezeichnung',
                  type: 'text',
                  defaultValue: 'Unser Taxpunkt (DENTOTAR®)',
                  admin: { width: '50%' },
                },
                {
                  name: 'pricingTaxPointValue',
                  label: 'Taxpunktwert',
                  type: 'text',
                  defaultValue: '1.10',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'pricingSubcaption',
              label: 'Taxpunkt-Untertitel',
              type: 'text',
              defaultValue: 'Mindesttarif gemäss Schweizerischer Zahnärzte-Gesellschaft (SSO)',
            },
            {
              name: 'pricingDescription',
              label: 'Tarifbeschreibung (SSO / DENTOTAR®)',
              type: 'textarea',
              defaultValue:
                'Wir halten uns an die Richtlinien der SSO (Schweizerische Zahnärztegesellschaft) und an den Vertrag mit den Sozialversicherungspartnern. Der mit Januar 2018 eingeführte Mindesttarif (DENTOTAR)® ist für Krankenkassen und auch für Privatpatienten gültig.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pricingEstimateEyebrow',
                  label: 'Kostenvoranschlag Etikett',
                  type: 'text',
                  defaultValue: '02 / KOSTENVORANSCHLAG',
                  admin: { width: '50%' },
                },
                {
                  name: 'pricingEstimateHeading',
                  label: 'Kostenvoranschlag Überschrift',
                  type: 'text',
                  defaultValue: 'Klarheit vor jeder Behandlung.',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'pricingNote',
              label: 'Hinweis Kostenvoranschlag',
              type: 'textarea',
              defaultValue:
                'Es ist wichtig, dass Sie nach der Zahnarztuntersuchung über den Befund, die Diagnose, mögliche Behandlungsvarianten und die damit verbundenen Kosten informiert werden. Natürlich können wir Ihnen einen schriftlichen Kostenvoranschlag erstellen, um Ihnen eine genaue Vorstellung der zu erwartenden Kosten für Ihre Behandlung zu geben. Es ist uns wichtig, dass Sie alle Informationen haben, um eine fundierte Entscheidung zu treffen.',
            },
            {
              name: 'pricingServicesCtaLabel',
              label: 'Button-Text Fachbereiche',
              type: 'text',
              defaultValue: 'Fachbereiche ansehen',
            },
          ],
        },
      ],
    },
  ],
}
