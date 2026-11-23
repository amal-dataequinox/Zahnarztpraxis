import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type SectionTone = 'chalk' | 'snow' | 'fir' | 'glacier' | 'transparent'
type SectionSpacing = 'default' | 'tight' | 'none'

const toneClass: Record<SectionTone, string> = {
  chalk: 'surface-chalk',
  snow: 'surface-snow',
  fir: 'surface-fir',
  glacier: 'surface-glacier',
  transparent: '',
}

const spacingClass: Record<SectionSpacing, string> = {
  default: 'py-[var(--section-y)]',
  tight: 'py-[var(--section-y-tight)]',
  none: '',
}

type SectionProps<T extends ElementType = 'section'> = {
  as?: T
  tone?: SectionTone
  spacing?: SectionSpacing
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>

export function Section<T extends ElementType = 'section'>({
  as,
  tone = 'transparent',
  spacing = 'default',
  children,
  className,
  ...rest
}: SectionProps<T>) {
  const Comp = as ?? 'section'

  return (
    <Comp className={cn(toneClass[tone], spacingClass[spacing], className)} {...rest}>
      {children}
    </Comp>
  )
}
