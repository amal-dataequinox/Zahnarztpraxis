# Rollback notes

## Alpine Modernism → Visual Identity v2

Visual Identity v2 replaced Alpine Modernism tokens and font loading.

To restore the previous design-system look:

1. Copy `tokens.alpine-modernism.css` → `../tokens.css`
2. Copy `layout.alpine-modernism.tsx` → `../../app/(frontend)/layout.tsx` (restore Newsreader + Manrope)
3. Revert `/design-system` page and component visual changes via git if needed
4. Restart the Next.js server

## Multipage workspace

See `multipage-workspace/README.md`. Live preferred route is the one-page
`/design-system` showcase.

Git history remains the authoritative rollback for component/showcase files.
