# Palatty — photography website usage plan

**Status:** Recommendation for approval — no uploads, no page redesign, no design-system changes in this phase.  
**Companion inventory:** `docs/PHOTO-ASSET-INVENTORY.md`  
**Contact sheet:** `docs/photo-audit/CONTACT-SHEET.jpg`  
**Originals (immutable):** `assets/img/`

## Principles

1. Use only client-delivered photography from `assets/img/`.  
2. Do not invent staff identities, titles, or clinic spaces. Map people via approved CMS Team records.  
3. Prefer Alpine Modernism framing (`MediaFrame`, full-bleed where composition allows) per `docs/PHOTOGRAPHY.md` / `docs/DESIGN-SYSTEM.md`.  
4. Patient-adjacent images need explicit practice sign-off.  
5. Payload Media already generates WebP `thumbnail` / `card` / `hero` — upload masters once approved; do not hand-resize originals.

---

## Page-level strategy

### Homepage

| Priority | Asset | Role |
| --- | --- | --- |
| Primary human | `303287` | Team trust / “welcome to the practice” band (not competing with Distant Alpine 3D hero motif unless intentionally sequenced) |
| Welcome alternate | `303348` *or* `303361` | First-visit warmth — **after consent** |
| Facility proof | `303511` | Calm clinical credibility lower on page |
| Soft secondary | `303384` | Two-person brand moment if more human photography is needed |

**Avoid on Homepage:** stacking all three treatment-room empties; both desk-detail duplicates; both reception handoff frames.

### Practice introduction

| Asset | Role |
| --- | --- |
| `303475` | Reception / arrival orientation |
| `303384` | People + corridor |
| `303541` / `303527` | Material honesty (wood, glass, plants, white) |
| `303511` | Treatment standard |

### Team page

| Asset | Role |
| --- | --- |
| `303287` | Page hero / intro |
| Five studio portraits | Grid cards (consistent white backdrop) |
| `303334` | Optional secondary group beat |

### Individual staff profiles

| Asset | Role |
| --- | --- |
| Matching studio file | Primary profile image |
| `303394` / `303508` | Optional “in practice” alternate **only** when the same person is confirmed in CMS |

Do not publish a profile image against a Team member until the practice confirms the filename ↔ person mapping.

### Services pages

| Asset | Role |
| --- | --- |
| `303511` | Primary treatment / technology visual |
| `303529` | Alternate angle / second service |
| `303516` | Mobile-tall or split layouts |
| `303394` / `303508` | Human presence without procedure fear aesthetics |

### Practice locations (Appenzell / Gais)

| Asset | Role |
| --- | --- |
| Shared interiors | Same pack can support both domains until location-specific exteriors exist |
| `303475`, `303541`, `303527` | “What you’ll find inside” |
| **Gap** | No building exterior — use address/map/contact copy; request exteriors in a follow-up shoot |

Clarify with the client whether this SDN set is **one shared practice look** or should be tagged to a single location before domain-specific Media relations.

### Contact sections

| Asset | Role |
| --- | --- |
| `303305` | Reachable / phone narrative |
| `303348` or `303361` | Arriving / assisted (post-consent) |
| `303542` *(one of the pair)* | Desk detail accent beside form or hours |

---

## Recommended primary set (upload-ready shortlist)

Upload these first after approval (≈ 14–15 files):

1. Studio five: `BelmaMusic-…`, `ChristinaMileraPoput-…`, `DalinaJahiu-…`, `JeanineWeishaupt-…`, `RianaSutter-…`  
2. Groups: `303287`, `303384`  
3. Reception: `303305`, one of `303348`/`303361` (if approved), `303475`, one of `303542`/`303542-2`  
4. Treatment: `303511`, `303516`, optionally `303529`  
5. Interior: `303541`, optionally `303527`  
6. Environmental staff: `303394`, `303508` when person-matched  

**Defer:** second near-duplicates; unapproved patient-adjacent frames.

---

## Payload CMS Media mapping

Collection: `media` (`src/collections/Media.ts`)

| CMS capability | Recommendation |
| --- | --- |
| Format | Upload original JPEG masters; rely on sharp WebP sizes |
| `imageSizes` | Existing: `thumbnail` 480w, `card` 1024w, `hero` 1920w @ q≈80–82 |
| `focalPoint` | Enable per asset (already `focalPoint: true`) — set before using object-fit crops |
| `alt` | Required, localized (DE primary; FR/EN if locales active) |
| `description` | Optional editorial note for editors; not a substitute for `alt` |

### Suggested focal points (approx.)

| File | Focal point |
| --- | --- |
| Studio portraits | Face center (~50% x, ~38–42% y) |
| `303287` | Front-center person in group |
| `303334` | Midpoint between both faces |
| `303348` / `303361` | Staff face (upper right) |
| `303305` | Staff face |
| `303384` | Midpoint between faces |
| `303394` / `303508` | Face |
| `303475` | Seated receptionist / desk (~70% x, ~45% y) |
| `303511` / `303529` | Dental chair headrest / unit |
| `303516` | Chair center |
| `303527` | Corridor vanishing point |
| `303541` | Planters / glass edge (~35% x, ~45% y) |
| `303542` pair | Cyan desk + plant |

### Alt text & description patterns (German examples — no invented job titles)

Use descriptive language. Add a personal name in `alt` **only** after CMS Team confirmation.

| Pattern | Example `alt` (DE) |
| --- | --- |
| Studio portrait | `Studioaufnahme einer lächelnden Mitarbeiterin in marineblauem Polo vor weissem Hintergrund.` |
| Named (after approval) | `Portrait von [Name] im Studio, marineblaues Polo, weisser Hintergrund.` |
| Group | `Team der Zahnarztpraxis hinter dem hellblauen Empfangstresen.` |
| Reception activity | `Mitarbeiterin am Empfang im Gespräch mit einer Patientin.` |
| Treatment room | `Heller Behandlungsraum mit modernem Behandlungsstuhl und Geräten.` |
| Hallway | `Heller Praxisflur mit Glastüren und Pflanzen.` |
| Desk detail | `Detail des türkisfarbenen Empfangstresens mit Pflanze und Holzelementen.` |

`description` may store English editor notes or crop guidance (e.g. “Prefer square crop for Team card”).

### Responsive usage in the site

| Context | Prefer size |
| --- | --- |
| Team avatars / small cards | `thumbnail` |
| Content bands / MediaFrame | `card` |
| Full-bleed sections | `hero` |
| Portrait interiors on mobile | Master or `card`; respect 2:3 assets (`303516`, `303527`, `303541`) |

Do not serve the 2362px JPEG on every breakpoint — always prefer generated WebP URLs from Media.

---

## Approval checklist (before proceed)

- [ ] Confirm shortlist for first Payload Media upload  
- [ ] Confirm which near-duplicates to drop (`303542` pair; `303348` vs `303361`)  
- [ ] Confirm patient-adjacent consent for reception interaction frames  
- [ ] Confirm studio filename ↔ Team member mapping (and titles from CMS only)  
- [ ] Confirm whether interiors apply to **both** domains or one location  
- [ ] Request exterior / entrance photography if Locations need façade proof  
- [ ] Explicit go-ahead to upload into Payload (manual; no auto-publish)

---

## Out of scope (this audit)

- Homepage or section implementation  
- Design-system token / component changes  
- Automatic Media seeding or CDN publish  
- AI enhancement, face swaps, or fabricated exteriors
