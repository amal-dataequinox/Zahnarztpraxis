import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/design-system/lib/cn'

type StackGap = '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16'

const gapClass: Record<StackGap, string> = {
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
  '16': 'gap-16',
}

type StackProps = {
  gap?: StackGap
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>

/** Vertical stack. Prefer this over ad-hoc flex-col gap utilities in product UI. */
export function Stack({ gap = '4', children, className, ...rest }: StackProps) {
  return (
    <div className={cn('flex min-w-0 max-w-full flex-col', gapClass[gap], className)} {...rest}>
      {children}
    </div>
  )
}

type ClusterProps = StackProps & {
  align?: 'start' | 'center' | 'end' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
}

const alignClass = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
} as const

const justifyClass = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

/** Horizontal wrapping cluster for actions, tags and metadata. */
export function Cluster({
  gap = '3',
  align = 'center',
  justify = 'start',
  children,
  className,
  ...rest
}: ClusterProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full flex-wrap',
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
