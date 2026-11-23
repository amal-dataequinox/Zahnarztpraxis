# Archived — multipage design-system workspace

Internal multi-route `/design-system/*` shell (sidebar + drawer) archived on 2026-11-19.

**Preferred live showcase:** single scrolling page at `/design-system`
(`src/design-system/showcase/OnePageShowcase.tsx`).

## Contents

- `DesignSystemShell.tsx` — sidebar / mobile drawer
- `nav.ts` — route groups
- `sections/` — OverviewIndex, LocationPreview, MotionNotes
- Former nested App Router pages were removed from the live tree; recover from git history if needed.

## Restore (optional)

1. Move shell + nav back under `src/design-system/showcase/`
2. Remount nested pages under `src/app/(frontend)/design-system/` (see git history)
3. Wire `layout.tsx` to `DesignSystemShell` again

This archive is an **internal tooling** experiment. It does not define the public
marketing site IA (compact location homepages + few supporting templates).
