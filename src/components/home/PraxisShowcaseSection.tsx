'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { useGsapContext } from '@/components/motion/useGsapContext'
import { Container, Stack } from '@/design-system'

gsap.registerPlugin(ScrollTrigger)

type PraxisShowcaseSectionProps = {
  eyebrow: string
  heading: string
  lead: string
  body: string
  linkLabel: string
  linkHref: string
  mainImgSrc?: string | null
  mainImgAlt?: string | null
  detailImgSrc?: string | null
  detailImgAlt?: string | null
  cityLabel?: string
  badgeLabel?: string
  highlights?: string[]
  extendedParagraphs?: string[]
  motionEnabled?: boolean
}

export function PraxisShowcaseSection({
  eyebrow,
  heading,
  lead,
  body,
  linkLabel,
  linkHref,
  mainImgSrc,
  mainImgAlt,
  detailImgSrc,
  detailImgAlt,
  cityLabel = 'Appenzell',
  badgeLabel = 'Im Herzen der Praxis',
  highlights = [],
  extendedParagraphs = [],
  motionEnabled = true,
}: PraxisShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { reduceMotion, motionPaused } = useMotionPreference()
  const allowMotion = motionEnabled && !reduceMotion && !motionPaused

  useGsapContext(
    sectionRef,
    () => {
      const root = sectionRef.current
      if (!root || !allowMotion) return

      const copyEls = root.querySelectorAll<HTMLElement>('[data-praxis-copy]')
      const mediaEl = root.querySelector<HTMLElement>('[data-praxis-media]')

      if (copyEls.length) {
        gsap.fromTo(
          copyEls,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: 'top 80%',
              once: true,
            },
          },
        )
      }

      if (mediaEl) {
        gsap.fromTo(
          mediaEl,
          { opacity: 0, y: 28, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.12,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: 'top 80%',
              once: true,
            },
          },
        )
      }
    },
    [allowMotion],
  )

  return (
    <section ref={sectionRef} id="praxis" className="praxis-showcase-section">
      <Container>
        <div className="praxis-showcase-grid">
          <Stack gap="5" className="max-w-xl">
            <div data-praxis-copy>
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {eyebrow}
              </span>
            </div>

            <div data-praxis-copy>
              <h2 className="palatty-display-h2">{heading}</h2>
            </div>

            <p data-praxis-copy className="praxis-lead-text">
              {lead}
            </p>

            <p data-praxis-copy className="praxis-body-text">
              {body}
            </p>

            {extendedParagraphs.map((paragraph, idx) => (
              <p key={idx} data-praxis-copy className="praxis-body-text">
                {paragraph}
              </p>
            ))}

            {highlights.length > 0 ? (
              <div data-praxis-copy className="praxis-highlights-row">
                {highlights.map((item) => (
                  <span key={item} className="praxis-highlight-chip">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3.5 8.5L6.5 11.5L12.5 5" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <div data-praxis-copy className="pt-2">
              <Link
                href={linkHref || '/team'}
                prefetch={(linkHref || '/team').startsWith('/') ? true : undefined}
                className="praxis-cta-btn"
              >
                <span>{linkLabel}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8H13" />
                  <path d="M9 4L13 8L9 12" />
                </svg>
              </Link>
            </div>
          </Stack>

          {mainImgSrc ? (
            <div data-praxis-media className="praxis-collage">
              <div className="praxis-collage-main">
                <Image
                  src={mainImgSrc}
                  alt={mainImgAlt || heading}
                  fill
                  priority
                  quality={90}
                  className="palatty-scroll-img object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 52vw"
                />
                {badgeLabel ? (
                  <div className="praxis-location-badge">
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    <span>
                      {cityLabel} · {badgeLabel}
                    </span>
                  </div>
                ) : null}
              </div>

              {detailImgSrc ? (
                <div className="praxis-collage-inset">
                  <Image
                    src={detailImgSrc}
                    alt={detailImgAlt || heading}
                    fill
                    quality={88}
                    className="object-cover object-[50%_20%]"
                    sizes="240px"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
