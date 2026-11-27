import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--palatty-cyan-deep)] text-[var(--color-accent-text,var(--palatty-snow))] hover:bg-[var(--palatty-cyan)] active:bg-[var(--palatty-cyan-deep)]',
  secondary:
    'bg-transparent text-[var(--palatty-ink)] ring-1 ring-inset ring-[var(--palatty-ink)] hover:bg-[color-mix(in_oklab,var(--palatty-ink)_4%,transparent)]',
  ghost:
    'bg-transparent text-[var(--color-fg)] hover:bg-[color-mix(in_oklab,var(--palatty-ink)_5%,transparent)]',
  inverse:
    'bg-[var(--palatty-snow)] text-[var(--palatty-navy)] hover:bg-[var(--palatty-paper)]',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 text-[length:var(--text-sm)]',
  md: 'min-h-11 px-5 text-[length:var(--text-sm)]',
  lg: 'min-h-12 px-6 text-[length:var(--text-base)]',
}

export const buttonClassName = ({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-sans font-medium tracking-[-0.01em]',
    'transition-[background-color,color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'disabled:pointer-events-none disabled:opacity-45',
    variantClass[variant],
    sizeClass[size],
    className,
  )

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}
