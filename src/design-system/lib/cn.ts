/**
 * Tiny className merger. Avoids pulling in `clsx` / `tailwind-merge` for Phase 2.
 */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')
