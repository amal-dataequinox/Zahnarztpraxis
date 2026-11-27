'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { useGsapContext } from '@/components/motion/useGsapContext'
import { Container } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

gsap.registerPlugin(ScrollTrigger)

export type PracticeGalleryItem = {
  id?: string | null
  src: string
  alt: string
  category: string
  caption: string
  layoutSpan?: 'wide' | 'standard' | string | null
}

type PracticeGalleryBandProps = {
  eyebrow: string
  heading: string
  highlight: string
  description: string
  items: PracticeGalleryItem[]
  motionEnabled?: boolean
}

export function PracticeGalleryBand({
  eyebrow,
  heading,
  highlight,
  description,
  items,
  motionEnabled = true,
}: PracticeGalleryBandProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<PracticeGalleryItem | null>(null)
  const { reduceMotion, motionPaused } = useMotionPreference()
  const allowMotion = motionEnabled && !reduceMotion && !motionPaused

  useGsapContext(
    sectionRef,
    () => {
      const root = sectionRef.current
      if (!root || !allowMotion) return

      const heads = root.querySelectorAll<HTMLElement>('[data-gallery-head]')
      const tiles = root.querySelectorAll<HTMLElement>('[data-gallery-tile]')

      if (heads.length) {
        gsap.fromTo(
          heads,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
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

      if (tiles.length) {
        gsap.fromTo(
          tiles,
          { opacity: 0, y: 28, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.11,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.querySelector('[data-gallery-grid]') || root,
              start: 'top 84%',
              once: true,
            },
          },
        )
      }
    },
    [allowMotion, items.length],
  )

  if (items.length === 0) return null

  const openItem = (item: PracticeGalleryItem) => {
    setSelected(item)
    dialogRef.current?.showModal()
  }

  const closeLightbox = () => {
    dialogRef.current?.close()
    setSelected(null)
  }

  return (
    <section ref={sectionRef} id="einblicke" className="practice-gallery-section">
      <Container>
        <div className="palatty-section-header">
          <div data-gallery-head className="flex flex-col gap-3">
            <span className="palatty-pill-eyebrow">
              <span className="palatty-pill-dot" aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className="palatty-display-h2">
              {heading}
              <br />
              <span className="palatty-display-accent">{highlight}</span>
            </h2>
          </div>
          <p
            data-gallery-head
            className="m-0 max-w-sm font-sans text-[0.95rem] leading-relaxed text-[#4f6468] lg:pb-1"
          >
            {description}
          </p>
        </div>

        <div data-gallery-grid className="practice-gallery-grid">
          {items.map((item, idx) => {
            const isWide = item.layoutSpan === 'wide' || idx === 0 || idx === 3
            return (
              <button
                key={item.id || `${item.category}-${idx}`}
                type="button"
                data-gallery-tile
                onClick={() => openItem(item)}
                className={cn(
                  'practice-gallery-tile group',
                  isWide ? 'practice-gallery-tile--wide' : 'practice-gallery-tile--standard',
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={88}
                  className="practice-gallery-img"
                  sizes={isWide ? '(max-width:768px) 100vw, 58vw' : '(max-width:768px) 100vw, 42vw'}
                />
                <div className="practice-gallery-scrim" aria-hidden="true" />
                <div className="practice-gallery-meta">
                  <span className="practice-gallery-tag">{item.category}</span>
                  <p className="practice-gallery-caption">{item.caption}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Container>

      <dialog
        ref={dialogRef}
        className="practice-lightbox"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox()
        }}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="relative">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Bildansicht schliessen"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75"
            >
              ✕
            </button>
            <div className="relative aspect-[16/10] w-full bg-[#0a1b1f]">
              <Image
                src={selected.src}
                alt={selected.alt}
                fill
                quality={92}
                className="object-cover"
                sizes="90vw"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
              <span className="practice-gallery-tag">{selected.category}</span>
              <p className="m-0 font-sans text-sm text-white/90">{selected.caption}</p>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
