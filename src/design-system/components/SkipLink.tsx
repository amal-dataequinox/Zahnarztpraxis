import { cn } from '@/design-system/lib/cn'

type SkipLinkProps = {
  href?: string
  label?: string
  className?: string
}

export function SkipLink({
  href = '#main',
  label = 'Zum Inhalt springen',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50',
        'rounded-[var(--radius-md)] bg-[var(--palatty-fir)] px-4 py-2 font-sans text-sm font-medium text-[var(--palatty-snow)]',
        className,
      )}
    >
      {label}
    </a>
  )
}
