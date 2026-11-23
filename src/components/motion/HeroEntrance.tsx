'use client'

import gsap from 'gsap'
import { useLayoutEffect, useRef, type ReactNode } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { cn } from '@/design-system/lib/cn'

type HeroEntranceProps = {
  children: ReactNode
  className?: string
  mediaSelector?: string
}

/**
 * GSAP staggered hero entrance — label → heading → lead → CTA.
 * Cleanup forces a visible final state so React Strict Mode remounts
 * never leave the hero stuck at opacity 0.
 */
export function HeroEntrance({
  children,
  className,
  mediaSelector = '.appenzell-hero-media',
}: HeroEntranceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { reduceMotion } = useMotionPreference()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduceMotion) return

    const items = root.querySelectorAll<HTMLElement>('[data-ax-enter]')
    if (!items.length) return

    const media = mediaSelector
      ? (root.closest('.appenzell-home')?.querySelector(mediaSelector) as HTMLElement | null)
      : null

    const showFinal = () => {
      gsap.set(items, { opacity: 1, y: 0 })
      if (media) gsap.set(media, { opacity: 1, scale: 1 })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.fromTo(
        items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, stagger: { each: 0.12, from: 'start' } },
      )
      if (media) {
        tl.fromTo(
          media,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'power1.inOut', transformOrigin: '60% 45%' },
          0.18,
        )
      }
    }, root)

    return () => {
      ctx.revert()
      showFinal()
    }
  }, [reduceMotion, mediaSelector])

  return (
    <div ref={rootRef} className={cn('appenzell-hero-entrance', className)}>
      {children}
    </div>
  )
}
