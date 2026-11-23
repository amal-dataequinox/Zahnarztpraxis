# Visual Specification v2 — Empfangscyan + Schriftbau + Zwei Firste

**Status:** Creative direction approved · cyan/type conditions locked · **Visual Identity v2 implementation authorised** (tokens + showcase only · **not** Phase 3)  
**Date:** 2026-11-19  
**Builds on:** [`VISUAL-IDENTITY-DIRECTIONS.md`](./VISUAL-IDENTITY-DIRECTIONS.md) · [`TYPEFACE-COMPARISON.md`](./TYPEFACE-COMPARISON.md)

| Element | Decision |
| --- | --- |
| Primary identity | **B — Empfangscyan** |
| Layout / typography | **A — Schriftbau** |
| Location differentiation | **C — Zwei Firste** |
| Fir / sage wellness | Drop |
| Alpine WebGL as brand identity | Drop |
| Real clinic photography | Core visual asset |
| Payload architecture | Unchanged |

---

## 0. Non-negotiables (implementation guards)

1. **Cyan is a signature, not a theme.** Use it for rules, focus, active location, links, and the primary CTA. Do **not** flood section backgrounds, large fills, or every surface with cyan.
2. **Two real locations.** Appenzell and Gais share components and voice but must not share an identical homepage with only the address swapped. Mirror composition, photo defaults, and location accents differ.
3. **Photography leads.** Reception, team, and rooms sit edge-to-edge or in editorial splits. Do not bury them in rounded card grids.

Implementation scope: update design tokens, typography loading, and `/design-system` showcase. **Phase 3 marketing pages remain frozen.**

---

## 1. Brand idea (one sentence)

**Palatty is recognised by its practice — cyan glass, dark wood, navy team, clinical clarity — composed with Swiss editorial precision, for two places under one name.**

---

## 2. Colour specification

### 2.1 Roles

| Role | Token | Locked value | Source / notes |
| --- | --- | --- | --- |
| Paper | `--palatty-paper` | `#F7F5F1` | Clinical paper ground |
| Snow | `--palatty-snow` | `#FFFFFF` | Fields / elevated |
| Ink | `--palatty-ink` | `#141414` | Primary text |
| Slate | `--palatty-slate` | `#4A4F55` | Secondary text |
| Wood | `--palatty-wood` | `#3B2F28` | Inverse / footer (directional; wood grain in photos is darker navy-adjacent) |
| Navy | `--palatty-navy` | `#0C1824` | Sampled from polo / group frames |
| **Cyan signal** | `--palatty-cyan` | `#17808C` | Desk-derived, **darkened for WCAG** |
| Cyan hover | `--palatty-cyan-deep` | `#147A86` | CTA hover / stronger fill (white text ≥5:1) |
| Cyan bright (non-text) | `--palatty-cyan-bright` | `#3C849C` | Rules / decorative strokes only — **not** small text on white |
| Line | `--palatty-line` | ink @ 16% | Hairlines |

Photo sampling (`303475`, `303287`, `303384`) produced brighter glass cyans (e.g. `#54CCF0`, `#3C849C`) that **fail** white-text AA. Per approval condition: **darken cyan rather than compromise accessibility.** CTA fill uses `#147A86` / `#17808C`.

### 2.2 Cyan usage rules (mandatory)

| Allowed | Forbidden |
| --- | --- |
| Max **one** filled primary CTA per major viewport composition | Full-section cyan backgrounds |
| Text links / 2–3px underlines | Cyan decorative cards or pills |
| Focus rings, active nav indicator | Soft cyan gradients / atmospheric washes |
| Location switcher active pip companion (with text) | Replacing photography with colour blocks |

**Measurable budget (design guardrail, not pixel audit):** cyan should occupy approximately **2–4% of visible interface area** on a typical desktop viewport. Wood, paper, ink, and **photography** carry the page.

### 2.3 Location accents (C — thin, not second brands)

| Location | Accent token | Role |
| --- | --- | --- |
| Appenzell | `--accent-appenzell` ≈ soft umber `#A67C52` | Marker, switcher pip, optional index numeral |
| Gais | `--accent-gais` ≈ cool slate `#6B7C8A` | Same weight/roles |

Never large fills. Same cyan CTA on both domains.

### 2.4 Explicitly dropped

`--palatty-fir`, `--palatty-sage` / lichen-as-brand, glacier wash bands, chalk-as-wellness cream identity.

---

