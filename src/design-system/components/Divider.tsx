import { cn } from '@/design-system/lib/cn'

type DividerProps = {
  className?: string
  label?: string
}

export function Divider({ className, label }: DividerProps) {
  if (!label) {
    return <hr className={cn('border-0 border-t border-[var(--color-border)]', className)} />
  }

  return (
    <div className={cn('flex items-center gap-4', className)} role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="font-sans text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-wide)] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  )
}
