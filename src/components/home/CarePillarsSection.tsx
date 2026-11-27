'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import React, { useRef } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { useGsapContext } from '@/components/motion/useGsapContext'
import { Container } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

import './care-pillars.css'

gsap.registerPlugin(ScrollTrigger)

export type CareCardItem = {
  id?: string | null
  eyebrow: string
  icon?: 'shield' | 'tooth' | 'sparkles' | string | null
  surfaceStyle?: 'tinted-soft' | 'white' | 'tinted-cool' | string | null
  title: string
  description: string
  linkLabel: string
  href: string
}

type CarePillarsSectionProps = {
  headlineTop: string
  headlineHighlight: string
  subtitle: string
  cards: CareCardItem[]
  motionEnabled?: boolean
}

function PillarIcon({ icon }: { icon?: string | null }) {
  if (icon === 'tooth') {
    return (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="care-pillar-svg"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12.2 6.5c-2.9 0-5.2 2.4-5.2 5.7 0 2.5.8 4.9 1.6 7.4.9 2.9 1.6 5.9 2.1 8.8.2 1.1 1.1 1.9 2.1 1.9 1 0 1.8-.7 2.1-1.7l1.3-4.6c.4-1.3 1.2-2 1.8-2s1.4.7 1.8 2l1.3 4.6c.3 1 1.1 1.7 2.1 1.7 1 0 1.9-.8 2.1-1.9.5-2.9 1.2-5.9 2.1-8.8.8-2.5 1.6-4.9 1.6-7.4 0-3.3-2.3-5.7-5.2-5.7-1.9 0-3.4.8-4.5 1.7-.7.6-1.9.6-2.6 0-1.1-.9-2.6-1.7-4.5-1.7Z" />
      </svg>
    )
  }

  if (icon === 'sparkles') {
    return (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="care-pillar-svg"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 6.5l2.3 6.8 6.8 2.3-6.8 2.3L16 24.7l-2.3-6.8-6.8-2.3 6.8-2.3L16 6.5Z" />
        <path d="M27.2 7.5l1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1 1-2.7Z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className="care-pillar-svg"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 5.8L7.5 10.2v7.2c0 6.4 4.5 11.7 10.5 13 6-1.3 10.5-6.6 10.5-13v-7.2L18 5.8Z" />
      <path d="M13.5 18.2l3 3 6-6" />
    </svg>
  )
}

function ArrowTopRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="care-pillar-arrow-tr"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 11.5L11.5 4.5" />
      <path d="M5.5 4.5H11.5V10.5" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="care-pillar-arrow-r"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8H13" />
      <path d="M9 4L13 8L9 12" />
    </svg>
  )
}

export function CarePillarsSection({
  headlineTop,
  headlineHighlight,
  subtitle,
  cards,
  motionEnabled = true,
}: CarePillarsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { reduceMotion, motionPaused } = useMotionPreference()
  const allowMotion = motionEnabled && !reduceMotion && !motionPaused

  useGsapContext(
    sectionRef,
    () => {
      const root = sectionRef.current
      if (!root || !allowMotion) return

      const headings = root.querySelectorAll<HTMLElement>('[data-pillar-head]')
      const cardEls = root.querySelectorAll<HTMLElement>('[data-pillar-card]')
      const iconTiles = root.querySelectorAll<HTMLElement>('[data-pillar-icon]')

      if (headings.length) {
        gsap.fromTo(
          headings,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: 'top 82%',
              once: true,
            },
          },
        )
      }

      if (cardEls.length) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 32, scale: 0.965 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.78,
            stagger: 0.13,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.querySelector('[data-pillar-grid]') || root,
              start: 'top 84%',
              once: true,
            },
          },
        )
      }

      if (iconTiles.length) {
        gsap.fromTo(
          iconTiles,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            delay: 0.18,
            stagger: 0.13,
            ease: 'back.out(1.45)',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.querySelector('[data-pillar-grid]') || root,
              start: 'top 84%',
              once: true,
            },
          },
        )
      }
    },
    [allowMotion, cards.length],
  )

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!allowMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--spot-x', `${x.toFixed(1)}%`)
    e.currentTarget.style.setProperty('--spot-y', `${y.toFixed(1)}%`)
  }

  return (
    <section
      ref={sectionRef}
      id="schwerpunkte"
      className={cn(
        'care-pillars-section',
        allowMotion ? 'care-pillars-animated' : 'is-paused',
      )}
    >
      <Container>
        <div className="care-pillars-header">
          <div data-pillar-head>
            <h2 className="care-pillars-title">
              {headlineTop}
              <br />
              <span className="care-pillars-title-accent">{headlineHighlight}</span>
            </h2>
          </div>
          <p data-pillar-head className="care-pillars-subtitle">
            {subtitle}
          </p>
        </div>

        <div data-pillar-grid className="care-pillars-grid">
          {cards.map((card, index) => {
            const styleVariant =
              card.surfaceStyle ||
              (index === 1 ? 'white' : index === 2 ? 'tinted-cool' : 'tinted-soft')
            const isWhite = styleVariant === 'white'
            const tiltRight = index % 2 === 1
            const floatIdx = index % 3

            return (
              <Link
                key={card.id || `${card.eyebrow}-${index}`}
                href={card.href || '/leistungen'}
                prefetch={(card.href || '/leistungen').startsWith('/') ? true : undefined}
                className="care-pillar-link"
              >
                <article
                  data-pillar-card
                  onPointerMove={handlePointerMove}
                  className={cn(
                    'care-pillar-card',
                    styleVariant === 'white'
                      ? 'care-pillar-card--white'
                      : styleVariant === 'tinted-cool'
                        ? 'care-pillar-card--tinted-cool'
                        : 'care-pillar-card--tinted-soft',
                  )}
                >
                  <div className="care-pillar-spotlight" aria-hidden="true" />

                  <div className="care-pillar-top">
                    <span className="care-pillar-eyebrow">{card.eyebrow}</span>
                    <ArrowTopRight />
                  </div>

                  <div className="care-pillar-visual">
                    <div data-pillar-icon className={`care-pillar-float-${floatIdx}`}>
                      <div
                        className={cn(
                          'care-pillar-icon-tile',
                          isWhite
                            ? 'care-pillar-icon-tile--surface-tint'
                            : 'care-pillar-icon-tile--surface-light',
                          tiltRight
                            ? 'care-pillar-icon-tile--right'
                            : 'care-pillar-icon-tile--left',
                        )}
                      >
                        <PillarIcon icon={card.icon} />
                      </div>
                    </div>
                  </div>

                  <div className="care-pillar-content">
                    <h3 className="care-pillar-card-title">{card.title}</h3>
                    <p className="care-pillar-card-desc">{card.description}</p>
                    <div className="care-pillar-footer">
                      <span className="care-pillar-link-label">{card.linkLabel}</span>
                      <ArrowRight />
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
