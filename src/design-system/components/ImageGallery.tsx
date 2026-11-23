import type { ReactNode } from 'react'

import { MediaFrame } from '@/design-system/components/MediaFrame'
import { cn } from '@/design-system/lib/cn'

export type GalleryItem = {
  id: string
  media: ReactNode
  caption?: string
  aspect?: 'photo' | 'square' | 'portrait' | 'wide'
}

type ImageGalleryProps = {
  items: GalleryItem[]
  columns?: 2 | 3
  className?: string
}

/**
 * Editorial gallery for approved practice photography. Prefer real assets; no fabricated scenes.
 */
export function ImageGallery({ items, columns = 2, className }: ImageGalleryProps) {
  return (
    <ul
      className={cn(
        'm-0 grid list-none gap-[var(--grid-gap)] p-0',
        columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <MediaFrame caption={item.caption} aspect={item.aspect ?? 'photo'}>
            {item.media}
          </MediaFrame>
        </li>
      ))}
    </ul>
  )
}
