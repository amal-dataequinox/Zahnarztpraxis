'use client'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { cn } from '@/design-system/lib/cn'

type MotionControlProps = {
  className?: string
}

/**
 * Dairy Food–inspired visible pause/resume for ambient Alpine motion.
 * Hidden when prefers-reduced-motion (already static).
 */
export function MotionControl({ className }: MotionControlProps) {
  const { reduceMotion, userPaused, togglePaused } = useMotionPreference()

  if (reduceMotion) return null

  return (
    <button
      type="button"
      className={cn(
        'fixed bottom-4 right-4 z-[var(--z-toast)] inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)]',
        'bg-[color-mix(in_oklab,var(--palatty-paper)_92%,transparent)] px-3.5 py-2',
        'font-sans text-[length:var(--text-xs)] font-medium tracking-[var(--tracking-wide)] text-[var(--palatty-ink)]',
        'ring-1 ring-inset ring-[var(--color-border-strong)] backdrop-blur-sm',
        'transition-[background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]',
        'hover:bg-[var(--palatty-snow)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
        className,
      )}
      aria-pressed={userPaused}
      aria-label={userPaused ? 'Bewegung fortsetzen' : 'Bewegung pausieren'}
      onClick={togglePaused}
    >
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          userPaused ? 'bg-[var(--palatty-slate)]' : 'bg-[var(--palatty-cyan-deep)]',
        )}
        aria-hidden
      />
      {userPaused ? 'Bewegung fortsetzen' : 'Bewegung pausieren'}
    </button>
  )
}
