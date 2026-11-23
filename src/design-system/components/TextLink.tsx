import type { AnchorHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type TextLinkProps = {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' | 'inverse' | 'muted'
  underline?: 'always' | 'hover' | 'none'
} & AnchorHTMLAttributes<HTMLAnchorElement>

const toneClass = {
  default: 'text-[var(--color-fg)]',
  accent: 'text-[var(--palatty-cyan-deep)]',
  inverse: 'text-[var(--color-fg-inverse)]',
  muted: 'text-[var(--color-fg-muted)]',
} as const

const underlineClass = {
  always: 'underline',
  hover: 'no-underline hover:underline',
  none: 'no-underline',
} as const

export function TextLink({
  children,
  className,
  tone = 'accent',
  underline = 'hover',
  ...rest
}: TextLinkProps) {
  return (
    <a
      className={cn(
        'font-sans font-medium underline-offset-[0.18em] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
        toneClass[tone],
        underlineClass[underline],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}