## 3. Typography specification

### 3.1 Pairing (A — Schriftbau) — **locked**

| Role | Face |
| --- | --- |
| Display / H1–H3 | **IBM Plex Sans** (medium/semibold) |
| Body / UI / nav | **IBM Plex Sans** (regular/medium) |
| Optional long-form later | One restrained serif — not homepage |

**Selection rationale:** see [`TYPEFACE-COMPARISON.md`](./TYPEFACE-COMPARISON.md). Suisse Int'l / Neue Haas Grotesk remain optional licensed upgrades; Helvetica Now deprioritised (dual-domain Monotype cost + generic corporate signal).

**Drop as brand lock:** Newsreader + Manrope pairing.

### 3.2 Scale principles

- Display large, slightly tight tracking on desktop; never soft “lifestyle” bounce.
- Body ~17px, measure ~32–38rem for prose.
- Section indexes (`01`, `02`) in tabular figures — proprietary habit from A.
- German: `text-pretty` / balanced headlines; no decorative hyphen gimmicks.

### 3.3 Hierarchy example (homepage)

```
[LOCATION] Appenzell                    ← small caps / tracking, location accent pip
Zahnarztpraxis Palatty                  ← display
Natürlich. Persönlich. Präzise.         ← display or H2
[lead sentence from CMS]                ← body large, slate
[ Termin vereinbaren ]                  ← cyan rectangle CTA
```

---

## 4. Grid & layout principles (A)

| Principle | Spec |
| --- | --- |
| Grid | 12-column; desktop max ~1200–1280 content |
| Radius | **0–2px** on chrome; photos may use 0 |
| Elevation | Prefer hairlines over shadows; shadow only if interaction needs it |
| Cards | **Not default.** Indexed lists + photo splits |
| Section rhythm | Index + title + one supporting line + media; one job per section |
| Whitespace | Asymmetric tension (uneven column spans), not equal padding foam |

---

## 5. Navigation & location switching (C)

### 5.1 Header (desktop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Palatty          Leistungen  Team  Praxis  Kontakt    [Appenzell ▾]  [Termin] │
└─────────────────────────────────────────────────────────────────────────┘
     wordmark            text links (ink)              switcher     cyan CTA
```

- Header: paper or snow; bottom hairline.
- Active link: ink + cyan underline (2px), not pill.
- CTA: rectangular, cyan fill, white label; hover → cyan-deep.

### 5.2 Location switcher (first-class)

| State | Behaviour |
| --- | --- |
| Closed | Shows current location name + accent pip (Appenzell umber / Gais slate) |
| Open | Lists **Appenzell** and **Gais** with short line (town only — address stays in footer/contact) |
| Select other location | Navigate to that domain’s origin (`zahnarztpraxis-palatty.ch` ↔ `zahnarzt-palatty.ch`) or path-preserving swap when hosts differ — driven by existing domain map |
| Same location | No-op |

**Do not** bury location only in the footer. Users must always know *which* Praxis they are on.

### 5.3 Mobile header

```
┌──────────────────────────┐
│ Palatty          [Termin]│
│ Appenzell ▾              │  ← switcher always visible
│ Leistungen  Team  …      │  ← wrap row / simple disclosure — no hamburger theatre required in v2
└──────────────────────────┘
```

Short CTA label `Termin` below ~640px if needed (as proven in QA).

### 5.4 Footer

Wood or navy inverse band; both locations listed with address/phone from CMS; active location marked with accent pip. Not a second homepage.

---

## 6. Homepage wireframes — both locations

Shared section order; **composition and photo defaults differ**.

### 6.1 Section map (both)

| # | Section | Job |
| --- | --- | --- |
| 00 | Hero | Place + brand + photo evidence + CTA |
| 01 | Vertrauen | Team or reception proof (large photo) |
| 02 | Leistungen | Indexed list (not card grid) |
| 03 | Praxis | Rooms / materials (cyan desk may appear *in photo*, not as section fill) |
| 04 | Orte | Two-location clarity + switcher CTA |
| 05 | Kontakt | Hours + address for **this** domain only |

### 6.2 Desktop — Appenzell (type left / image right)

```
┌──────────────────┬──────────────────────────────────────┐
│ Appenzell ·      │                                      │
│                  │         PHOTO (default)              │
│ Zahnarztpraxis   │         303287 team @ desk           │
│ Palatty          │         or 303475 reception          │
│                  │         full-bleed in column         │
│ Lead CMS text    │                                      │
│                  │                                      │
│ [Termin verein.] │                                      │
└──────────────────┴──────────────────────────────────────┘
     ~5 cols                    ~7 cols
