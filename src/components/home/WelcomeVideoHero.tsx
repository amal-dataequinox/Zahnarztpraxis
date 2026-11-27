'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import type Hls from 'hls.js'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { cn } from '@/design-system/lib/cn'
import { resolveVideoSource } from '@/utilities/videoSource'

type WelcomeVideoHeroProps = {
  src?: string | null
  hlsUrl?: string | null
  mediaType?: string | null
  poster: string
  alt: string
  mimeType?: string | null
  backgroundType?: 'media' | 'color' | 'gradient' | string | null
  backgroundColor?: string | null
  backgroundGradient?: string | null
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  /** Full-viewport alpine fill vs inset editorial media. */
  variant?: 'inset' | 'fullBleed'
  className?: string
}

/**
 * Hero media / HLS adaptive video player (DEQX hls.js pattern).
 * Supports HLS (.m3u8), MP4/WebM, high-res images, solid colors, and CSS gradients.
 * Keeps poster cover visible until first decoded frame renders cleanly.
 */
export function WelcomeVideoHero({
  src,
  hlsUrl,
  mediaType,
  poster,
  alt,
  backgroundType = 'media',
  backgroundColor,
  backgroundGradient,
  autoPlay = true,
  loop = true,
  muted = true,
  variant = 'inset',
  className,
}: WelcomeVideoHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(true)
  const [frameReady, setFrameReady] = useState(false)
  const { motionPaused, reduceMotion } = useMotionPreference()
  const fullBleed = variant === 'fullBleed'

  const resolved = resolveVideoSource(src, hlsUrl, mediaType, poster)
  const videoSrc = resolved.videoSrc
  const isHls = resolved.isHls
  const isImage = backgroundType === 'media' && resolved.isImage
  const posterSrc = resolved.posterSrc || poster

  useEffect(() => {
    setFrameReady(false)
  }, [videoSrc, posterSrc])

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
    if (!video || !videoSrc || backgroundType !== 'media' || isImage || reduceMotion) return

    let disposed = false
    let player: Hls | undefined
    let frameCallback: number | undefined

    const reveal = () => {
      if (!disposed) setFrameReady(true)
    }

    if (typeof video.requestVideoFrameCallback === 'function') {
      frameCallback = video.requestVideoFrameCallback(reveal)
    } else {
      video.addEventListener('loadeddata', reveal, { once: true })
    }

    const play = () => {
      if (autoPlay && !motionPaused && inView && !disposed) {
        void video.play().catch(() => {
          /* Autoplay blocked — poster cover remains visible */
        })
      }
    }

    video.addEventListener('canplay', play)

    async function attach() {
      if (!isHls || video!.canPlayType('application/vnd.apple.mpegurl')) {
        video!.src = videoSrc!
      } else {
        const { default: HlsPlayer } = await import('hls.js')
        if (disposed || !HlsPlayer.isSupported()) return
        player = new HlsPlayer({
          capLevelToPlayerSize: true,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          startLevel: 0,
        })
        player.loadSource(videoSrc!)
        player.attachMedia(video!)
      }
    }

    void attach().catch((err) => {
      if (!disposed) console.error('Unable to load hero video stream:', err)
    })

    return () => {
      disposed = true
      if (frameCallback !== undefined && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(frameCallback)
      }
      video.removeEventListener('loadeddata', reveal)
      video.removeEventListener('canplay', play)
      player?.destroy()
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [videoSrc, isHls, isImage, backgroundType, autoPlay, reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion || isImage || backgroundType !== 'media') return

    if (motionPaused || !inView || !autoPlay) {
      video.pause()
      return
    }

    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
  }, [inView, motionPaused, reduceMotion, autoPlay, isImage, backgroundType])

  return (
    <div
      ref={rootRef}
      className={cn(
        'appenzell-welcome-video relative overflow-hidden',
        fullBleed ? 'absolute inset-0 h-full w-full' : 'h-full min-h-[inherit] w-full',
        className,
      )}
    >
      {backgroundType === 'color' ? (
        <div
          className="absolute inset-0 h-full w-full"
          style={{ backgroundColor: backgroundColor || '#0c1824' }}
          aria-hidden
        />
      ) : backgroundType === 'gradient' ? (
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background:
              backgroundGradient || 'linear-gradient(135deg, #0c1824 0%, #00a887 100%)',
          }}
          aria-hidden
        />
      ) : reduceMotion || isImage || !videoSrc ? (
        <Image
          src={isImage && src ? src : posterSrc}
          alt={alt}
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload={autoPlay ? 'auto' : 'metadata'}
            poster={posterSrc}
            aria-label={alt}
          />
          {posterSrc && autoPlay && !frameReady && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url(${JSON.stringify(posterSrc)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
        </>
      )}

      {fullBleed ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.72)_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.42)_35%,rgba(0,0,0,0.12)_60%,transparent_80%)]"
          aria-hidden
        />
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
