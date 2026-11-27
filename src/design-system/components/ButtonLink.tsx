import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { buttonClassName, type ButtonSize, type ButtonVariant } from './Button'

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  newTab?: boolean
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

/** Next.js link styled as a Button — preferred for CTAs that navigate. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  newTab,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const external = href.startsWith('http') || newTab

  if (external) {
    return (
      <a
        href={href}
        className={buttonClassName({ variant, size, className })}
        target={newTab || href.startsWith('http') ? '_blank' : undefined}
        rel={newTab || href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      prefetch={prefetch ?? (href.startsWith('/') ? true : undefined)}
      className={buttonClassName({ variant, size, className })}
      {...rest}
    >
      {children}
    </Link>
  )
}
