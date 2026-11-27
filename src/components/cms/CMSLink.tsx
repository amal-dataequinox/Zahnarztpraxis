import Link from 'next/link'
import React from 'react'

import { ButtonLink, TextLink } from '@/design-system'
import type { ButtonSize, ButtonVariant } from '@/design-system'
import { cn } from '@/design-system/lib/cn'
import { resolveCMSLink } from '@/utilities/cmsLink'

type LinkData = Parameters<typeof resolveCMSLink>[0]

type CMSLinkProps = {
  link: LinkData
  appearance?: 'text' | 'button'
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function CMSLink({
  link,
  appearance = 'text',
  variant = 'primary',
  size = 'md',
  className,
}: CMSLinkProps) {
  const resolved = resolveCMSLink(link)
  if (!resolved) return null

  if (appearance === 'button') {
    return (
      <ButtonLink
        href={resolved.href}
        newTab={resolved.newTab}
        variant={variant}
        size={size}
        className={className}
      >
        {resolved.label}
      </ButtonLink>
    )
  }

  const external = resolved.href.startsWith('http') || resolved.newTab

  if (external) {
    return (
      <TextLink
        href={resolved.href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {resolved.label}
      </TextLink>
    )
  }

  return (
    <Link
      href={resolved.href}
      prefetch={resolved.href.startsWith('/') ? true : undefined}
      className={cn(
        'font-sans font-medium text-[var(--color-accent)] underline-offset-[0.18em] transition-colors hover:underline',
        className,
      )}
    >
      {resolved.label}
    </Link>
  )
}
