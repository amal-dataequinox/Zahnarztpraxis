'use client'

import gsap from 'gsap'
import { useLayoutEffect, type DependencyList, type RefObject } from 'react'

/**
 * Scoped GSAP context with automatic cleanup on unmount / dep change.
 */
export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  factory: () => void | (() => void),
  deps: DependencyList = [],
): void {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return

    let nestedCleanup: void | (() => void)
    const ctx = gsap.context(() => {
      nestedCleanup = factory()
    }, el)

    return () => {
      if (typeof nestedCleanup === 'function') nestedCleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies deps
  }, deps)
}
