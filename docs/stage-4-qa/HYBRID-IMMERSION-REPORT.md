# Hybrid Immersion — Appenzell final report

**Date:** 2026-11-20  
**Scope:** Appenzell homepage only  
**Direction:** Hybrid (photoreal hero + atmospheric depth + GSAP storytelling)

## Reference interaction analysis

See [`docs/dairy-food-interaction-audit.md`](../dairy-food-interaction-audit.md).

Dairy Food Bulgaria uses GSAP ScrollTrigger, Lenis, hero video, WebGL canvases, and a visible motion pause. Palatty adopts the **interaction philosophy** (cinematic open, scroll storytelling, explorers, motion control) under Swiss Alpine / Empfangscyan / Schriftbau identity — **without** Lenis, dairy branding, or geometric R3F hero takeover.

## Components changed / added

| Path | Role |
| --- | --- |
| `src/components/home/AppenzellHome.tsx` | Wired Hybrid motion shell |
| `src/components/home/AppenzellMotionRoot.tsx` | MotionProvider + bridge + control |
| `src/components/home/AlpinePhotoHero.tsx` | Mist layer; pause via MotionProvider |
| `src/components/home/TreatmentExplorer.tsx` | Expandable CMS treatments |
| `src/components/home/appenzell-motion.css` | Ambient CSS; GSAP-owned entrances |
| `src/components/motion/MotionProvider.tsx` | reduce + user pause state |
| `src/components/motion/MotionControl.tsx` | Visible pause/resume |
| `src/components/motion/HeroEntrance.tsx` | GSAP hero stagger |
| `src/components/motion/Reveal.tsx` | ScrollTrigger one-shot reveals |
| `src/components/motion/AlpineScrollBridge.tsx` | Hero→Vertrauen scrub |
| `src/components/motion/useGsapContext.ts` | Scoped GSAP cleanup |
| `docs/dairy-food-interaction-audit.md` | Phase 1 audit |

**Unchanged:** GaisHome, `/design-system`, CMS schema, booking, `src/components/three/*` (optional later).

## Dependencies introduced

- `gsap` ^3.15.1 (ScrollTrigger via `gsap/ScrollTrigger`)
- **Not added:** Lenis, Framer Motion, Flip, SplitText

## Animation architecture

```
AppenzellMotionRoot (MotionProvider)
  ├── HeroEntrance (GSAP timeline)
  ├── AlpinePhotoHero (CSS ambient + pointer; pauseable)
  ├── AlpineScrollBridge (ScrollTrigger scrub, no pin)
  ├── Reveal (ScrollTrigger once: up / image / mask / stagger)
  ├── TreatmentExplorer (expand + Reveal stagger)
  └── MotionControl (sessionStorage pause)
```

- Native scroll only; transform/opacity preferred.
- Ambient pauses when off-screen, user-paused, or reduced-motion.

## Screenshots

| Viewport | File |
| --- | --- |
| Desktop 1440 | `screenshots/hybrid-appenzell-desktop-1440.png` |
| Mobile 390 | `screenshots/hybrid-appenzell-mobile-390.png` |

## Accessibility

- `prefers-reduced-motion` → static photo + visible content; no scrub/parallax/ambient.
- MotionControl keyboard-focusable (`aria-pressed`, DE labels).
- Treatment expand uses `aria-expanded` / `aria-controls`.
- CTAs never gated behind animation completion.

## Performance notes

- Single photoreal LCP image; CSS distant plate (no second Next Image).
- No WebGL on default home.
- GSAP loaded with Appenzell client islands only.
- Ambient CSS animations pause off-screen / when paused.
- Production `pnpm build` + `tsc` + eslint (touched files): pass (2026-11-20).
- Appenzell and Gais HTTP 200 smoke checks.

## Accessibility checks

- [x] `prefers-reduced-motion` static path (CSS + JS skip)
- [x] MotionControl visible, keyboard-focusable, `aria-pressed`
- [x] Treatment expand `aria-expanded` / `aria-controls`
- [x] No scroll hijack / Lenis
- [x] Pointer parallax disabled ≤767px

## Outstanding issues

1. Alpine hero still uses temporary Unsplash stand-in until licensed shoot.
2. No 3D dental object (deferred; no licensed GLB).
3. Gais motion not started (await Appenzell review).
4. Trust indicators are non-claim UI chrome only (location + Familienzahnarztpraxis).
5. Optional later: R3F atmospheric accent behind photoreal plate.
6. Hero GSAP entrance needs ~1–2s after load for full opacity (cleanup hardened for Strict Mode).
