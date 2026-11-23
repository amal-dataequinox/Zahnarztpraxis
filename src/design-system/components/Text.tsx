import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type TextTone = 'default' | 'muted' | 'subtle' | 'inverse' | 'accent'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

const toneClass: Record<TextTone, string> = {
  default: 'text-[var(--color-fg)]',
  muted: 'text-[var(--color-fg-muted)]',
  subtle: 'text-[var(--color-fg-subtle)]',
  inverse: 'text-[var(--color-fg-inverse)]',
  accent: 'text-[var(--color-accent)]',
}

const sizeClass: Record<TextSize, string> = {
  xs: 'text-[length:var(--text-xs)] leading-[var(--leading-normal)]',
  sm: 'text-[length:var(--text-sm)] leading-[var(--leading-normal)]',
  base: 'text-[length:var(--text-base)] leading-[var(--leading-normal)]',
  lg: 'text-[length:var(--text-lg)] leading-[var(--leading-relaxed)]',
  xl: 'text-[length:var(--text-xl)] leading-[var(--leading-snug)]',
}

type TextProps<T extends ElementType = 'p'> = {
  as?: T
  size?: TextSize
  tone?: TextTone
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>

export function Text<T extends ElementType = 'p'>({
  as,
  size = 'base',
  tone = 'default',
  children,
  className,
  ...rest
}: TextProps<T>) {
  const Comp = as ?? 'p'
  return (
    <Comp
      className={cn(
        'min-w-0 max-w-full font-sans font-normal text-pretty break-words',
        sizeClass[size],
        toneClass[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

type EyebrowProps = {
  children: ReactNode
  className?: string
  tone?: TextTone
}

/** Small uppercase label used sparingly above section titles. */
export function Eyebrow({ children, className, tone = 'muted' }: EyebrowProps) {
  return (
    <p
      className={cn(
        'min-w-0 max-w-full font-sans text-[length:var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)]',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </p>
  )
}

type LeadProps = {
  children: ReactNode
  className?: string
  tone?: TextTone
}

/** Supporting lead paragraph under a headline. */
export function Lead({ children, className, tone = 'muted' }: LeadProps) {
  return (
    <p
      className={cn(
        'min-w-0 max-w-full font-sans text-[length:clamp(1.05rem,2.8vw,var(--text-lg))] leading-[var(--leading-relaxed)] text-pretty break-words',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </p>
  )
}
