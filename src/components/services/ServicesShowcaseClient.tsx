'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useRef, useState } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { useGsapContext } from '@/components/motion/useGsapContext'
import { Container } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

gsap.registerPlugin(ScrollTrigger)

export type ServiceCategoryKey = 'vorsorge' | 'zahnerhalt' | 'aesthetik' | 'notfall'

export type ShowcaseServiceItem = {
  id: number | string
  slug: string
  name: string
  category?: ServiceCategoryKey | string | null
  shortDescription?: string | null
  imageSrc?: string | null
  imageAlt?: string | null
}

export type JourneyStepItem = {
  id?: string | null
  step: string
  title: string
  description: string
  icon?: 'chat' | 'compass' | 'shield' | string | null
}

type CategoryFilterKey = 'all' | ServiceCategoryKey

const CATEGORIES: Array<{ key: CategoryFilterKey; label: string }> = [
  { key: 'all', label: 'Alle Behandlungen' },
  { key: 'vorsorge', label: 'Vorsorge & Hygiene' },
  { key: 'zahnerhalt', label: 'Zahnerhalt & Implantate' },
  { key: 'aesthetik', label: 'Ästhetik & Korrektur' },
  { key: 'notfall', label: 'Notfall & Akut' },
]

const CATEGORY_BADGE_LABELS: Record<ServiceCategoryKey, string> = {
  vorsorge: 'Vorsorge',
  zahnerhalt: 'Zahnerhalt',
  aesthetik: 'Ästhetik',
  notfall: 'Akut',
}

function JourneyIcon({ kind }: { kind?: string | null }) {
  if (kind === 'compass') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" />
      </svg>
    )
  }
  if (kind === 'shield') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.5L5 6.5v5.3c0 4.4 3 8.1 7 9.2 4-1.1 7-4.8 7-9.2V6.5l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.6A8 8 0 1 1 21 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </svg>
  )
}

type ServicesShowcaseClientProps = {
  eyebrow?: string
  heading?: string
  headingHighlight?: string
  intro?: string
  cardLinkLabel?: string
  services: ShowcaseServiceItem[]
  fallbackCardImageSrc?: string | null
  journeyEyebrow?: string
  journeyHeading?: string
  journeyHighlight?: string
  journeyDescription?: string
  journeySteps?: JourneyStepItem[]
  ctaEyebrow?: string
  ctaHeading?: string
  ctaHighlight?: string
  ctaDescription?: string
  ctaButtonLabel?: string
  ctaButtonHref?: string | null
  ctaImageSrc?: string | null
  ctaImageAlt?: string | null
  phone?: string | null
  bookingUrl?: string | null
  filterLabels?: Partial<Record<CategoryFilterKey, string>>
}

