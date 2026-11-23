import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { isDesignSystemEnabled } from '@/design-system/showcase/enabled'
import { designSystemMetadata } from '@/design-system/showcase/metadata'

export const metadata = designSystemMetadata('Design System v2')

/** Feature-flag gate only — preferred showcase is the one-page scroll. */
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  if (!isDesignSystemEnabled()) notFound()
  return children
}