```

### 6.3 Desktop — Gais (image left / type right) — **mirror**

```
┌──────────────────────────────────────┬──────────────────┐
│                                      │ Gais ·           │
│         PHOTO (default)              │                  │
│         303541 hallway /             │ Zahnarztpraxis   │
│         303511 treatment /           │ Palatty          │
│         303475 arrival               │                  │
│         (until Gais-specific shoot)  │ Lead CMS text    │
│                                      │                  │
│                                      │ [Termin verein.] │
└──────────────────────────────────────┴──────────────────┘
     ~7 cols                                ~5 cols
```

If the two heroes are swapped or use the same crop, the sites will feel duplicated — **reject in review**.

### 6.4 Mobile — both (shared stack; photo second)

```
┌─────────────────────┐
│ Location · Palatty  │
│ Headline            │
│ Lead                │
│ [Termin]            │
├─────────────────────┤
│                     │
│   FULL-BLEED PHOTO  │
│   (location default)│
│                     │
└─────────────────────┘
```

### 6.5 Section 01 — Vertrauen (photography leads)

```
Desktop Appenzell:  [ full-bleed 303287 ]  caption hairline under
Desktop Gais:       [ full-bleed environmental staff / interior ]
NO card frame. NO rounded media chrome unless radius = 0.
```

### 6.6 Section 02 — Leistungen (A — indexed list)

```
01  Prophylaxe                         Mehr →
    ─────────────────────────────────────────
02  Ästhetik                           Mehr →
    ─────────────────────────────────────────
