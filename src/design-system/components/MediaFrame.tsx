import type { ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type Aspect = 'photo' | 'square' | 'portrait' | 'wide' | 'auto'

const aspectClass: Record<Aspect, string> = {
  photo: 'aspect-[3/2]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: '',
}

type MediaFrameProps = {
  children: ReactNode
  caption?: string
  aspect?: Aspect
  className?: string
  /** Soft alpine wash behind / around the frame — not a decorative sticker overlay. */
  tone?: 'plain' | 'limestone' | 'fir'
}

/**
 * Frame for authentic photography. Prefer real client images; never invent people
 * or practice interiors. Captions are semantic `<figcaption>` content.
 */
export function MediaFrame({
  children,
  caption,
  aspect = 'photo',
  className,
  tone = 'plain',
}: MediaFrameProps) {
  return (
    <figure className={cn('m-0', className)}>
      <div
        className={cn(
          'overflow-hidden rounded-[var(--radius-sm)]',
          aspectClass[aspect],
          tone === 'limestone' && 'bg-[var(--palatty-limestone)]',
          tone === 'fir' && 'bg-[var(--palatty-fir-deep)]',
          tone === 'plain' && 'bg-[var(--palatty-limestone)]',
        )}
      >
        <div className={cn(aspect === 'auto' ? '' : 'h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover')}>
          {children}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 font-sans text-[length:var(--text-sm)] text-[var(--color-fg-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
