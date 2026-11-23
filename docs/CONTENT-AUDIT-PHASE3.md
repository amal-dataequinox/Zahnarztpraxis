# Phase 3 content audit — existing sources

**Status:** Audit only · **Phase 3 NOT authorised**  
**Sources checked:** live WordPress sites (2026-11-19), `src/seed/index.ts`, design-system showcase (non-authoritative)  
**Purpose:** List migration reference facts, conflicts, and gaps for practice approval before any Phase 3 build.

| Source | Appenzell | Gais |
| --- | --- | --- |
| Live site | https://zahnarztpraxis-palatty.ch | https://zahnarzt-palatty.ch |
| Seed domain | `zahnarztpraxis-palatty.ch` | `zahnarzt-palatty.ch` |

---

## 1. Legal entity / brand naming

| Item | Appenzell (live) | Gais (live) | Seed | Status |
| --- | --- | --- | --- | --- |
| Display name | Zahnarztpraxis Palatty Appenzell ag | Zahnarztpraxis Palatty Gais ag | Zahnarztpraxis Palatty Appenzell / Gais | Align casing (AG vs ag) |
| Impressum title | **Zahnarztpraxis Palatty Appenzell AG** | **Zahnärztin Gisha Palatty** (not “Palatty Gais AG”) | Uses practice names | **Conflict** — confirm legal entities |
| Motto (body) | „Dein Lächeln. Unsere Leidenschaft.“ | Same motto (grammar slightly broken on Gais) | Seed shortDescription is different (see §5) | Confirm motto for Phase 3 |

---

## 2. Addresses

| Field | Appenzell | Gais | Seed match? |
| --- | --- | --- | --- |
| Street | Zielstrasse 14B / “14 B” (spacing varies) | Zellwegstrasse 4 | Yes (seed: `14B` / `4`) |
| PLZ / Ort | 9050 Appenzell | 9056 Gais | Yes |
| Country | Schweiz | Schweiz | Yes |
| Maps | Live “Routenplaner”; seed has Google Maps directions URLs + lat/lng | Same pattern | Seed URLs present; **verify** still correct |

**Pending approval:** normalize `14B` vs `14 B`; confirm maps coordinates.

---

## 3. Phone, email, HIN

| Channel | Appenzell (live) | Gais (live) | Seed | Status |
| --- | --- | --- | --- | --- |
| Phone | +41 71 787 82 82 | +41 71 793 10 20 | Same | Matches seed · **verify current** |
| Praxis email | praxis@zahnarztpraxis-palatty.ch | praxis@zahnarzt-palatty.ch | Same | Matches seed · **verify** |
| HIN | zahnarztpraxispalattyai@hin.ch | zahnarztpraxispalatty@hin.ch | **Not in seed** | **Missing from seed** · confirm both |
| Emergency | 0844 144 006 (städtischer Notfalldienst) | Same text | Same in seed | Matches · **verify** still correct |
| Impressum junk | `info@sz-rankweil.at` appears next to phone | Same leftover | Not seeded | **Conflict / error** — do not migrate |

---

## 4. Opening hours — **major conflicts**

### 4.1 Appenzell

| Surface | Hours stated |
| --- | --- |
| Main “Öffnungszeiten” + Kontakt-Info block | **Mo, Do, Fr** 08:00–12:00 / 14:00–18:00 · **Di, Mi** 08:00–12:00 / 13:00–17:00 |
| Footer “Kontaktdaten” | **Mo–Sa** 08:00–12:00 / 13:00–17:00 |
| Seed / Docnear listing | Aligns with **main block** (Sat/Sun closed; Mo/Do/Fr afternoon 14–18; Di/Mi afternoon 13–17) |
| local.ch (third party) | Mo–Fr all 08–12 / 14–18 — **differs again** |

**Conflict:** Main content ≠ footer. Seed follows main content, not footer.  
**Decision needed:** Which schedule is production-true?

### 4.2 Gais

| Surface | Hours stated |
| --- | --- |
| Main “Öffnungszeiten” | **Di–Sa** 08:00–17:30 (practice open) |
| Telefonische Erreichbarkeit | **Mo–Sa** 08:00–17:30 |
| Footer “Kontaktdaten” | **Mo–Sa** 08:00–12:00 / 13:00–17:00 |
| Seed | Practice: Mo closed; Di–Sa 08:00–17:30 · Telephone: Mo–Sa 08:00–17:30 |

**Conflict:** Main + telephone block ≠ footer lunch-break schedule. Seed follows main/telephone split, not footer.  
**Decision needed:** Confirm practice hours vs phone hours vs footer.

---

## 5. German homepage / practice copy

### Shared tagline (both live heroes)

