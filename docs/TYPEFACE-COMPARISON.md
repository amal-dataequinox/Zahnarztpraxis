# Typeface comparison — Visual Identity v2

**Purpose:** Select the grotesque family before token/showcase implementation.  
**Specimens (German):** Zahnmedizin · Natürlich · Behandlungen · Öffnungszeiten · Zahnärztliche Praxis  
**Date:** 2026-11-19

## Candidates

| Face | Foundry / source | Character |
| --- | --- | --- |
| IBM Plex Sans | IBM (OFL) via Google Fonts / `next/font` | Technical, highly usable, contemporary grotesque |
| Helvetica Now | Monotype | Polished contemporary Helvetica |
| Neue Haas Grotesk | Linotype / Monotype | Classic Swiss grotesque (Helvetica’s ancestor, restored) |
| Suisse Int'l | Swiss Typefaces | Contemporary Swiss International Style |

## Licensing & dual-domain reality

| Face | Web license model | Two Palatty domains |
| --- | --- | --- |
| **IBM Plex Sans** | SIL OFL — free commercial use, self-host or Google Fonts | ✅ Both domains, no pageview caps |
| Helvetica Now | Monotype **annual webfont**, prepaid pageviews, typically **one domain** per license | ⚠️ Likely **two** webfont licenses (Appenzell + Gais hosts) |
| Neue Haas Grotesk | Same Monotype annual webfont pattern | ⚠️ Same dual-domain cost/complexity |
| Suisse Int'l | Swiss Typefaces: desktop + WOFF2 included; self-host `@font-face`; unlimited sites once licensed | ✅ Strong if purchased; **not in repo today** |

We cannot ship Helvetica Now, Neue Haas Grotesk, or Suisse Int'l in this codebase without the practice purchasing and providing font files. Embedding without a license is not an option.

## German glyph & language notes

All four support Latin Extended needed for **ä ö ü Ä Ö Ü ß**.  
Critical specimen strings include stacked umlauts and long compounds (`Zahnärztliche`, `Öffnungszeiten`) — grotesques with open apertures and clear diacritics win for clinical UI.

| Face | German suitability (desk assessment) |
| --- | --- |
| IBM Plex Sans | Excellent; designed for product UI + multilingual; tabular figures available |
| Helvetica Now | Excellent; optical sizes help UI vs display |
| Neue Haas Grotesk Text | Excellent for body; Display cuts for headlines |
| Suisse Int'l | Excellent; International Style objectivity matches Schriftbau |

## Weights needed for v2

Minimum: Regular (400), Medium (500), SemiBold (600). Optional: Light for large display.  
IBM Plex Sans variable or discrete weights load cleanly via `next/font/google` with `latin` + `latin-ext`.

## Performance

| Face | Loading path | Notes |
| --- | --- | --- |
| IBM Plex Sans | `next/font` subsetting | Best DX; no extra vendor kit; swap display |
| Helvetica Now / NHG | Vendor webfont kit | Extra CSS + annual renewals; pageview metering |
| Suisse Int'l | Self-host WOFF2 | Excellent once files exist; no CDN hosting allowed by EULA |

## Creative fit vs Empfangscyan + Schriftbau

| Face | Fit |
| --- | --- |
| IBM Plex Sans | Aligns with **practice-first / technical clarity**; slightly less “Swiss poster” prestige |
| Helvetica Now | Strong polish; risk of looking default “corporate Helvetica” |
| Neue Haas Grotesk | Highest classic Swiss pedigree; best cultural match to Schriftbau *if licensed* |
| Suisse Int'l | Best contemporary Swiss authorship; ideal long-term brand face *if licensed* |

## Weight roles (approved)

| Weight | Use |
| --- | --- |
| Regular **400** | Body copy |
| Medium **500** | Navigation, labels, eyebrows |
| SemiBold **600** | Strong headings (H1–H4) |
| Light **300** | Large editorial lines only when specimens justify it |
| Tabular nums | Indexed service rows, opening hours |

Avoid stacking bold UI chrome that reads as a developer dashboard.

## Decision (locked for v2 implementation)

### **Implement with IBM Plex Sans**

**Why now**

1. Legal to ship immediately for both domains.  
2. German coverage and UI weights are proven.  
3. Performance and `next/font` integration are clean.  
4. Matches Empfangscyan’s “material / clinical honesty” better than soft geometric sans.

### Upgrade path (optional, post-purchase)

If the practice licenses **Suisse Int'l** (preferred) or **Neue Haas Grotesk Text + Display**, swap the `--font-sans` / `--font-display` files without changing layout rules. Helvetica Now is lower priority (more generic corporate signal; dual-domain Monotype cost).

**Not locked by name alone** — locked by license + German UI evidence + dual-domain constraints.

## Specimens (evaluation checklist)

When reviewing in the v2 showcase, set these strings in display and body:

- Zahnmedizin  
- Natürlich. Persönlich. Präzise.  
- Behandlungen  
- Öffnungszeiten  
- Zahnärztliche Praxis Appenzell  

Reject the face only if umlauts collide or `Öffnungszeiten` feels cramped at body size — then revisit with licensed Suisse/NHG.
