import type { ReactNode } from 'react'

import { Divider } from '@/design-system/components/Divider'
import { Text } from '@/design-system/components/Text'
import { cn } from '@/design-system/lib/cn'

type SiteFooterBarProps = {
  brand: ReactNode
  columns?: ReactNode
  meta?: ReactNode
  className?: string
}

/** Footer composition primitive for design-system review and site shell. */
export function SiteFooterBar({ brand, columns, meta, className }: SiteFooterBarProps) {
  return (
    <footer className={cn('border-t border-[var(--color-border)] bg-[var(--palatty-wood)] text-[var(--palatty-snow)]', className)}>
      <div className="mx-auto max-w-[var(--container-xl)] px-[var(--container-pad)] py-[var(--section-y-tight)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="font-sans text-[length:var(--text-2xl)] font-semibold tracking-[var(--tracking-display)]">
            {brand}
          </div>
          {columns ? <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{columns}</div> : null}
        </div>
        <Divider className="my-8 border-[color-mix(in_oklab,var(--palatty-snow)_18%,transparent)]" />
        <Text size="xs" tone="inverse" className="opacity-75">
          {meta}
        </Text>
      </div>
    </footer>
  )
}
