import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClass: Record<ContainerSize, string> = {
  sm: 'max-w-[var(--container-sm)]',
  md: 'max-w-[var(--container-md)]',
  lg: 'max-w-[var(--container-lg)]',
  xl: 'max-w-[var(--container-xl)]',
  full: 'max-w-none',
}

type ContainerProps<T extends ElementType = 'div'> = {
  as?: T
  size?: ContainerSize
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'lg',
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Comp = as ?? 'div'

  return (
    <Comp
      className={cn(
        'mx-auto w-full min-w-0 max-w-full px-[var(--container-pad)]',
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
