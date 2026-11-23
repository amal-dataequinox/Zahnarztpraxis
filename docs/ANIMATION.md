# Animation principles

Motion in Alpine Modernism should feel like **morning mist lifting** — calm, directional, purposeful. Not celebration, bounce or UI fireworks.

## Principles

1. **One job** — each motion clarifies hierarchy or continuity (enter, focus, navigate), never decoration alone.
2. **Short and soft** — prefer 160–480ms with `--ease-out`. Reveals may use ~700ms.
3. **Stagger sparingly** — 80–160ms delays between sibling reveals; avoid long cascading lists.
4. **Respect reduced motion** — honour `prefers-reduced-motion: reduce` (already wired for `.motion-*` utilities).
5. **Ship 2–3 intentional motions per major experience** — e.g. page enter fade-up, nav state, media reveal — not dozens of micro-bounces.

## Approved patterns

| Pattern | Token / utility | Use |
| --- | --- | --- |
| Fade up | `.motion-fade-up` | Section / hero content enter |
| Fade in | `.motion-fade-in` | Soft presence |
| Colour / opacity transitions | `--duration-fast` | Buttons, links, focus |
| Transform lift (subtle) | ≤ 4–8px | Interactive surfaces only if needed |

## Disallowed (Phase 2/3 default)

- Elastic bounce / springy overshoot on healthcare CTAs
- Continuous ambient looping animations that compete with content
- Parallax that causes layout shift or motion sickness
- Auto-playing video with motion when reduced-motion is requested

## Future 3D hero motion

When the Distant Alpine silhouette scene is approved and integrated (see [3D-ART-DIRECTION.md](./3D-ART-DIRECTION.md)), only very subtle multi-layer parallax / atmospheric drift is allowed, with a static fallback for `prefers-reduced-motion`. No fly-throughs or game-like camera paths.

## Implementation

CSS tokens live in `src/design-system/tokens.css`. Base utilities live in `src/design-system/styles/base.css`. Phase 3 may add scroll-driven reveals with the same easing curve — still gated by reduced-motion.
