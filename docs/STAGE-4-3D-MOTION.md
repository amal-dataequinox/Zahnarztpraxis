# Stage 4 — 3D & motion (Appenzell-first)

**Status:** Active scaffold · Appenzell hero only  
**Intensity:** Subtle depth plane (Distant Alpine silhouette) — not a hero takeover or tech demo  
**Flag:** `NEXT_PUBLIC_ENABLE_ALPINE_3D` (default on; `false` → SVG only)

## Visual direction (Appenzell — mockup lock)

**Target:** photoreal Alpine countryside (meadow, depth, mist, peaks) with type left and soft paper fade — per client mockup.  
**Not:** geometric/low-poly WebGL silhouette as the hero read.

Current Appenzell hero uses `AlpinePhotoHero` + temporary photoreal stand-in (`appenzell-alpine-hero.jpg`). Replace with licensed Appenzell-location photography when available. Procedural WebGL remains in `src/components/three/*` for optional later accents only.

## Placement

| Surface | Treatment |
| --- | --- |
| **Appenzell `/` hero (media column)** | `AlpineHeroAtmosphere` — layered ridges + mist behind the clear type zone |
| **Vertrauen / Praxis / Team** | Photography only (Empfangscyan / interiors) |
| **Gais** | No WebGL yet — structural mirror until Appenzell Stage 4 is approved |
| **CMS `Hero` block** | CMS image wins; Appenzell falls back to Alpine when no image |

## Fallbacks (required)

1. **SSR / first paint** — SVG silhouette (`AlpineSilhouetteFallback`)
2. **`prefers-reduced-motion`** — SVG only; no canvas, no parallax
3. **`NEXT_PUBLIC_ENABLE_ALPINE_3D=false`** — SVG only
4. **Mobile** — WebGL allowed at lower DPR; parallax off under ~768px (scene-level)

## Performance budget

- Dynamic import of R3F scene (`ssr: false`)
- Procedural low-poly stand-in until Blender GLB ships (`docs/3D-ART-DIRECTION.md`)
- One canvas max on the homepage; no second WebGL elsewhere in Stage 4

## Motion (Hybrid immersive — implemented)

See `docs/dairy-food-interaction-audit.md` and `docs/stage-4-qa/HYBRID-IMMERSION-REPORT.md`.

- **Hero:** Photoreal `AlpinePhotoHero` + GSAP entrance + mist/parallax atmosphere
- **Engine:** GSAP + ScrollTrigger; CSS ambient; **no Lenis**; R3F unused on default home
- **Controls:** `MotionControl` pause/resume + `prefers-reduced-motion`
- **Treatments:** `TreatmentExplorer` (CMS expand, no 3D dental)
- **Scope:** Appenzell only; Gais deferred

## Out of scope (until you ask)

- Gais Alpine variant
- Reception-desk / corridor geometry experiments
- Kinetic type accents beyond current fade-up
- Showcase `/design-system` changes for Stage 4

## Verify

- http://appenzell.localhost:3000 — type left, Alpine depth right  
- Hard-refresh after flag changes  
- Toggle OS reduced-motion → SVG still  
- http://gais.localhost:3000 — photography / structure only  
