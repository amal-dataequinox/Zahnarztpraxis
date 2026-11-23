import type { ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type BadgeTone = 'ink' | 'cyan' | 'appenzell' | 'gais' | 'success' | 'warning' | 'danger' | 'info'

const toneClass: Record<BadgeTone, string> = {
  ink: 'ring-1 ring-[var(--palatty-ink)] text-[var(--palatty-ink)]',
  cyan: 'ring-1 ring-[var(--palatty-cyan)] text-[var(--palatty-cyan-deep)]',
  appenzell: 'ring-1 ring-[var(--accent-appenzell)] text-[var(--accent-appenzell)]',
  gais: 'ring-1 ring-[var(--accent-gais)] text-[var(--accent-gais)]',
  success: 'bg-[var(--palatty-success-soft)] text-[var(--palatty-success)]',
  warning: 'bg-[var(--palatty-warning-soft)] text-[var(--palatty-warning)]',
  danger: 'bg-[var(--palatty-danger-soft)] text-[var(--palatty-danger)]',
  info: 'bg-[var(--palatty-info-soft)] text-[var(--palatty-info)]',
}

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone | 'fir' | 'glacier' | 'sage' | 'stone'
  className?: string
}

function mapTone(tone: BadgeProps['tone']): BadgeTone {
  if (tone === 'fir' || tone === 'stone') return 'ink'
  if (tone === 'glacier' || tone === 'sage') return 'cyan'
  return tone ?? 'ink'
}

/** Rare status label — square outline preferred over soft wellness pills. */
export function Badge({ children, tone = 'ink', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-[var(--radius-sm)] px-2 py-0.5 font-sans text-[length:var(--text-xs)] font-medium tracking-[0.04em] break-words',
        toneClass[mapTone(tone)],
        className,
      )}
    >
      {children}
    </span>
  )
}