> Professionelle zahnärztliche Fachkompetenz und Ihr Wohlbefinden sind für uns untrennbar. Wir freuen uns auf Ihren Besuch.

Seed `shortDescription` = this string for **both** locations.

### Appenzell body (live — migration candidate)

- Welcome in Appenzell; modern dentistry + personal care  
- Motto „Dein Lächeln. Unsere Leidenschaft.“  
- Familienzahnarztpraxis; trust, transparency, modern rooms, motivated team  

### Gais body (live — migration candidate)

- Practice on Zellwegstrasse for **40+ years**, now continued  
- Motto „Dein Lächeln. Unsere Leidenschaft“ (punctuation incomplete vs Appenzell)  
- Dentalhygiene through aesthetic / age / children’s dentistry; transparent costs; further education  

### Design-system-only lines (not on live sites)

| Line | Where | Live? |
| --- | --- | --- |
| „Natürlich. Persönlich. Präzise.“ | Visual Identity showcase | **No** — invented for design specimens |
| „Dieselbe Praxis. Anderer Ort.“ | Showcase Gais concept | **No** |

**Do not treat showcase headlines as approved marketing copy** unless practice adopts them.

### Costs block (both sites — similar)

- Follows SSO guidelines / Sozialversicherungspartner  
- DENTOTAR® Mindesttarif since Jan 2018  
- Taxpunkt **1.10**  
- Written Kostenvoranschlag offered  

**Pending:** confirm Taxpunkt 1.10 still current before publishing.

---

## 6. Services / Leistungen

### Seed (names only — no medical descriptions)

1. Prophylaxe  
2. Dentalhygiene  
3. Zahnimplantate  
4. Zahnersatz  
5. Kieferorthopädie  
6. Ästhetische Zahnmedizin  
7. Zahnfüllungen  
8. Notfallbehandlung  

### Live sites (prose + featured cards — not the same taxonomy)

Mentioned in body / cards (union of both sites):

- Professionelle Zahnreinigung / Dentalhygiene  
- Füllungstherapie; Keramik Inlay / Onlay / Overlay  
- Kronen / Zirkonoxid-Kronen  
- Wurzelkanalbehandlung  
- Zahnersatz: Brücken, Implantatkronen, Prothesen / Gussprothesen  
- Chirurgie / Zahn- und Wurzelrestentfernung / „Alltägliche Zahnchirurgie“  
- Aligner / kieferorthopädische Korrektur  
- Mobile Zahnmedizin (Altersheime / zu Hause)  
- Parodontitis Behandlung  
- Digitale Zahnabdrücke (**Gais card**; not clearly mirrored on Appenzell fetch)  
- Alters- und Kinderzahnheilkunde (Gais prose)

**Gaps / conflicts**

| Issue | Detail |
| --- | --- |
| Taxonomy mismatch | Seed list ≠ live card titles / prose structure |
| Shared vs location-specific | Confirm which services apply to both branches |
| Descriptions | Seed intentionally empty; live prose exists — **reuse after editorial approval**, do not invent |
| “Notfallbehandlung” | In seed; live emphasises emergency **phone** 0844 144 006 more than a service page |

---

## 7. Booking / CTA

| Item | Finding | Status |
| --- | --- | --- |
| Live CTA label | „Online Terminbuchung“ | Present on both sites |
| Seed Appenzell `bookingUrl` | `https://booking.denteo.com/de/.../locations/2` | Present in seed |
| Seed Gais `bookingUrl` | `https://booking.denteo.com/de/.../locations/1` | Present in seed |
| Denteo page fetch | Returned empty/minimal content (likely JS app) | **Integration not verified in this audit** |
| Contact form | Live sites mention Kontaktformular | Behaviour/spam tooling (reCAPTCHA) on Datenschutz |
| Phase 3 instruction | Placeholder CTA only until booking confirmed | **Do not wire live Denteo until approved** |

Also: phone + email + form listed as alternate contact paths on both sites.

---

## 8. Team

### Live Appenzell (`/team`)

| Name | Role (as published) |
| --- | --- |
| Med. Dent Gisha Palatty | Eidg. Dipl. Zahnärztin & Inhaberin (+ bio) |
| Poput Christina Mirela / Dr. med. dent. | Zahnärztin (+ bio; naming order varies) |
| Jeanine Weishaupt | Praxismanagerin, Prophylaxeassistentin & Dentalassistentin EFZ |
| Belma Music | Prophylaxeassistentin & Dentalassistentin EFZ |
| Judith Dörig | Dentalassistentin EFZ in Ausbildung |
| Riana Sutter | Dentalassistentin EFZ in Ausbildung |
| Antonio Elenjikkal | CEO und Inhaber |

