import type { ReactNode } from 'react'

import { Heading } from '@/design-system/components/Heading'
import { Text } from '@/design-system/components/Text'
import { TextLink } from '@/design-system/components/TextLink'
import { cn } from '@/design-system/lib/cn'

type ServiceCardProps = {
  title: string
  summary?: ReactNode
  href?: string
  linkLabel?: string
  className?: string
}

/**
 * Editorial service teaser — flat surface, not a heavy card chrome default.
 */
export function ServiceCard({
  title,
  summary,
  href,
  linkLabel = 'Mehr erfahren',
  className,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col gap-3 border-t border-[var(--color-border-strong)] pt-5',
        className,
      )}
    >
      <Heading level={4} as="h3">
        {title}
      </Heading>
      {summary ? (
        <Text size="sm" tone="muted" className="flex-1">
          {summary}
        </Text>
      ) : null}
      {href ? (
        <TextLink href={href} className="mt-2 font-medium no-underline hover:underline">
          {linkLabel} <span aria-hidden>↗</span>
        </TextLink>
      ) : null}
    </article>
  )
}
