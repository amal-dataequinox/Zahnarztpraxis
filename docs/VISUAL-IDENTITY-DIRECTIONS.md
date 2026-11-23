# Visual identity reassessment — Zahnarztpraxis Palatty

**Status:** Creative investigation only. No tokens changed. No Phase 3. No new dependencies.  
**Date:** 2026-11-19  
**Domains:** [zahnarztvpraxis-palatty.ch](https://zahnarztpraxis-palatty.ch/) (Appenzell) · [zahnarzt-palatty.ch](https://zahnarzt-palatty.ch/) (Gais)

Technical QA of `/design-system` can pass while the brand still feels interchangeable. This document challenges **Alpine Modernism** before any further UI build.

---

## 1. Audit — why the current system feels generic

### Patterns that read as “AI premium healthcare”

| Pattern in current system | Why it feels generic |
| --- | --- |
| Fir `#263B32` + chalk `#F3F0E7` + sage `#A7B2A0` + glacier teal | Stock “nature calm” wellness kit used by hotels, skincare, retreats, clinics |
| Newsreader + Manrope | Competent editorial pairing; not owned; widely recommended in generative design |
| Rounded surfaces, soft bands, badge chips | Template component vocabulary |
| Generous whitespace without asymmetric tension | Calm, but not memorable composition |
| Distant Alpine silhouette as hero motif | Landscape as decoration; tourism-adjacent; not *this* practice |
| Card / teaser grids for services & team | Expected SaaS/clinic layout; low recognition |
| Shared “Alpine Modernism” label | Describes a mood, not a proprietary language |

### What the actual practice photography already says (underused)

From `assets/img/` (SDN pack):

- **Reception cyan / turquoise glass** desks — strong, unusual, ownable
- **Dark horizontal wood** cabinetry against white walls
- **Navy polos** with tooth-“P” sleeve mark
- **Clinical whites**, grey chairs, LED ceiling panels, frosted glass corridors
- **People first**: studio portraits + group at desk + environmental staff

This is already a sharper identity than fir-on-chalk wellness. The design system currently *competes* with the photos instead of amplifying them.

### Local references not yet in the system

| Source | Visual cue | Risk if misused |
| --- | --- | --- |
| [Bauatlas Appenzellerland — Anstriche und Farben](https://appenzellerland.bauatlas.ch/thema/anstrich-und-farbe) | Painted timber façades; subtle value shifts on pilasters/simses; white windows | Costume tourism / postcard kitsch |
| Innerrhoden farmhouse colour culture (Wohnteil light / Stall ocker, green shutters, red-brown doors) | High regional recognition | Must be abstracted, not literal Trachten branding |
| [Haus der Farbe — Farbkultur Appenzell Innerrhoden](https://hausderfarbe.ch/de/projekte-und-referenzen/farbkultur-in-appenzell-innerrhoden/) | Restrained contrast; landscape–façade dialogue | Over-romanticising “picturesque Appenzell” |
| Swiss editorial / Gerstner tradition | Asymmetry, grid discipline, typographic authorship | Cold / museum if photography is weak |
| Existing clinic interiors | Cyan desk, wood, glass, navy | Ignoring this = inventing a second brand |

### Verdict on current direction

**Keep:** Payload multi-domain architecture, real photography pipeline, German-first content model, restraint against purple/glow gimmicks.  
**Reopen:** Palette, type pairing, component chrome, hero motif, 3D necessity, card-first layouts.  
**Principle going forward:** Recognition comes from *composition + material evidence + proprietary graphic marks*, not from “premium calm” adjectives.

---

## 2. Shared requirements (all three directions)

1. One codebase / one brand system for Appenzell and Gais.
2. Location character through composition, accent, photography set, and graphic modules — not separate design systems.
3. Real SDN photography as primary visual proof; no fabricated staff or interiors.
4. Healthcare clarity: readable, accessible, trustworthy — without wellness cliché.
5. Distinctive enough that removing the word “Palatty” still leaves a recognisable artefact.

---

## 3. Direction A — **Schriftbau**

### Swiss Editorial Architecture

### Concept

Treat the website like a contemporary Swiss architecture monograph: **type and grid are the structure; photography is the evidence; ornament is almost absent.** Inspired by Karl Gerstner–era Swiss graphic discipline and contemporary editorial portfolios — not by spa branding.

The brand idea: *Palatty builds trust the way good Swiss buildings do — through precision you can see.*

### Rationale

Breaks the wellness palette trap by going **ink / paper / one sharp accent**. Distinctiveness comes from layout authorship (asymmetric columns, numbered sections, hard edges) rather than nature metaphors.

### Typography

| Role | Recommendation | Why |
| --- | --- | --- |
| Display | **GT Sectra** or **Editorial New** *or* system-test **IBM Plex Serif** (open) | Sharper, less “lifestyle magazine” than Newsreader |
| UI / body | **Inter Tight** or **ABC Diatype**-class *or* **IBM Plex Sans** | Neutral Swiss industrial; avoid rounded geometric Manrope softness |
| Numerals / indexes | Tabular lining figures; large section indices `01 / 02` | Proprietary editorial habit |

German hyphenation and measure become a feature (narrow column + wide image).

### Colour strategy

| Role | Direction |
| --- | --- |
| Ground | Warm paper white `#F7F5F0` *or* cool paper `#F4F4F2` — pick one, commit |
| Ink | Near-black `#121212` |
| Accent | **Clinic cyan** sampled from reception desk (approx. `#2BB5C4`–`#3EC1C9`) — *from the practice, not from nature mood boards* |
| Support | Wood charcoal `#2A2420` for footers / inverse |
| Avoid | Fir/sage/glacier stack; soft multi-pastels; gradient washes |

Accent used for rules, underlines, active location, focus — not large filled “calm” sections.

### Grid & layout

- Strict modular grid (e.g. 12-col) with **deliberate breaks**: headline spanning 5 cols, image 7.
- Hairline rules instead of cards.
- Section transitions via **index numbers + full-bleed photo**, not coloured bands.
- Near-zero border radius (0–2px).
- Whitespace as tension (uneven margins), not padding foam.

### Homepage hero art direction

- **No mountain 3D.**
- Desktop: large Newsreader-replacement headline left (asymmetric); right or below: full-bleed `303287` team or `303475` reception.
- Eyebrow: location name only (`Appenzell` / `Gais`).
- CTA as typographic link + one rectangular button — not soft pill.
- Mobile: type first, then edge-to-edge photo.

### Photography strategy

- Large, confident crops; captions as editorial credit lines (`Praxis · Empfang`).
- Prefer environmental proof (`303511`, `303475`, `303541`) over decorative landscape.
- Team studio set in a **rigorous grid** (equal crops, no playful cards).

### Navigation & components

- Top bar: brand wordmark + text links + rectangular CTA.
- Services as **indexed list** (`01 Prophylaxe`) with hairline separators — not three equal cards.
- Forms: sharp fields, visible labels, no soft “surface” chrome.
- Badges rare; if used, square and ink-outlined.

### Appenzell vs Gais

| Shared | Differentiated |
| --- | --- |
| Type, ink/paper, cyan accent, grid | Hero photo set per location when available |
| Component primitives | Opening block: Appenzell leads with town/practice exterior when shot; Gais with interior/arrival until exteriors exist |
| | Small location glyph (see graphic language) in header |

### 3D

**Not justified** for the hero. Optional later: abstract **wireframe façade module** or section cut — only if it reads as architecture graphics, not landscape souvenir.

### What makes it Palatty

Cyan accent taken from *their* desk; photography of *their* rooms; editorial numbering as habit; zero wellness gradient. Could not be swapped onto a skincare brand without looking wrong.

### Strengths / weaknesses

| Strengths | Weaknesses |
| --- | --- |
| Highly distinctive vs current AI clinic look | Can feel austere if photography is sparse |
| Scales cleanly for two domains | Requires strong art direction discipline in Phase 3 |
| Aligns with Swiss cultural credibility | Less “warm hug” on first glance |

### Implementation implications

- Likely **replace** current tokens and several components (radius, Surface-as-card, glacier bands).
- Existing Payload architecture unchanged.
- 3D hero work can be deprioritised or removed from homepage brief.

---

## 4. Direction B — **Empfangscyan**

### Practice-first material identity

### Concept

Build the brand from **what patients already see at the desk**: cyan glass, dark wood, navy uniforms, bright clinical rooms. The website should feel like walking into the Praxis — not like landing in Appenzellerland tourism.

The brand idea: *The place is the identity.*

### Rationale

The SDN pack already contains a proprietary material palette the current design system largely ignores. Making cyan + wood + navy primary creates instant recognition with staff uniforms and interiors. Regional character enters through **photography of place** and subtle graphic references — not through fir forests.

### Typography

| Role | Recommendation |
| --- | --- |
| Display | **Söhne** / **Neue Haas Grotesk**-class *or* open **Geist** / **Schibsted Grotesk** — strong grotesque, not soft geometric |
| Body | Same family, lighter weight — single-family system for cohesion |
| Optional italic display | One secondary serif only for long-form philosophy pages |

Drop Newsreader+Manrope pairing entirely to escape the current “editorial wellness” signal.

### Colour strategy

| Role | Source | Notes |
| --- | --- | --- |
| Primary | Reception cyan | Dominant brand colour (CTAs, links, rules) |
| Secondary | Navy from polos `#1B2A4A`–`#243B55` | Header / inverse |
| Neutral | Clinical white + limestone grey from floors | Backgrounds |
| Warm anchor | Dark wood `#3B2F28` | Footer, photo mats, dividers |
| Spot (rare) | Soft ocker from Innerrhoden stall tradition | Location badge for Appenzell only — never large fills |

No sage-fir chalk stack.

### Grid & layout

- Photography-led modules: **60/40 and 70/30 splits**, overlapping captions.
- Soft radius allowed only on **photos** (media), not on every button/card.
- Components feel like clinic wayfinding: clear, physical, sparse.

### Homepage hero art direction

- Full-bleed or near-bleed **reception / team** (`303287` or `303475`).
- Type overlaid in a protected clear zone (solid white panel or gradient scrim from photo — minimal).
- Brand name large; one sentence; one CTA.
- Hero is *evidence*, not illustration.

### Photography strategy

- Hierarchy: (1) people in space (2) reception architecture (3) treatment rooms (4) studio portraits.
- Cyan desk should appear often enough to become a brand mnemonic.
- Hold patient-adjacent frames until consent.

### Navigation & components

- Navy header bar or white header with cyan underline on active.
- Service entries as **photo + title** rows, not icon cards.
- Team: studio portraits on white — already match clinical aesthetic.
- Appointment CTA always cyan rectangle.

### Appenzell vs Gais

| Mechanism | Appenzell | Gais |
| --- | --- | --- |
| Spot accent | Tiny ocker mark / label | Tiny cool grey-blue mark (village/modern) |
| Default hero crop | Team at cyan desk | Interior corridor / arrival (`303541` / `303475`) until Gais-specific shoot |
| Copy tone | Historic town + practice continuity | Same brand voice; emphasise accessibility / local convenience via CMS content |

Shared cyan+navy keeps recognition when hopping domains.

### 3D

**Only if** it models the **reception desk geometry** or frosted glass corridor as abstract architecture — not mountains. Default recommendation: **no 3D**; photos already provide depth.

### What makes it Palatty

Anyone who has visited recognises the desk colour and uniforms online. The site cannot be mistaken for a generic Alpine spa.

### Strengths / weaknesses

| Strengths | Weaknesses |
| --- | --- |
| Fastest path to “this clinic” recognition | Less “cultural essay” prestige than Direction A |
| Leverages existing photo assets maximally | Needs careful cyan contrast for a11y |
| Easy dual-domain consistency | Risk of looking “interior catalogue” without strong type |

### Implementation implications

- Retoken around cyan/navy/wood/white.
- Hero art direction replaces Alpine silhouette as default.
- Existing 3D silhouette work becomes optional / off by default.

---

## 5. Direction C — **Zwei Firste**

### Dual-place graphic language (one system, two silhouettes)

### Concept

Appenzell and Gais are two practices under one name — like two roof ridges of an Appenzeller *Kreuzfirst* logic: **shared structure, angled difference.** The proprietary language is a custom graphic system of **architectural lines, section numbers, and location-specific contour marks**, while photography stays real and clinical.

The brand idea: *One Palatty. Two places. Readable at a glance.*

### Rationale

Direction A emphasises editorial austerity; B emphasises material. C emphasises **place differentiation as the brand feature**, answering the product reality (two domains) with a graphic system that competitors without dual locations cannot copy meaningfully.

### Typography

| Role | Recommendation |
| --- | --- |
| Display | High-contrast grotesque (**Unica**-descended) or Swiss-style **Akkurat**/open **Public Sans** with custom tracking |
| Location wordmarks | Same family, different **slant / cut**: Appenzell upright; Gais slightly condensed — subtle, not costume |
| Body | Same grotesque family |

Serif optional only for long articles — not the homepage hero.

### Colour strategy

| Role | Value |
| --- | --- |
| Base | White + black (strict) |
| Shared brand signal | Cyan (from desk) **or** navy (from polo) — pick **one** primary |
| Appenzell accent | Warm umber / soft ocker (façade culture, abstracted) |
| Gais accent | Cool slate (different contour, same weight) |
| Neutrals | Mid grey for rules only |

No multi-green nature stack.

### Grid & layout

- Shared grid; **location module** sits in a fixed slot (header corner + homepage margin).
- Asymmetric heroes: Appenzell type-left/image-right; Gais image-left/type-right (mirroring = “two firste”).
- Custom topographic / façade-line motifs as **SVG patterns** in margins — sparse, 1px, never full-bleed wallpaper.

### Homepage hero art direction

- Split composition: typography + one large practice photo.
- Corner **location contour mark** (custom drawn from ridge/settlement silhouette — abstract, not postcard mountain 3D).
- Section indexes `01`… with hairlines.
- CTA identical across domains; only accent + mirror layout change.

### Photography strategy

- Same quality bar as B; assign **default hero per location** once exteriors exist.
- Until then: shared interiors with different crops/focal points per domain.
- Studio portraits identical treatment (unity of team brand).

### Navigation & components

- Location switcher is a first-class component (not an afterthought): shows accent mark + place name.
- Lists and tables preferred over cards.
- Buttons rectangular; active state uses location accent.

### Appenzell vs Gais

Differentiation is **structural** (mirror layout, accent, contour mark), not a second palette family. Users should feel “same practice, other place” within one second.

### 3D

**Justified only as 2.5D/SVG motion** of the proprietary contour mark (subtle draw-on), not WebGL Alps. Expensive R3F landscape works against distinctiveness here.

### What makes it Palatty

The dual-location graphic logic *is* the product. Combined with cyan/navy from the clinic, it is hard to confuse with a single-site wellness template.

### Strengths / weaknesses

| Strengths | Weaknesses |
| --- | --- |
| Best expression of two-domain architecture | Requires custom illustration (contour marks) |
| Strongly anti-generic | Risk of gimmick if mirroring is overplayed |
| Clear Phase 3 art direction for both homepages | More design labour before build |

### Implementation implications

- New location graphic assets (SVG).
- Homepage templates with mirror variants driven by `resolveDomain()`.
- Design system must encode **location accent tokens** (`--accent-appenzell`, `--accent-gais`) under one brand primary.

---

## 6. Comparison matrix

| Criterion | A Schriftbau | B Empfangscyan | C Zwei Firste |
| --- | --- | --- | --- |
| Escape from AI wellness look | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Uses clinic photography as identity | ★★★★☆ | ★★★★★ | ★★★★☆ |
| Local Appenzell character (non-kitsch) | ★★★☆☆ | ★★★☆☆ | ★★★★☆ |
| Dual-location clarity | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| Implementation speed | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| Risk of coldness / austerity | Higher | Lower | Medium |
| Need for custom graphics | Low–medium | Low | High |
| Justifies WebGL mountains | No | No | No |
| Ownable mnemonic | Cyan + grid | Cyan desk + navy | Contour marks + mirror |

### Reference sources (investigation)

- Karl Gerstner / Swiss typographic programme tradition (editorial architecture mindset)
- [Kulturamt Appenzell Innerrhoden](https://www.ai.ch/) visual communications context
- [Bauatlas Appenzellerland — colour & façades](https://appenzellerland.bauatlas.ch/thema/anstrich-und-farbe)
- [Haus der Farbe — Farbkultur Appenzell Innerrhoden](https://hausderfarbe.ch/de/projekte-und-referenzen/farbkultur-in-appenzell-innerrhoden/)
- Client photography: `assets/img/`, `docs/PHOTO-ASSET-INVENTORY.md`
- Current system (anti-pattern baseline): `docs/DESIGN-SYSTEM.md`, `/design-system`

---

## 7. Recommendation

### Choose **Direction B — Empfangscyan** as the primary path, with **selected DNA from A and C**.

**Why B is strongest**

1. It centres the **real clinic** — the cyan desk, wood, navy team — which patients already associate with Palatty.
2. It is the fastest way to stop looking like a generic Alpine wellness template without waiting for a large illustration programme.
3. It makes photography strategy coherent: the design *serves* the SDN pack instead of covering it with fir/chalk atmosphere.
4. Dual domains stay unified through cyan/navy; location difference can still use C’s mirror layout and A’s editorial lists later.

**What to borrow**

| From A | From C |
| --- | --- |
| Asymmetric grids, hairlines, indexed services, near-zero radius | Location switcher as first-class UI; optional mirror hero; SVG contour marks *later* |
| Strict type hierarchy | Shared primary + thin location accents |

**What to drop from the current “approved” technical system (when redesign is authorised)**

- Fir / sage / chalk as brand anchors  
- Newsreader + Manrope as the locked pairing  
- Distant Alpine WebGL as homepage identity  
- Card-grid as default service/team pattern

**What to keep**

- Payload, domains, collections, media pipeline  
- Real photography rules and consent discipline  
- Accessibility bar and German-first content

### Explicitly not recommended as primary

- **A alone** — excellent, but colder and less immediately “this Praxis” without heavy photo art direction.  
- **C alone** — powerful for two sites, but custom graphics must not precede material truth.

---

## 8. Decision status

**Creative direction approved:** B foundation + A editorial structure + C location identity.

Revised specification (wireframes, tokens proposal, component retain/redesign/remove):  
→ [`VISUAL-SPEC-v2.md`](./VISUAL-SPEC-v2.md)

**Not yet approved:** design-system reimplementation · Phase 3 page build.

---

**Stop.** No design tokens, components, or pages were changed in this reassessment. Implementation awaits explicit approval of `VISUAL-SPEC-v2.md`.
