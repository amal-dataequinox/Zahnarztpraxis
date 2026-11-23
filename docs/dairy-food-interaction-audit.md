# Dairy Food Bulgaria → Palatty interaction audit

**Date:** 2026-11-20  
**Reference:** https://dairyfoodbg.com/  
**Target:** Zahnarztpraxis Palatty — Appenzell homepage only (Hybrid direction)

## Verified reference stack

Inspected in browser (not assumed):

| Layer | Finding |
| --- | --- |
| CMS / host | Webflow (`w-mod-js`) + custom JS (`dairy-food.pages.dev/main.js`, `hero.js`) |
| Motion | **GSAP 3.15** — ScrollTrigger, Flip, SplitText, CustomEase, Observer |
| Smooth scroll | **Lenis** (`html.lenis`) — **not** adopted for Palatty |
| Hero media | Looping muted hero video (`hero-video-v2.mp4`) |
| WebGL | Multiple canvases (~4) for product/packaging stages |
| Motion control | Visible **“Pause video & motion”** / “Pause video” |
| Products | Interactive product + packaging explorers (tab/button stages) |
| About | Editorial storytelling with scroll-linked reveals |

## Interaction philosophy (what to translate)

1. Strong cinematic opening that establishes place/brand before detail.
2. Scroll storytelling that connects sections without hijacking native scroll.
3. Interactive exploration for “product” categories (treatments for Palatty).
4. Explicit user control over ambient motion.
5. Premium pacing — intentional, not decorative bounce.

## What not to clone

Branding, colours, dairy imagery, layout grid, Lenis, letter-scatter SplitText, medical WebGL anatomy, fake claims.

## Locked Palatty decisions (Hybrid)

1. Photoreal `AlpinePhotoHero` remains the primary visual read.
2. Lightweight atmosphere (mist, parallax, drift) — not geometric R3F takeover.
3. GSAP + ScrollTrigger for entrances and scroll storytelling.
4. Treatment explorer inspired by product stages; CMS copy only.
5. Visible MotionControl (pause/resume ambient).
6. No Lenis.
7. R3F optional future; not required for v1.
8. Appenzell only; Gais and `/design-system` untouched.

## Pattern mapping

| Dairy Food | Palatty (Appenzell) |
| --- | --- |
| Hero video opening | Photoreal Alpine + GSAP depth-in + staggered type |
| Scroll-linked media | `AlpineScrollBridge` (hero → Vertrauen), subtle scrub |
| Product explorers | `TreatmentExplorer` (expand CMS services) |
| Packaging canvases | Deferred (no WebGL dental object in v1) |
| Pause video & motion | `MotionControl` + `MotionProvider` |
| Lenis | Not implemented |
| SplitText | Whole-block reveals only |

## Palatty section map

| Section `id` | Interaction |
| --- | --- |
| `hero` | GSAP entrance + Hybrid Alpine atmosphere |
| `vertrauen` | Image mask + text reveal; Alpine bridge end |
| `leistungen` | TreatmentExplorer |
| `praxis` | Photo opacity/clip reveals |
| `team` / `standorte` / `kontakt` / `termin` | One-shot section reveals |

## Dependencies

- **Add:** `gsap` (ScrollTrigger plugin only for v1)
- **Reuse:** existing CSS ambient in `appenzell-motion.css`, design tokens, CMS services
- **Keep unused on home:** `src/components/three/*` (optional later)
