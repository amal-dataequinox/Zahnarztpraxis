import Image from 'next/image'
import React from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/design-system'
import type { TeamOverviewBlock } from '@/payload-types'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type PartnerDisplayItem = {
  key: string
  name: string
  categoryLabel: string
  url?: string | null
  logoSrc: string
  logoWidth: number
  logoHeight: number
}

const DEFAULT_PARTNERS: PartnerDisplayItem[] = [
  {
    key: 'saremco',
    name: 'SAREMCO Dental AG',
    categoryLabel: '01 · Dentalmaterial',
    url: 'https://saremco.ch/collections/dentale-restaurationsmaterialien',
    logoSrc: '/design-system/partners/saremco-logo.svg',
    logoWidth: 1324,
    logoHeight: 190,
  },
  {
    key: 'appenzellerland',
    name: 'Appenzellerland',
    categoryLabel: '02 · Region & Standort',
    url: 'https://appenzellerland.ch/de/',
    logoSrc: '/design-system/partners/appenzellerland-logo.png',
    logoWidth: 450,
    logoHeight: 86,
  },
  {
    key: 'sso',
    name: 'SSO · Schweizerische Zahnärzte-Gesellschaft',
    categoryLabel: '03 · Fachverband',
    url: 'https://www.sso.ch/de',
    logoSrc: '/design-system/partners/sso-logo.png',
    logoWidth: 400,
    logoHeight: 60,
  },
]

function fallbackLogoForName(name: string): Pick<PartnerDisplayItem, 'logoSrc' | 'logoWidth' | 'logoHeight'> {
  const lower = name.toLowerCase()
  if (lower.includes('saremco')) return DEFAULT_PARTNERS[0]
  if (lower.includes('appenzeller')) return DEFAULT_PARTNERS[1]
  return DEFAULT_PARTNERS[2]
}

export function TeamPartnersSection({ block }: { block: TeamOverviewBlock }) {
  if (block.showPartners === false) return null

  const eyebrow = block.partnersEyebrow || 'Partner & Verbände'
  const customHeading = block.partnersHeading?.trim()
  const intro =
    block.partnersIntro ||
    'Für verlässliche Behandlungsqualität setzen wir auf zertifizierte Schweizer Materialien, strenge Verbandsstandards und regionale Verbundenheit.'

  const cmsPartners = block.partners ?? []
  const items: PartnerDisplayItem[] =
    cmsPartners.length > 0
      ? cmsPartners.map((item, idx) => {
          const mediaLogo = isMedia(item.logo) ? item.logo : null
          const resolvedSrc = mediaLogo
            ? toSiteImageSrc(mediaLogo.sizes?.card?.url || mediaLogo.url || undefined)
            : null
          const fallbackLogo = fallbackLogoForName(item.name)

          return {
            key: item.id || `${item.name}-${idx}`,
            name: item.name,
            categoryLabel: item.categoryLabel || `0${idx + 1} · Partner`,
            url: item.url,
            logoSrc: resolvedSrc || fallbackLogo.logoSrc,
            logoWidth: mediaLogo?.width || fallbackLogo.logoWidth,
            logoHeight: mediaLogo?.height || fallbackLogo.logoHeight,
          }
        })
      : DEFAULT_PARTNERS

  return (
    <section id="partner" className="partner-showcase-section py-[var(--section-y)]">
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="palatty-pill-eyebrow mb-3">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {eyebrow}
              </span>
              <h2 className="palatty-display-h2">
                {customHeading ? (
                  customHeading
                ) : (
                  <>
                    Qualität durch{' '}
                    <span className="palatty-display-accent">starke Partnerschaften.</span>
                  </>
                )}
              </h2>
            </div>
            <p className="m-0 max-w-md font-sans text-[0.98rem] leading-relaxed text-[#4f6468]">
              {intro}
            </p>
          </div>
        </Reveal>

        <Reveal variant="stagger">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((partner) => {
              const cardContent = (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.07] px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.09em] text-[#11423e]">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        aria-hidden="true"
                      />
                      {partner.categoryLabel}
                    </span>
                    {partner.url ? (
                      <span
                        aria-hidden="true"
                        className="partner-showcase-arrow inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-sm text-[#0e2a2f]/70"
                      >
                        ↗
                      </span>
                    ) : null}
                  </div>

                  <div className="partner-logo-stage">
                    <Image
                      src={partner.logoSrc}
                      alt={partner.name}
                      width={partner.logoWidth}
                      height={partner.logoHeight}
                      unoptimized
                      className="partner-logo-img max-h-12 sm:max-h-14 w-auto max-w-full object-contain"
                    />
                  </div>
                </>
              )

              return partner.url ? (
                <a
                  key={partner.key}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} – Website öffnen`}
                  title={partner.name}
                  className="appenzell-reveal-item partner-showcase-card group no-underline"
                >
                  {cardContent}
                </a>
              ) : (
                <article
                  key={partner.key}
                  className="appenzell-reveal-item partner-showcase-card"
                >
                  {cardContent}
                </article>
              )
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
