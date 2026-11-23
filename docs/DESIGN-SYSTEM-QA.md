# Design System QA Report — Alpine Modernism

**Date:** 2026-11-19  
**Target:** `/design-system` (internal showcase)  
**Scope:** Visual, responsive, accessibility, and implementation review  
**Constraint:** Approved typography, palette, photography rules, and 3D direction were not changed.

## 1. Executive summary

The design-system showcase was reviewed across five viewports. Approved tokens (**Fir / Glacier / Chalk / Sage**) and typography (**Newsreader + Manrope**) load and render correctly. All 12 sections are present and visually consistent.

Three clear technical defects were found and fixed during QA (mobile nav visibility, header CTA touch size / clipping, warning badge contrast, inaccurate photo caption). No critical issues remain.

**Recommendation: A. READY FOR DESIGN APPROVAL.**

Non-blocking minors and photography business gates are listed below. Do not start Phase 3 until you explicitly approve.

## 2. Testing environment

| Item | Value |
| --- | --- |
| App | Next.js 16.4.6 · `DESIGN_SYSTEM_ENABLED=true pnpm dev` |
| URL | `http://localhost:3000/design-system` |
| OS | macOS (darwin 25.6.0) |
| Browsers | Cursor IDE browser (CDP metrics) + Google Chrome headless screenshots |
| Playwright | Not present in repo — **not installed** (per constraint) |
| Screenshots | `docs/design-system-qa/screenshots/` |

### Viewports tested

| Viewport | Size | Result |
| --- | --- | --- |
| Desktop | 1440 × 900 | Pass |
| Desktop | 1280 × 800 | Pass |
| Tablet | 768 × 1024 | Pass |
| Mobile | 390 × 844 | Pass (after fixes) |
| Mobile | 360 × 800 | Pass (no horizontal overflow) |

## 3. Responsive testing results

| Check | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Horizontal overflow | None | None | None |
| Content clipping | None | None | Header CTA clipped before fix — **fixed** |
| Grid / wrapping | OK | OK | Colour/cards stack correctly |
| Heading scale | H1 ~76px @1440 | ~46px @768 | ~40px @390 |
| Image cropping | OK | OK | OK; no overflow |
| Navigation | Full | Full | Links on second row after fix |
| Touch targets (primary CTA) | ≥44px | ≥44px | 44px after fix |
| Footer | OK | OK | OK |

## 4. Typography review

| Check | Result |
| --- | --- |
| Newsreader on display / H1 | Pass — computed `Newsreader, … serif` |
| Manrope on body / UI | Pass — computed `Manrope, … sans-serif` |
| German glyphs (Natürlich, Öffnungszeiten, Ästhetik, Brotkrumen) | Pass |
| Hierarchy / measure | Pass — editorial spacing, balanced headlines |
| Approved fonts unchanged | Pass |

## 5. Colour and contrast review

| Token | Expected | Computed | Result |
| --- | --- | --- | --- |
| Fir | `#263B32` | `#263b32` | Pass |
| Glacier | `#C4D7D8` | `#c4d7d8` | Pass |
| Chalk | `#F3F0E7` | `#f3f0e7` | Pass |
| Sage | `#A7B2A0` | `#a7b2a0` | Pass |

### Contrast samples (WCAG AA 4.5:1 for normal text)

| Pair | Ratio | Result |
| --- | --- | --- |
| Ink H1 on chalk | 15.72 | Pass |
| Muted body on chalk | 8.63 | Pass |
| Inverse text on fir-deep | 14.40 | Pass |
| Text on glacier band | 6.59 | Pass |
| Success badge | 5.31 | Pass |
| Warning badge (before) | 3.96 | Fail → **fixed** |
| Warning badge (after `#7A5420`) | 5.74 | Pass |
| Error / Info badges | ≥5.0 | Pass |

Hardcoded hex outside tokens appears only as swatch labels and the approved 3D SVG fallback palette — acceptable.

## 6. Component review

| Area | Findings |
| --- | --- |
| Buttons | Primary / secondary / ghost / disabled / sizes present; hover CSS via tokens |
| Forms | Labels associated; select works; disabled field correct; **no submit / no fake booking** |
| Cards | Service / staff / location patterns consistent; hairline editorial style |
| Navigation | Sticky header; after fix, mobile shows section links + shortened CTA label |
| Locations | Shared brand, illustrative CMS placeholders clearly marked |
| Motion | Utilities present; `prefers-reduced-motion` wired in CSS |
| 3D | Static SVG only on showcase — matches approved placeholder status |

## 7. Photography review

| Check | Result |
| --- | --- |
| Shortlist images load (9) | Pass — no broken images |
| Alt text present | Pass — descriptive, no invented clinical titles |
| Staff labels | Pass — “Studio portrait A–E” / “Rolle aus CMS” (not real identities) |
| Originals unmodified | Pass — masters remain in `assets/img/`; showcase uses copies under `public/design-system/photography/` |
| Patient-adjacent | Pass — not shown; badges note hold on `303348` / `303361` |
| Payload upload | Pass — none performed |
| Caption accuracy | Minor error on 303541 crop wording — **fixed** |

