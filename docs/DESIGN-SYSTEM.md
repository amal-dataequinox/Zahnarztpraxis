# Design System — Visual Identity v2

**Direction:** Empfangscyan (B) + Schriftbau (A) + Zwei Firste (C)  
**Spec:** [`VISUAL-SPEC-v2.md`](./VISUAL-SPEC-v2.md) · Type: [`TYPEFACE-COMPARISON.md`](./TYPEFACE-COMPARISON.md)

## Locked decisions

| Element | Value |
| --- | --- |
| Typeface | **IBM Plex Sans** (Suisse Int'l / NHG optional later) |
| Cyan CTA | `#147A86` / signal `#17808C` (AA with white) |
| Cyan budget | ~2–4% of viewport; max one filled primary CTA |
| Radius | Near zero |
| Alpine WebGL as brand | Dropped |
| Phase 3 | Not started |

## Tokens

Source: [`src/design-system/tokens.css`](../src/design-system/tokens.css)  
Rollback: [`src/design-system/archive/`](../src/design-system/archive/)

## Showcase

`/design-system` — **one-page** internal scroll showcase (`noindex`). Enable in production with `DESIGN_SYSTEM_ENABLED=true`.

Multipage sidebar workspace archived at [`src/design-system/archive/multipage-workspace/`](../src/design-system/archive/multipage-workspace/).

## Public site IA (direction — not Phase 3)

Compact public site, separate from this internal tool:

- 2 location homepages (Appenzell type-left / Gais photo-left)
- Shared treatments, team, contact/appointment templates
- Privacy / legal

Do not expand into a large marketing sitemap without cause.

## Components

Import from `@/design-system`. New: `LocationSwitcher`, `IndexedRow`, `EditorialSplit`.

## Photography

Real SDN assets only. **Gais-specific exteriors are a documented content gap** — do not label shared interiors as Gais façades.
