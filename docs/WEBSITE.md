# Website experience (Phase 3)

**Status:** Visual Identity v2 public UI in progress · content pending practice confirmation  
**Internal tool:** `/design-system` one-page showcase — do not modify for Phase 3 chrome

## Architecture

Both domains share one Next.js frontend. `SiteShell` resolves the active location, loads navigation / site settings, and wraps every public page with header + footer.

```
Request Host
    → resolveCurrentLocation()
    → SiteShell (nav, footer, location switcher)
    → Page (home / leistungen / team / kontakt / jobs / notfall / legal)
```

## Homepage

1. If a published CMS page with `pageType: home` exists for the location (or shared), its `layout` blocks are rendered via `RenderBlocks`.
2. Otherwise location-specific homepage compositions:
   - **Appenzell** (`AppenzellHome`): Stage 4 — type left / Distant Alpine depth right; photography in lower bands  
   - **Gais** (`GaisHome`): structural mirror only until Appenzell Stage 4 is approved
3. **Alpine WebGL** on Appenzell hero media column (`AlpineHeroAtmosphere`); SVG + reduced-motion fallbacks. See [`STAGE-4-3D-MOTION.md`](./STAGE-4-3D-MOTION.md).
4. Booking CTA is an identifiable **placeholder** (`/kontakt#termin`) — not a live Denteo claim.

## Routes

| Path | Role |
| --- | --- |
| `/` | Location homepage |
| `/leistungen`, `/leistungen/[slug]` | Shared service templates |
| `/team` | Empty until CMS team entries |
| `/kontakt` | Contact, hours, map, placeholder booking |
| `/jobs` | Careers placeholder |
| `/notfall` | Emergency info from location CMS |
| `/impressum`, `/datenschutz` | Legal placeholders pending counsel |

## Content rules

- No invented medical claims — service descriptions stay empty until editors add verified copy.
- No fabricated team members or photos — empty team state is intentional until CMS entries exist.
- Contact data always comes from the resolved `locations` document (no cross-domain leaks).
- Opening hours shown with migration disclaimer until practice confirms.

## Local preview

```bash
pnpm seed
pnpm dev
```

- http://appenzell.localhost:3000
- http://gais.localhost:3000
