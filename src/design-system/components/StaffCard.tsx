import type { ReactNode } from 'react'

import { MediaFrame } from '@/design-system/components/MediaFrame'
import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'

type StaffCardProps = {
  /** Display name from CMS only — never invent identities. */
  name: string
  /** Role/title from CMS only. */
  role?: string
  image?: ReactNode
  href?: string
  className?: string
}

/**
 * Team grid unit. Image should be a studio or approved environmental portrait.
 */
export function StaffCard({ name, role, image, href, className }: StaffCardProps) {
  const body = (
    <>
      <MediaFrame aspect="square" className="mb-4">
        {image ?? (
          <div className="flex h-full min-h-40 items-end bg-[var(--palatty-limestone)] p-4">
            <Text size="xs" tone="muted">
              Portrait pending
            </Text>
          </div>
        )}
      </MediaFrame>
      <Text as="h3" size="base" className="font-semibold">
        {name}
      </Text>
      {role ? (
        <Text size="sm" tone="muted" className="mt-1">
          {role}
        </Text>
      ) : null}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'group block no-underline transition-opacity duration-[var(--duration-fast)] hover:opacity-90',
          className,
        )}
      >
        {body}
      </a>
    )
  }

  return <article className={cn(className)}>{body}</article>
}
