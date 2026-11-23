import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type ProseProps = {
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>

/**
 * Editorial rich-text wrapper for Lexical / CMS HTML. Keeps long-form content
 * aligned with Alpine Modernism typography without inventing page layouts.
 */
export function Prose({ children, className, ...rest }: ProseProps) {
  return (
    <div
      className={cn(
        'max-w-[68ch] font-sans text-[length:var(--text-base)] leading-[var(--leading-relaxed)] text-[var(--color-fg)]',
        '[&_a]:font-medium [&_a]:text-[var(--color-accent)] [&_a]:underline-offset-[0.18em]',
        '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[length:var(--text-2xl)] [&_h2]:leading-[var(--leading-tight)]',
        '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-[length:var(--text-xl)]',
        '[&_p]:mt-4 [&_p]:text-pretty',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mt-1.5',
        '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--palatty-fir)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--color-fg-muted)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
