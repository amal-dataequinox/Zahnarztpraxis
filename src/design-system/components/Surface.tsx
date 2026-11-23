import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type SurfaceTone = 'snow' | 'paper' | 'wood' | 'navy'
type SurfacePadding = 'none' | 'sm' | 'md' | 'lg'

const toneClass: Record<SurfaceTone, string> = {
  snow: 'bg-[var(--palatty-snow)] text-[var(--palatty-ink)]',
  paper: 'bg-[var(--palatty-paper)] text-[var(--palatty-ink)]',
  wood: 'bg-[var(--palatty-wood)] text-[var(--palatty-snow)]',
  navy: 'bg-[var(--palatty-navy)] text-[var(--palatty-snow)]',
}

const paddingClass: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6 md:p-8',
  lg: 'p-8 md:p-10',
}

type SurfaceProps = {
  tone?: SurfaceTone | 'chalk' | 'fir' | 'glacier'
  padding?: SurfacePadding
  bordered?: boolean
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>

function mapTone(tone: SurfaceProps['tone']): SurfaceTone {
  if (tone === 'chalk' || tone === 'glacier') return 'paper'
  if (tone === 'fir') return 'wood'
  return tone ?? 'snow'
}

/** Prefer hairlines over card chrome. Use only when a boundary clarifies interaction. */
export function Surface({
  tone = 'snow',
  padding = 'md',
  bordered = false,
  children,
  className,
  ...rest
}: SurfaceProps) {
  const resolved = mapTone(tone)

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)]',
        toneClass[resolved],
        paddingClass[padding],
        bordered && 'ring-1 ring-[var(--color-border)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
