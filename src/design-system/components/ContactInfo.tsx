import type { ReactNode } from 'react'

import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'

type ContactInfoProps = {
  title?: string
  address?: ReactNode
  phone?: string
  email?: string
  className?: string
}

/** Compact contact stack for footers and contact bands. CMS-driven values only. */
export function ContactInfo({
  title = 'Kontakt',
  address,
  phone,
  email,
  className,
}: ContactInfoProps) {
  return (
    <address className={cn('not-italic', className)}>
      <Text size="sm" className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase">
        {title}
      </Text>
      <div className="flex flex-col gap-2">
        {address ? (
          <Text size="sm" tone="muted">
            {address}
          </Text>
        ) : null}
        {phone ? (
          <Text size="sm">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-medium no-underline hover:underline">
              {phone}
            </a>
          </Text>
        ) : null}
        {email ? (
          <Text size="sm">
            <a href={`mailto:${email}`} className="no-underline hover:underline">
              {email}
            </a>
          </Text>
        ) : null}
      </div>
    </address>
  )
}
