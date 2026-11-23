import type { ReactNode } from 'react'

import { Badge } from '@/design-system/components/Badge'
import { Heading } from '@/design-system/components/Heading'
import { Surface } from '@/design-system/components/Surface'
import { Text } from '@/design-system/components/Text'
import { TextLink } from '@/design-system/components/TextLink'
import { cn } from '@/design-system/lib/cn'

type LocationCardProps = {
  name: string
  locality: string
  address?: ReactNode
  phone?: string
  href?: string
  active?: boolean
  className?: string
}

/**
 * Location switcher / contact teaser. Shared brand system — content differs by CMS location.
 */
export function LocationCard({
  name,
  locality,
  address,
  phone,
  href,
  active = false,
  className,
}: LocationCardProps) {
  return (
    <Surface
      tone={active ? 'fir' : 'snow'}
      bordered={!active}
      padding="md"
      className={cn('flex h-full flex-col gap-3', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <Heading level={4} as="h3" tone={active ? 'inverse' : 'default'}>
          {locality}
        </Heading>
        {active ? <Badge tone="glacier">Aktuell</Badge> : null}
      </div>
      <Text size="sm" tone={active ? 'inverse' : 'muted'} className="font-medium">
        {name}
      </Text>
      {address ? (
        <Text size="sm" tone={active ? 'inverse' : 'muted'}>
          {address}
        </Text>
      ) : null}
      {phone ? (
        <Text size="sm" tone={active ? 'inverse' : 'default'} className="font-medium">
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="no-underline hover:underline">
            {phone}
          </a>
        </Text>
      ) : null}
      {href ? (
        <TextLink
          href={href}
          className={cn(
            'mt-auto pt-2 font-medium no-underline hover:underline',
            active && 'text-[var(--palatty-snow)]',
          )}
        >
          Praxis öffnen <span aria-hidden>↗</span>
        </TextLink>
      ) : null}
    </Surface>
  )
}
