import type { Metadata } from 'next'

/** Shared noindex metadata for every design-system showcase route. */
export function designSystemMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  }
}
