# Photography guidelines (design system)

Companion to the asset audit:

- [`PHOTO-ASSET-INVENTORY.md`](./PHOTO-ASSET-INVENTORY.md)
- [`PHOTO-USAGE-PLAN.md`](./PHOTO-USAGE-PLAN.md)
- [`PHOTOGRAPHY.md`](./PHOTOGRAPHY.md)

## Rules

1. Use only client-delivered photography (`assets/img/` masters).
2. Never overwrite originals; never AI-replace faces or fabricate interiors.
3. Do not invent staff identities, titles, or biographies.
4. Patient-adjacent frames need explicit practice consent before public use.
5. Do not auto-upload to Payload Media until approved.

## Provisional shortlist (approved for design-system review only)

| Asset | Intended use | Status |
| --- | --- | --- |
| `303287` | Homepage team photograph | Provisional |
| `303511` | Main practice interior | Provisional |
| `303475` | Interior section | Provisional |
| `303541` | Practice gallery | Provisional |
| Studio five portraits | Team profiles | Provisional |

**On hold:** `303348` / `303361` and other patient-adjacent images until permissions + duplicate selection.

Showcase review copies live under `public/design-system/photography/` (non-destructive copies).

## Ratios & crops

| Context | Ratio | Notes |
| --- | --- | --- |
| Editorial / practice bands | 3:2 | Default `MediaFrame` `photo` |
| Team avatars | 1:1 | Face-centred; object-position ~28–40% y |
| Profile portrait | 3:4 / 4:5 | Optional |
| Wide hero photography | 21:9 | Use sparingly; protect faces in groups |

Set Payload Media focal points before CSS `object-fit` crops (see usage plan).

## Layout patterns

- Full-bleed or edge-to-edge for hero photography — not inset collage cards.
- `MediaFrame` + optional `figcaption`; no floating badges on faces.
- Galleries via `ImageGallery` with restrained gaps.
- Prefer one strong image per section.

## Alt text

German `alt` required in Payload. Descriptive; add personal names only after CMS Team confirmation. No invented clinical qualifications in alt strings.