03  …                                  Mehr →
```

Optional small thumbnail **flush left of index**, not inside a floating card.

### 6.7 Section 04 — Orte (C)

```
┌─────────────────────┬─────────────────────┐
│ ● Appenzell         │ ○ Gais              │
│ (current)           │                     │
│ short CMS blurb     │ short CMS blurb     │
│ [Zur Praxis Gais →] │ (or reverse)        │
└─────────────────────┴─────────────────────┘
```

Accent pip only; surfaces paper + hairline. Cyan only on the text link/button to the other domain.

---

## 7. Hero composition & photography placement

### 7.1 Hero rules

| Rule | Spec |
| --- | --- |
| Motif | Real photo — **not** Alpine WebGL |
| Clear zone | Type sits on paper (split) or on a solid paper panel over photo — avoid heavy dark scrims |
| Focal point | Faces (team) or desk/chair (interior); set Payload focal points later |
| Cyan in hero | CTA button only (+ optional 2px rule under location label) |
| 3D | Off for brand identity; contour SVG (C) optional later as 1px margin mark |

### 7.2 Recommended asset defaults (provisional shortlist)

| Slot | Appenzell | Gais |
| --- | --- | --- |
| Hero | `303287` or `303475` | `303541` or `303511` (**shared SDN pack — not Gais-specific**) |
| Vertrauen | `303287` / `303384` | Different crop/lead from same pack |
| Praxis | `303511`, `303475` | Different lead image from same pack |
| Team grid | Studio five | Studio five (shared) |

**Content-plan gap (must stay visible):** There is **no Gais-only exterior or reception photography** in the current SDN delivery. Until a Gais shoot exists, Gais pages may use shared interiors with **different crops and mirror layout**, but must **not** imply Appenzell photographs depict the Gais site. Captions / CMS alt text should remain place-neutral or explicitly Appenzell when identifiable.

Patient-adjacent (`303348` / `303361`): still on hold.

### 7.3 Image treatment

- Edge-to-edge or column-bleed; captions as editorial lines under the frame.
- Object-position from audit focal points.
- No sticker badges on faces.
- Studio portraits: equal square crops in a rigorous grid — hairline gutters, not cards with shadows.

---

## 8. Desktop & mobile layout examples (key templates)

### 8.1 Service detail (both locations)

```
Desktop:  index+title (4) | body (5) | photo (3)
Mobile:   title → photo → body → CTA
```

### 8.2 Team index

```
Desktop:  5-up square portraits, labels under (name/role from CMS only)
Mobile:   2-up
No rounded avatar rings required; square is fine.
```

### 8.3 Contact

```
This location only: address, phone, hours (CMS)
Secondary link: “Andere Praxis: Gais/Appenzell” via switcher pattern
Map optional later — not a hero substitute
```

---

## 9. Motion (restrained)

| Pattern | Spec |
| --- | --- |
| Page enter | Optional short fade-up on hero type only |
| Hover | Colour on links/CTA; no lift-shadow carnival |
| Location switch | Instant navigation (full document) — no fake SPA morph |
| Reduced motion | Honour `prefers-reduced-motion` |
| 3D / WebGL hero | **Not part of v2 brand** |

---

## 10. Component inventory — retain / redesign / remove

### 10.1 Retain (structure / behaviour; restyle later)

| Component | Why |
| --- | --- |
| `Container`, `Section`, `Stack`, `Cluster` | Layout primitives still valid |
| `Field`, `Label`, `Input`, `Textarea`, `Select`, `FieldHint` | Form behaviour |
| `SkipLink`, `Prose`, `Divider` (as hairline) | A11y / editorial |
| `Breadcrumbs`, `OpeningHours`, `ContactInfo` | Practical CMS-driven UI |
| `Button` / `ButtonLink` / `TextLink` / `AppointmentCTA` | Keep API; change visuals |
| `MediaFrame`, `ImageGallery` | Keep; strip decorative chrome |
| `NavBar`, `SiteFooterBar`, `LocationCard` | Keep as shells; rethink composition |
| Payload collections, domain resolution, media pipeline | Architecture |

### 10.2 Redesign (visual language + patterns)

| Component / pattern | Change to |
| --- | --- |
| Colour tokens | Paper / ink / wood / navy / **cyan signal** + location accents |
| Typography loading | Replace Newsreader+Manrope lock with Schriftbau grotesque system |
| `Button` | Rectangular; cyan primary; secondary = ink outline; kill soft wellness look |
| `Badge` | Rare; square; outline — not soft sage pills |
| `Surface` | Deprecate as default “card”; use only for true interactive panels |
| `ServiceCard` | Replace usage with **indexed service row** |
| `StaffCard` | Flatten: image + name/role; no card chrome |
| `LocationCard` | Become switcher-friendly place module with accent pip |
| `NavBar` | Add first-class location switcher; cyan CTA rules |
| `Heading` / `Text` / `Eyebrow` | Map to new type scale; indexes |
| Homepage / site chrome | Mirror heroes; photo-led sections |
| Focus ring | Cyan-deep compatible |

### 10.3 Remove or retire from brand expression

| Item | Action |
| --- | --- |
| Fir / sage / glacier brand anchors | Remove from brand role |
| Alpine silhouette as homepage identity | Retire from brand; feature-flag off; do not market as motif |
| Glacier section bands / alpine-grain washes | Remove as default section treatments |
| Soft multi-radius card grids for services/team | Stop using as default |
| Decorative mountain/landscape stock | Never |
| Wellness gradient heroes | Never |

### 10.4 New components to design (when implementation approved)

| Component | Purpose |
| --- | --- |
| `LocationSwitcher` | Header + mobile; domain-aware |
| `IndexedRow` / `ServiceIndex` | Leistungen list pattern |
| `EditorialSplit` | 5/7 and 7/5 photo–type splits (incl. mirror prop) |
| `LocationPip` | Accent marker |
| Optional `ContourMark` (SVG) | Sparse C graphic — after photography system is solid |

---

## 11. Accessibility notes (carry forward)

- Cyan CTA: verify white-on-cyan ≥4.5:1; darken to `--palatty-cyan-deep` if needed.
- Do not rely on cyan alone for location — include text name.
- Target sizes ≥44px for primary controls.
- Alt text: descriptive; names only after CMS confirmation.

---

## 12. Out of scope for this document

- Editing `tokens.css` or components  
- Phase 3 page build  
- Payload Media upload  
- New photography shoots (note: Gais-specific exteriors still a coverage gap)  
- WebGL work  

---

## 13. Approval gate

| Question | Needed before implementation |
| --- | --- |
| Colour roles + cyan budget | Approve / adjust |
| Type direction (grotesque family choice) | Approve / pick licensed vs open |
| Mirror homepage wireframes | Approve / adjust |
| Location switcher behaviour | Approve / adjust |
| Retain / redesign / remove list | Approve / adjust |

**Next authorised step after your sign-off:** Visual Identity v2 implementation (tokens + showcase rebuild) — still **not** full Phase 3 marketing UI unless you explicitly expand scope.

---

*End of specification. Awaiting review.*
