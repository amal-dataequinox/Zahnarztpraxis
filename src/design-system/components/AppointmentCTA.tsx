import type { ReactNode } from 'react'

import { ButtonLink } from '@/design-system/components/ButtonLink'
import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'

type AppointmentCTAProps = {
  href: string
  label?: string
  supporting?: ReactNode
  variant?: 'primary' | 'inverse'
  className?: string
}

/**
 * Primary booking prompt. Location-specific URLs come from CMS — never hardcode.
 */
export function AppointmentCTA({
  href,
  label = 'Termin vereinbaren',
  supporting,
  variant = 'primary',
  className,
}: AppointmentCTAProps) {
  return (
    <div className={cn('flex flex-col items-start gap-3 sm:flex-row sm:items-center', className)}>
      <ButtonLink href={href} size="lg" variant={variant === 'inverse' ? 'inverse' : 'primary'}>
        {label}
        <span aria-hidden className="text-[1.05em] leading-none">
          ↗
        </span>
      </ButtonLink>
      {supporting ? (
        <Text size="sm" tone={variant === 'inverse' ? 'inverse' : 'muted'}>
          {supporting}
        </Text>
      ) : null}
    </div>
  )
}
