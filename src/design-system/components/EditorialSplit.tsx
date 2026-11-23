import type { ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type EditorialSplitProps = {
  /** Appenzell: type left. Gais: type right (mirror). */
  mirror?: boolean
  /** Taller media column for homepage heroes. */
  density?: 'default' | 'hero'
  copy: ReactNode
  media: ReactNode
  className?: string
}

/**
 * 5/7 desktop split. Mirror swaps columns for Zwei Firste location differentiation.
 */
export function EditorialSplit({
  mirror = false,
  density = 'default',
  copy,
  media,
  className,
}: EditorialSplitProps) {
  return (
    <div
      className={cn(
        'grid min-w-0 items-stretch gap-6 lg:grid-cols-12 lg:gap-0',
        density === 'hero' && 'gap-0',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-col justify-center lg:col-span-5 lg:px-[var(--container-pad)]',
          density === 'hero' && 'px-[var(--container-pad)] py-12 lg:py-0',
          mirror ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        {copy}
      </div>
      <div
        className={cn(
          'min-h-[16rem] min-w-0 lg:col-span-7',
          density === 'hero' && 'min-h-[min(70vh,36rem)] lg:min-h-[min(88vh,52rem)]',
          mirror ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        {media}
      </div>
    </div>
  )
}