## 8. Accessibility review

| Check | Result |
| --- | --- |
| Skip link | Present (“Zum Inhalt springen”) |
| Landmarks | `main`, `header`, `nav`, `footer`, breadcrumbs nav |
| Form labels | Pass |
| Image alt | Pass |
| Focus ring token | `--focus-ring` defined; `:focus-visible` in base CSS |
| Focus in automation | Inconclusive for `:focus-visible` via synthesized Tab — **manual keyboard check recommended** (Minor) |
| Reduced motion | CSS utilities honour `prefers-reduced-motion` |
| Semantic status colours | Warning contrast corrected |

## 9. Functional testing results

| Control | Behaviour | Verdict |
| --- | --- | --- |
| Header / in-page anchors (`#colour`, `#typography`, …) | Navigate within page | Pass |
| Appointment CTA | Scrolls to `#appointment` showcase block — **not** a booking API | Pass |
| Buttons (Primary etc.) | Non-submitting demos | Pass |
| Select Standort | Changes option locally | Pass |
| Inputs / textarea | Editable; no form submit handler | Pass |
| Disabled button / input | Not interactive | Pass |
| Service “Mehr erfahren” | In-page `#services` | Pass (demo) |
| Location “Praxis öffnen” `href="#"` | Placeholder only | Minor — acceptable for showcase |
| External text link | Opens practice domain | Pass |

## 10. Screenshot references

| File | Viewport |
| --- | --- |
| [`docs/design-system-qa/screenshots/desktop-1440.png`](./design-system-qa/screenshots/desktop-1440.png) | 1440 × 900 |
| [`docs/design-system-qa/screenshots/desktop-1280.png`](./design-system-qa/screenshots/desktop-1280.png) | 1280 × 800 (extra) |
| [`docs/design-system-qa/screenshots/tablet-768.png`](./design-system-qa/screenshots/tablet-768.png) | 768 × 1024 |
| [`docs/design-system-qa/screenshots/mobile-390.png`](./design-system-qa/screenshots/mobile-390.png) | 390 × 844 |
| [`docs/design-system-qa/screenshots/mobile-360.png`](./design-system-qa/screenshots/mobile-360.png) | 360 × 800 (extra) |

## 11. Outstanding issues

### Fixed during QA (no longer blocking)

| Severity | Section | Description | Correction |
| --- | --- | --- | --- |
| Major | 06 Navigation | Mobile hid all nav links with no alternative | `NavBar` now wraps links on a second row |
| Major | 05 / 06 | Header CTA `size="sm"` (~36px) below 44px target | CTA uses `size="md"` (44px) |
| Major | 06 Navigation | Long “Termin vereinbaren” clipped beside brand on ~390px | Short label `Termin` below `sm` breakpoint |
| Major | 02 Colour | Warning badge contrast 3.96:1 | Semantic `--palatty-warning` → `#7A5420` (5.74:1). Brand anchors untouched |
| Minor | 09 Photography | Caption claimed 3:2 crop for portrait 303541 | Caption corrected to 2:3 |

### Remaining (non-blocking)

| Severity | Section | Description | Evidence | Recommended correction |
| --- | --- | --- | --- | --- |
| Minor | 05 Buttons | Demo `size="sm"` control remains ~36px by design | Button size scale | Keep for scale demo; avoid `sm` for primary mobile CTAs in Phase 3 |
| Minor | 04 / 10 | Showcase links with `href="#"` | Breadcrumbs, location cards | Replace with real routes in Phase 3 |
| Minor | A11y | Automated `:focus-visible` verification inconclusive | CDP Tab focus | Manual keyboard pass before Phase 3 ship |
| — | Photography | Shortlist still provisional; consent pending for patient-adjacent | Usage plan | Business approval — not a DS visual defect |
| — | 12 3D | SVG is static placeholder only | Approved | Artist/runtime work later; no WebGL added in QA |

### Critical

None.

## 12. Final recommendation

### Verification

| Check | Result |
| --- | --- |
| TypeScript (`pnpm typecheck`) | Pass |
| Lint (`pnpm lint`) | Pass |
| Build (`pnpm build`) | Pass |
| Unit tests (`pnpm test:unit`) | Pass (6/6) |

### Severity tally (open)

| Critical | Major | Minor |
| --- | --- | --- |
| 0 | 0 | 3 (non-blocking) |

### Recommendation

# A. READY FOR DESIGN APPROVAL.

The design system visual language matches the approved decisions. Remaining items are non-blocking showcase placeholders, a deliberate small-button demo size, and photography/consent business gates.

**Do not start Phase 3 website UI until you give explicit approval.**
