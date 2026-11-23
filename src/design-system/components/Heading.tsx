import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTone = 'default' | 'inverse' | 'accent'

const levelClass: Record<HeadingLevel, string> = {
  /* Mobile-first floors stay readable but leave room to wrap long DE compounds */
  1: 'text-[length:clamp(1.85rem,7.5vw,var(--text-6xl))]',
  2: 'text-[length:clamp(1.5rem,5vw,var(--text-4xl))]',
  3: 'text-[length:clamp(1.25rem,3.5vw,var(--text-2xl))]',
  4: 'text-[length:clamp(1.125rem,2.5vw,var(--text-xl))]',
  5: 'text-[length:var(--text-lg)] tracking-[var(--tracking-tight)]',
  6: 'text-[length:var(--text-base)] tracking-[var(--tracking-tight)]',
}

const toneClass: Record<HeadingTone, string> = {
  default: 'text-[var(--color-fg)]',
  inverse: 'text-[var(--color-fg-inverse)]',
  accent: 'text-[var(--color-accent)]',
}

type HeadingProps = {
  level?: HeadingLevel
  as?: ElementType
  tone?: HeadingTone
  /** Light 300 for large editorial lines — use only when specimens justify it. */
  editorial?: boolean
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'>

/**
 * Weight roles: SemiBold 600 for H1–H4; Medium 500 for H5–H6;
 * optional Light 300 via `editorial` on large display lines.
 */
export function Heading({
  level = 2,
  as,
  tone = 'default',
  editorial = false,
  children,
  className,
  ...rest
}: HeadingProps) {
  const Comp = (as ?? (`h${level}` as ElementType)) as ElementType
  const weightClass = editorial
    ? 'font-light'
    : level >= 5
      ? 'font-medium'
      : 'font-semibold'

  return (
    <Comp
      className={cn(
        'min-w-0 max-w-full font-sans leading-[var(--leading-tight)] tracking-[var(--tracking-display)] text-balance break-words',
        weightClass,
        levelClass[level],
        toneClass[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
