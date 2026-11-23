# 3D design guidelines

Canonical art direction: [`3D-ART-DIRECTION.md`](./3D-ART-DIRECTION.md)

This document is the **design-system view** of that direction: rules for UI integration. Runtime WebGL is optional and feature-flagged; the design system showcase uses the **static SVG fallback** only.

## Motif

**Distant Alpine silhouette** — layered ridgelines, soft mist, large negative space for typography.

## Palette (scene)

| Name | Hex | Depth role |
| --- | --- | --- |
| Fir | `#263B32` | Near ridge |
| Sage | `#A7B2A0` | Mid mass |
| Glacier | `#C4D7D8` | Far haze |
| Chalk | `#F3F0E7` | Sky / page blend |

UI tokens remain the product chrome source of truth; scene colours stay close but may be tuned for atmosphere.

## Composition

- Type + CTA clear-zone typically upper-left → centre on desktop.
- Ridges sit in the lower half; never cover primary headline.
- Mobile: simplify layers; protect headline legibility; prefer static fallback under reduced motion.

## Materials & lighting

- Matte stone / soft rock — no glossy PBR showpieces.
- Soft daylight; restrained mist between layers.
- Architectural minimalism — not tourism postcard, not game world.

## Motion (when runtime is enabled)

- Subtle atmospheric drift only.
- No fly-throughs, orbit gimmicks, or continuous spectacle.
- Honour `prefers-reduced-motion` → SVG/static fallback.
- Feature flag: `NEXT_PUBLIC_ENABLE_ALPINE_3D`.

## Explicitly forbidden

Floating islands · cartoon cows · Swiss flags · floating teeth · busy villages · entertainment HUD.

## Fallback

`AlpineSilhouetteFallback` mirrors layered composition for no-WebGL / reduced-motion / flag-off. Design reviews should approve the fallback silhouette, not only the WebGL path.