### Live Gais (`/team`)

| Name | Role (as published) |
| --- | --- |
| Med. Dent Gisha Palatty | Eidg. Dipl. Zahnärztin & Inhaberin (+ bio) |
| Med. dent. Georgia Glania | Zahnärztin |
| Jagana Chanthirathas | Praxismanagerin & Dentalassistentin EFZ |
| Nohat Ahmad | Dentalassistentin EFZ in Ausbildung |
| Elvira Keel | Prophylaxeassistentin & Dentalassistentin EFZ |
| Antonio Elenjikkal | CEO und Inhaber |

### Seed / CMS

- **No team members seeded** (by design).

### Photography filename ↔ live name (inventory only — **not approved mappings**)

| Studio file | Filename suggests | On Appenzell team page? | On Gais team page? |
| --- | --- | --- | --- |
| `ChristinaMileraPoput-…` | Christina / Poput | Yes (Christina Poput) | No |
| `JeanineWeishaupt-…` | Jeanine Weishaupt | Yes | No |
| `BelmaMusic-…` | Belma Music | Yes | No |
| `RianaSutter-…` | Riana Sutter | Yes | No |
| `DalinaJahiu-…` | Dalina Jahiu | **Not listed** on either team page | **Not listed** |

**Missing portraits in SDN pack for published names:** Gisha Palatty, Judith Dörig, Antonio Elenjikkal, Georgia Glania, Jagana Chanthirathas, Nohat Ahmad, Elvira Keel (and any others).

**Phase 3 rule (confirmed):** leave team empty in UI until CMS names/roles/portrait mappings are confirmed. Do not guess photo identity.

---

## 9. Privacy / legal pages

| Page | Appenzell | Gais |
| --- | --- | --- |
| Impressum | `/impressum/` | `/impressum/` |
| Datenschutz | `/datenschutz/` and `/datenschutzerklaerung/` (both appear in search) | `/datenschutzerklaerung/` |
| Template pollution | `info@sz-rankweil.at` in Impressum/Datenschutz | Same |
| Legal basis language | Heavy **DSGVO** wording (EU template) | Same |
| Swiss nDSG alignment | **Not audited for compliance** | Needs Swiss legal review |

**Pending:** approved Impressum + Datenschutz text per entity (Appenzell AG vs Gais); remove Rankweil leftovers; confirm Swiss privacy wording.

---

## 10. Navigation (live vs seed)

Seed main nav: Start · Leistungen · Team · Kontakt  

Live sites also surface Angebot, Online Terminbuchung, Team, Kosten, Impressum, Datenschutz (WordPress IA).  

**Pending:** confirm Phase 3 nav = seed four items + legal footer links only.

---

## 11. Approval checklist (blockers before Phase 3)

Mark each item when the practice confirms:

### Critical conflicts

- [ ] **Appenzell hours:** main schedule vs footer vs third-party listings  
- [ ] **Gais hours:** Di–Sa 08–17:30 (+ Mo phone) vs footer Mo–Sa lunch-break times  
- [ ] **Legal entity names** on Impressum (Appenzell AG vs “Zahnärztin Gisha Palatty” for Gais)  
- [ ] **Remove** `info@sz-rankweil.at` everywhere  

### Verify / confirm

- [ ] Addresses (`14B` formatting), phones, praxis emails, **both HIN addresses**  
- [ ] Emergency number 0844 144 006 still correct  
- [ ] Motto „Dein Lächeln. Unsere Leidenschaft.“ retained?  
- [ ] Hero/practice German copy reuse from §5 (submit draft after selection)  
- [ ] Service taxonomy: keep seed 8 names, remap to live prose, or new list?  
- [ ] Taxpunkt 1.10 still valid  
- [ ] Denteo booking URLs still valid **or** Phase 3 ships placeholder CTA only (current instruction)  
- [ ] Team CMS entries + portrait mappings (incl. what to do with `DalinaJahiu` file)  
- [ ] Patient-adjacent photography consent (still on hold)  
- [ ] Gais shared-interior labelling OK for launch (already directed)  
- [ ] Payload Media upload still deferred (already directed)  
- [ ] Swiss Datenschutz / Impressum text approved for both domains  

### Explicitly out of scope until authorised

- Phase 3 UI implementation  
- Invented medical claims or team identities  
- Wiring live booking as if confirmed  
- Uploading SDN masters to Payload Media  

---

## 12. Recommended next step

1. Practice reviews this audit and returns decisions on every **Critical conflict** and **Verify** checkbox.  
2. Optional: short approved German copy pack (hero + service teasers) derived from §5.  
3. Only then: explicit **“Start Phase 3”** authorisation.

**Phase 3 remains frozen until that authorisation.**