export function ServicesShowcaseClient({
  eyebrow = 'Leistungen',
  heading = 'Unser Behandlungsangebot',
  headingHighlight = 'in Appenzell.',
  intro = 'Moderne Zahnmedizin und einfühlsame Behandlungskonzepte für Ihre Zahngesundheit.',
  cardLinkLabel = 'Behandlung entdecken',
  services,
  fallbackCardImageSrc,
  journeyEyebrow = 'Unser Ablauf',
  journeyHeading = 'Ihr Besuch',
  journeyHighlight = 'in drei klaren Schritten.',
  journeyDescription = 'Von der ersten Untersuchung bis zur nachhaltigen Nachsorge begleiten wir Sie strukturiert und verständlich.',
  journeySteps = [],
  ctaEyebrow = 'Termin & Beratung',
  ctaHeading = 'Persönliche Beratung',
  ctaHighlight = 'in Appenzell.',
  ctaDescription = 'Sie möchten wissen, welche Behandlung optimal zu Ihren Zähnen passt? Vereinbaren Sie gerne Ihren Termin telefonisch oder direkt online.',
  ctaButtonLabel = 'Termin vereinbaren',
  ctaButtonHref,
  ctaImageSrc,
  ctaImageAlt = 'Empfang der Zahnarztpraxis Palatty in Appenzell',
  phone,
  bookingUrl,
  filterLabels,
}: ServicesShowcaseClientProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>('all')
  const { reduceMotion, motionPaused } = useMotionPreference()
  const allowMotion = !reduceMotion && !motionPaused

  const enrichedServices = useMemo(
    () =>
      services.map((s) => {
        const key: ServiceCategoryKey =
          s.category === 'vorsorge' ||
          s.category === 'aesthetik' ||
          s.category === 'notfall' ||
          s.category === 'zahnerhalt'
            ? s.category
            : 'zahnerhalt'
        return {
          ...s,
          catKey: key,
          catLabel: CATEGORY_BADGE_LABELS[key],
        }
      }),
    [services],
  )

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? enrichedServices
        : enrichedServices.filter((s) => s.catKey === activeCategory),
    [enrichedServices, activeCategory],
  )

  useGsapContext(
    rootRef,
    () => {
      const root = rootRef.current
      if (!root || !allowMotion) return

      const cards = root.querySelectorAll<HTMLElement>('[data-svc-card]')
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 26, scale: 0.975 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.68,
            stagger: 0.08,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.querySelector('[data-svc-grid]') || root,
              start: 'top 84%',
              once: true,
            },
          },
        )
      }

      const steps = root.querySelectorAll<HTMLElement>('[data-journey-step]')
      if (steps.length) {
        gsap.fromTo(
          steps,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.11,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.querySelector('[data-journey-grid]') || root,
              start: 'top 85%',
              once: true,
            },
          },
        )
      }
    },
    [allowMotion],
  )

  const resolvedCtaHref = ctaButtonHref || bookingUrl || '/kontakt#termin'

  return (
    <div ref={rootRef}>
      <section id="leistungen" className="services-showcase-section">
        <Container>
          <div className="palatty-section-header">
            <div className="flex flex-col gap-3 max-w-2xl">
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {eyebrow} · {filtered.length}{' '}
                {filtered.length === 1 ? 'Behandlung' : 'Behandlungen'}
              </span>
              <h2 className="palatty-display-h2">
                {heading}{' '}
                {headingHighlight ? (
                  <span className="palatty-display-accent">{headingHighlight}</span>
                ) : null}
              </h2>
            </div>
            <p className="m-0 max-w-sm font-sans text-[0.95rem] leading-relaxed text-[#4f6468] lg:pb-1">
              {intro}
            </p>
          </div>

          <div
            className="service-filter-bar"
            role="tablist"
            aria-label="Behandlungskategorien"
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'service-filter-pill',
                    active && 'service-filter-pill--active',
                  )}
                >
                  {filterLabels?.[cat.key] || cat.label}
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="m-0 font-sans text-base text-[#52686c]">
              Keine Behandlungen in dieser Kategorie gefunden.
            </p>
          ) : (
            <div data-svc-grid className="service-bento-grid">
              {filtered.map((service, index) => {
                const thumbSrc = service.imageSrc || fallbackCardImageSrc
                return (
                  <Link
                    key={service.id}
                    href={`/leistungen/${service.slug}`}
                    prefetch={true}
                    data-svc-card
                    className="service-bento-card group"
                  >
                    {thumbSrc ? (
                      <div className="service-bento-thumb">
                        <Image
                          src={thumbSrc}
                          alt={service.imageAlt || service.name}
                          fill
                          quality={88}
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                        />
                        <span className="treatment-row-index absolute left-4 top-4 shadow-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="service-bento-badge">{service.catLabel}</span>
                      </div>
                    ) : null}

                    <div className="service-bento-body">
                      <div>
                        <h3 className="m-0 font-display text-[1.28rem] font-semibold tracking-[-0.02em] text-[#0e2a2f] group-hover:text-[var(--color-accent)] transition-colors">
                          {service.name}
                        </h3>
                        <p className="mt-2.5 mb-6 font-sans text-[0.875rem] leading-relaxed text-[#52686c]">
                          {service.shortDescription ||
                            'Individuelle Beratung und schonende Behandlung in unserer Praxis.'}
                        </p>
                      </div>

                      <div className="care-pillar-footer">
                        <span className="care-pillar-link-label">{cardLinkLabel}</span>
                        <span
                          className="font-sans text-base text-[#0e2a2f] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {journeySteps.length > 0 ? (
        <section className="treatment-journey-section">
          <Container>
            <div className="palatty-section-header">
              <div className="flex flex-col gap-3 max-w-2xl">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {journeyEyebrow}
                </span>
                <h2 className="palatty-display-h2">
                  {journeyHeading}{' '}
                  {journeyHighlight ? (
                    <span className="palatty-display-accent">{journeyHighlight}</span>
                  ) : null}
                </h2>
              </div>
              <p className="m-0 max-w-sm font-sans text-[0.95rem] leading-relaxed text-[#4f6468] lg:pb-1">
                {journeyDescription}
              </p>
            </div>

            <div data-journey-grid className="treatment-journey-grid">
              {journeySteps.map((item, idx) => (
                <div
                  key={item.id || `${item.step}-${idx}`}
                  data-journey-step
                  className="treatment-journey-card"
                >
                  <div>
                    <div className="treatment-journey-icon">
                      <JourneyIcon kind={item.icon} />
                    </div>
                    <span className="care-pillar-eyebrow">{item.step}</span>
                    <h3 className="mt-3 mb-2.5 font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[#0e2a2f]">
                      {item.title}
                    </h3>
                    <p className="m-0 font-sans text-[0.875rem] leading-relaxed text-[#52686c]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-[var(--section-y)] bg-white">
        <Container>
          <div className="contact-hub-card contact-hub-card--accent">
            <div
              className={cn(
                'grid gap-8',
                ctaImageSrc && 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12',
              )}
            >
              <div className="flex flex-col gap-4">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {ctaEyebrow}
                </span>
                <h2 className="palatty-display-h2">
                  {ctaHeading}{' '}
                  {ctaHighlight ? (
                    <span className="palatty-display-accent">{ctaHighlight}</span>
                  ) : null}
                </h2>
                <p className="m-0 max-w-xl font-sans text-[0.98rem] leading-relaxed text-[#496064]">
                  {ctaDescription}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {resolvedCtaHref.startsWith('http') ? (
                    <a
                      href={resolvedCtaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="praxis-cta-btn"
                    >
                      <span>{ctaButtonLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={resolvedCtaHref}
                      prefetch={resolvedCtaHref.startsWith('/') ? true : undefined}
                      className="praxis-cta-btn"
                    >
                      <span>{ctaButtonLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                  {phone ? (
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="contact-pill-action">
                      <span>{phone}</span>
                    </a>
                  ) : (
                    <Link href="/kontakt" prefetch={true} className="contact-pill-action">
                      <span>Zur Kontaktseite</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>

              {ctaImageSrc ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/80 shadow-lg">
                  <Image
                    src={ctaImageSrc}
                    alt={ctaImageAlt || ctaHeading}
                    fill
                    quality={88}
                    className="object-cover object-center"
                    sizes="(max-width:1024px) 100vw, 45vw"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
