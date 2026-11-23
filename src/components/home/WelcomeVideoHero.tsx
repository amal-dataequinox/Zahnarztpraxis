'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { cn } from '@/design-system/lib/cn'

type WelcomeVideoHeroProps = {
  src: string
  poster: string
  alt: string
  mimeType?: string | null
  /** Full-viewport alpine fill vs inset editorial media. */
  variant?: 'inset' | 'fullBleed'
  className?: string
}

/**
 * Looping hero video — muted autoplay, pauses with MotionControl /
 * off-screen / reduced-motion (poster only).
 */
export function WelcomeVideoHero({
  src,
  poster,
  alt,
  mimeType = 'video/mp4',
  variant = 'inset',
  className,
}: WelcomeVideoHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(true)
  const { motionPaused, reduceMotion } = useMotionPreference()
  const fullBleed = variant === 'fullBleed'

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.08, rootMargin: '8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion) return

    if (motionPaused || !inView) {
      video.pause()
      return
    }

    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {
        /* Autoplay can be blocked; poster remains visible via video poster. */
      })
    }
  }, [inView, motionPaused, reduceMotion])

  return (
    <div
      ref={rootRef}
      className={cn(
        'appenzell-welcome-video relative overflow-hidden',
        fullBleed ? 'absolute inset-0 h-full w-full' : 'h-full min-h-[inherit] w-full',
        className,
      )}
    >
      {reduceMotion ? (
        <Image
          src={poster}
          alt={alt}
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={alt}
        >
          <source src={src} type={mimeType || 'video/mp4'} />
        </video>
      )}

      {fullBleed ? (
        <>
          {/* Soft mid-left readability where hero copy sits */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(100deg,color-mix(in_oklab,var(--palatty-paper)_55%,transparent)_0%,color-mix(in_oklab,var(--palatty-paper)_38%,transparent)_34%,color-mix(in_oklab,var(--palatty-paper)_12%,transparent)_58%,transparent_78%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--palatty-paper)_55%,transparent))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--palatty-paper)_35%,transparent),transparent)]"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,var(--palatty-paper)_0%,color-mix(in_oklab,var(--palatty-paper)_72%,transparent)_18%,color-mix(in_oklab,var(--palatty-paper)_28%,transparent)_38%,transparent_58%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--palatty-paper)_35%,transparent))] lg:hidden"
            aria-hidden
          />
        </>
      )}
    </div>
  )
}
