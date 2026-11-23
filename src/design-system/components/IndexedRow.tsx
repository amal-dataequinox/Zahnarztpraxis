import type { ReactNode } from 'react'

import { TextLink } from '@/design-system/components/TextLink'
import { cn } from '@/design-system/lib/cn'

type IndexedRowProps = {
  index: string
  title: string
  summary?: ReactNode
  href?: string
  linkLabel?: string
  className?: string
}

/** Schriftbau service/list row — hairline, not a card. Stacks on narrow screens. */
export function IndexedRow({
  index,
  title,
  summary,
  href,
  linkLabel = 'Mehr',
  className,
}: IndexedRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2 border-b border-[var(--color-border-strong)] py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-4',
        className,
      )}
    >
      <span className="font-sans text-[length:var(--text-sm)] tabular-nums text-[var(--palatty-slate)]">
        {index}
      </span>
      <div className="min-w-0">
        <p className="m-0 break-words font-sans text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)] text-[var(--palatty-ink)]">
          {title}
        </p>
        {summary ? (
          <p className="mt-2 m-0 max-w-[var(--measure-prose)] break-words font-sans text-[length:var(--text-sm)] text-[var(--palatty-slate)]">
            {summary}
          </p>
        ) : null}
        {href ? (
          <TextLink
            href={href}
            className="mt-2 inline-flex min-h-11 items-center font-medium no-underline hover:underline sm:hidden"
          >
            {linkLabel} <span aria-hidden>→</span>
          </TextLink>
        ) : null}
      </div>
      {href ? (
        <TextLink
          href={href}
          className="hidden min-h-11 shrink-0 items-center font-medium no-underline hover:underline sm:inline-flex"
        >
          {linkLabel} <span aria-hidden>→</span>
        </TextLink>
      ) : null}
    </div>
  )
}
