# Appenzell Stage 4 — visual refinement QA

**Date:** 2026-11-19  
**URL:** http://appenzell.localhost:3000/  
**Gais 3D:** not started

## Before / after

| Viewport | Before | After |
| --- | --- | --- |
| 1440 WebGL | `screenshots/before/appenzell-hero-1440.png` | `screenshots/after/appenzell-hero-1440.png` |
| 1024 | `screenshots/before/appenzell-hero-1024.png` | `screenshots/after/appenzell-hero-1024.png` |
| 768 | `screenshots/before/appenzell-hero-768.png` | `screenshots/after/appenzell-hero-768.png` |
| 390 type | `screenshots/before/appenzell-hero-390-top.png` | `screenshots/after/appenzell-hero-390-top.png` |
| 390 media | `screenshots/before/appenzell-hero-390-media.png` | `screenshots/after/appenzell-hero-390-media.png` |
| 1440 reduced-motion | `screenshots/before/appenzell-hero-1440-reduced-motion.png` | `screenshots/after/appenzell-hero-1440-reduced-motion.png` |

## What changed

- Softer Appenzell palette (no near-black foreground)
- Extra ridge layers + meadow rolls
- Soft sky shader + inter-layer haze
- Sparse trees, farmhouse, tiny cows
- SVG fallback shares palette / composition / accents
- Mobile: lower camera crop, shorter media min-height, parallax off & lower DPR

## Verification

- Typecheck: pass  
- ESLint (touched files): pass  
- Production build: pass (prior run this session)

## Cinematic motion (2026-11-20)

Hero is photoreal `AlpinePhotoHero` (mockup lock). Motion is CSS + IntersectionObserver — no Framer Motion added.

| Shot | File |
| --- | --- |
| Desktop 1440 | `screenshots/motion-appenzell-desktop-1440.png` |
| Mobile 390 | `screenshots/motion-appenzell-mobile-390.png` |

Implemented:

- Hero entrance stagger (label → heading → lead → CTA)
- Alpine ambient depth (bg/mid/fg + clouds), 15–30s drift; desktop pointer parallax; pause off-screen
- One-shot scroll reveals (~18% viewport) for sections + photography
- Link arrow / service-row hover (250ms)
- `prefers-reduced-motion` static; no Gais / DS / CMS / booking changes

Awaiting Appenzell animation review before Gais.

## Remaining issues (honest)

1. Photoreal hero uses stand-in Unsplash Alpine until licensed Appenzell shoot.
2. Depth layers are photographic + CSS (not live R3F) — intentional after mockup lock.
3. Editorial paper veil softens the left edge of the scene (by design for type).
4. Next.js “1 Issue” badge may still show from unrelated tooling.
5. Optional later: artist GLB accents per `docs/3D-ART-DIRECTION.md` — not required for this motion pass.
