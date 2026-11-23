# Visual Identity v2 — implementation notes

**Scope:** Tokens + typography + `/design-system` showcase  
**Not in scope:** Phase 3 marketing pages

## Visual approval set (v2 showcase)

| Section | File |
| --- | --- |
| Hero / direction | [`screenshots/approval-01-hero-1440.png`](./screenshots/approval-01-hero-1440.png) |
| Typography / German specimens | [`screenshots/approval-02-typography-1440.png`](./screenshots/approval-02-typography-1440.png) |
| Mirrored homepages | [`screenshots/approval-03-homepages-1440.png`](./screenshots/approval-03-homepages-1440.png) |
| Photography leads | [`screenshots/approval-04-photography-1440.png`](./screenshots/approval-04-photography-1440.png) |
| Mobile 390 | [`screenshots/approval-05-mobile-390.png`](./screenshots/approval-05-mobile-390.png) |
| Before (Alpine) | [`screenshots/before-desktop-1440.png`](./screenshots/before-desktop-1440.png) |

## Rollback

See [`src/design-system/archive/ROLLBACK.md`](../../src/design-system/archive/ROLLBACK.md).

## Checks

- Cyan CTA `#147A86` white text ≥5:1  
- Typeface: IBM Plex Sans (latin-ext)  
- Gais photo gap called out in showcase  
- `pnpm typecheck` / `pnpm lint` / `pnpm build` expected pass after this change set
