'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

import { cn } from '@/design-system/lib/cn'

import { AlpineSilhouetteFallback } from './AlpineSilhouetteFallback'

const AlpineSilhouetteScene = dynamic(
  () => import('./AlpineSilhouetteScene').then((mod) => mod.AlpineSilhouetteScene),
  { ssr: false, loading: () => <AlpineSilhouetteFallback /> },
)

const is3DEnabled = (): boolean => process.env.NEXT_PUBLIC_ENABLE_ALPINE_3D !== 'false'

type AlpineHeroAtmosphereProps = {
  className?: string
  /** When true, prefer CMS photography and keep 3D off. */
  preferPhotography?: boolean
}

/**
 * Homepage hero atmosphere for Distant Alpine silhouette.
 * Fills the media column (relative, full size). SVG first; WebGL when allowed.
 */
export function AlpineHeroAtmosphere({
  className,
  preferPhotography = false,
}: AlpineHeroAtmosphereProps) {
  const [mountCanvas, setMountCanvas] = useState(false)
  const [parallax, setParallax] = useState(false)

  useEffect(() => {
    if (preferPhotography || !is3DEnabled()) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const reduce = motionQuery.matches
      setParallax(!reduce)
      // Spec: reduced motion → SVG only, no canvas.
      setMountCanvas(!reduce)
    }

    apply()
    motionQuery.addEventListener('change', apply)
    return () => motionQuery.removeEventListener('change', apply)
  }, [preferPhotography])

  const useStaticOnly = preferPhotography || !is3DEnabled() || !mountCanvas

  return (
    <div
      className={cn('relative h-full w-full min-h-[inherit] overflow-hidden', className)}
      aria-hidden
    >
      {useStaticOnly ? (
        <AlpineSilhouetteFallback />
      ) : (
        <AlpineSilhouetteScene enableParallax={parallax} className="absolute inset-0 h-full w-full" />
      )}
      {/* Soft editorial veil so type stays readable in the clear zone */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,color-mix(in_oklab,var(--palatty-paper)_78%,transparent)_0%,color-mix(in_oklab,var(--palatty-paper)_35%,transparent)_42%,transparent_68%)]" />
    </div>
  )
}
