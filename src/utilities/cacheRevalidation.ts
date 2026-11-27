import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Purges Next.js unstable_cache tags and layout routes when CMS content changes.
 * Runs inside try/catch so standalone CLI scripts (seeds, migrations) never fail
 * when Next.js incremental cache stores are not active.
 */
export function revalidateCmsCache(tags: string[]): void {
  try {
    for (const tag of new Set(tags)) {
      revalidateTag(tag, { expire: 0 })
    }
    revalidatePath('/', 'layout')
  } catch {
    // Expected when invoked outside the Next.js server runtime (e.g. CLI seeds).
  }
}

export function cmsCollectionRevalidateHooks(tags: string[]): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} {
  const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
    const isDraftOnly =
      doc?._status === 'draft' && previousDoc?._status !== 'published'
    if (!isDraftOnly) {
      revalidateCmsCache(tags)
    }
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    revalidateCmsCache(tags)
    return doc
  }

  return {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  }
}

export function cmsGlobalRevalidateHooks(tags: string[]): {
  afterChange: GlobalAfterChangeHook[]
} {
  const afterChange: GlobalAfterChangeHook = ({ doc }) => {
    revalidateCmsCache(tags)
    return doc
  }

  return {
    afterChange: [afterChange],
  }
}
