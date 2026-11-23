import type { ReactNode } from 'react'

import { TextLink } from '@/design-system/components/TextLink'
import { cn } from '@/design-system/lib/cn'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Brotkrumen" className={cn('font-sans text-[length:var(--text-sm)]', className)}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-[var(--color-fg-muted)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          let content: ReactNode

          if (item.href && !isLast) {
            content = (
              <TextLink href={item.href} tone="muted" className="no-underline hover:underline">
                {item.label}
              </TextLink>
            )
          } else {
            content = (
              <span
                className={isLast ? 'font-medium text-[var(--color-fg)]' : undefined}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )
          }

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-[var(--color-fg-subtle)]">
                  /
                </span>
              ) : null}
              {content}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
