'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'

gsap.registerPlugin(ScrollTrigger)

type AlpineScrollBridgeProps = {
  heroId?: string
  nextId?: string
}

/**
 * Subtle scroll-linked depth on Alpine layers from hero into the next section.
 * No pin / no scroll hijack — light scrub on transform only.
 */
export function AlpineScrollBridge({
  heroId = 'hero',
  nextId = 'praxis',
}: AlpineScrollBridgeProps) {
  const { motionPaused, reduceMotion } = useMotionPreference()
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    if (reduceMotion) return

    const hero = document.getElementById(heroId)
    const next = document.getElementById(nextId)
    const bg = hero?.querySelector('.appenzell-alpine__bg') as HTMLElement | null
    const mid = hero?.querySelector('.appenzell-alpine__mid') as HTMLElement | null
    const fg = hero?.querySelector('.appenzell-alpine__fg') as HTMLElement | null
    const mist = hero?.querySelector('.appenzell-alpine__mist') as HTMLElement | null

    if (!hero || !next) return

    const base = {
      trigger: hero,
      start: 'top top',
      endTrigger: next,
      end: 'top 40%',
      scrub: 0.6,
    } as const

    const tweens = [
      bg && gsap.to(bg, { y: -20, ease: 'none', scrollTrigger: { ...base } }),
      mid && gsap.to(mid, { y: -12, ease: 'none', scrollTrigger: { ...base } }),
      mist && gsap.to(mist, { y: -8, opacity: 0.25, ease: 'none', scrollTrigger: { ...base } }),
      fg && gsap.to(fg, { y: -6, ease: 'none', scrollTrigger: { ...base } }),
    ].filter(Boolean) as gsap.core.Tween[]

    triggersRef.current = tweens
      .map((t) => t.scrollTrigger)
      .filter(Boolean) as ScrollTrigger[]

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
      triggersRef.current = []
    }
  }, [heroId, nextId, reduceMotion])

  useEffect(() => {
    for (const st of triggersRef.current) {
      if (motionPaused) st.disable(false)
      else st.enable()
    }
  }, [motionPaused])

  return null
}
