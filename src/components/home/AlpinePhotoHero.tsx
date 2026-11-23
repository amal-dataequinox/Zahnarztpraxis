'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { cn } from '@/design-system/lib/cn'

type AlpinePhotoHeroProps = {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

const POINTER_MAX_PX = 10
const MOBILE_MQ = '(max-width: 767px)'

/**
 * Hybrid photoreal Alpine hero — primary photographic read + lightweight
 * atmospheric depth. Pauseable via MotionProvider; static under reduced-motion.
 */
export function AlpinePhotoHero({ src, alt, priority = true, className }: AlpinePhotoHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerAllowed = useRef(false)
  const [inView, setInView] = useState(true)
  const { motionPaused, reduceMotion } = useMotionPreference()

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ)

    const sync = () => {
      pointerAllowed.current = !reduceMotion && !motionPaused && !mobile.matches
      if (!pointerAllowed.current && stageRef.current) {
        stageRef.current.style.setProperty('--ax-parallax-x', '0px')
        stageRef.current.style.setProperty('--ax-parallax-y', '0px')
      }
    }

    sync()
    mobile.addEventListener('change', sync)
    return () => mobile.removeEventListener('change', sync)
  }, [reduceMotion, motionPaused])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.05, rootMargin: '12% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerAllowed.current || !stageRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    stageRef.current.style.setProperty('--ax-parallax-x', `${(nx * POINTER_MAX_PX).toFixed(2)}px`)
    stageRef.current.style.setProperty(
      '--ax-parallax-y',
      `${(ny * POINTER_MAX_PX * 0.55).toFixed(2)}px`,
    )
  }

  const onPointerLeave = () => {
    if (!stageRef.current) return
    stageRef.current.style.setProperty('--ax-parallax-x', '0px')
    stageRef.current.style.setProperty('--ax-parallax-y', '0px')
  }

  const ambientPaused = motionPaused || !inView

  return (
    <div
      ref={rootRef}
      className={cn(
        'appenzell-alpine relative h-full min-h-[inherit] w-full overflow-hidden',
        ambientPaused && 'is-paused',
        className,
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={stageRef} className="appenzell-alpine__stage">
        <div
          className="appenzell-alpine__bg"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: '62% 38%',
            filter: 'saturate(0.92) brightness(1.03)',
          }}
          aria-hidden
        />
        <div className="appenzell-alpine__mid">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover object-[62%_42%]"
            sizes="(max-width:1024px) 100vw, 58vw"
          />
        </div>
        <div className="appenzell-alpine__clouds" aria-hidden />
        <div className="appenzell-alpine__mist" aria-hidden />
        <div className="appenzell-alpine__fg" aria-hidden />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,var(--palatty-paper)_0%,color-mix(in_oklab,var(--palatty-paper)_72%,transparent)_18%,color-mix(in_oklab,var(--palatty-paper)_28%,transparent)_38%,transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--palatty-paper)_35%,transparent))] lg:hidden"
        aria-hidden
      />
    </div>
  )
}
