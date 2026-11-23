# 3D art direction — Distant Alpine silhouette

**Status:** Art direction locked · **runtime scaffold implemented** (procedural WebGL + static fallback).  
Final Blender GLB assets are still pending artist production; the live scene is a low-poly stand-in that follows this spec.

| Item | Decision |
| --- | --- |
| Primary homepage motif | **Distant Alpine silhouette** (concept 3) |
| Supporting atmosphere | Soft mist plane + fog (optional volumetric fog TBD in Blender) |
| Secondary section motif | Abstract limestone pavilion — reserved for Praxis / Ankommen |
| Human / clinical content | Real client photography only (SDN pack + CMS Media) |
| Runtime | `@react-three/fiber` + `three` · `src/components/three/*` |
| Feature flag | `NEXT_PUBLIC_ENABLE_ALPINE_3D` (default on; `false` forces SVG fallback) |

---

## 1. Decision summary

We choose a **layered distant mountain silhouette** inspired by the Appenzellerland as the primary homepage 3D direction.

The scene must feel:

- editorial and architectural
- premium healthcare-calm (not entertainment)
- Swiss-landscape specific without becoming a tourism postcard or game world

Typography and CTAs remain the hero content. The 3D environment is a **quiet depth plane behind / beside type**, never the product.

---

## 2. Visual composition

### 2.1 Landscape structure

- Multiple **layered Alpine ridgelines** (foreground, middle-ground, background).
- Soft **atmospheric depth**: subtle haze and mist between layers.
- Gentle silhouette variation — ridges should feel observed, not fractal noise or sci-fi peaks.
- Restrained natural detail: soft rock massing, snow pockets, tree-line suggestion at most. No busy forests, chalets, or village dioramas in the hero scene.
- **Large negative space** (sky / mist field) reserved for website typography and CTAs — typically the upper-left to centre band on desktop.

### 2.2 Composition diagram (conceptual)

```
┌──────────────────────────────────────────────────────────┐
│  Negative space / mist sky          TYPE + CTA ZONE      │
│  ······················································  │
│           ~~~~ background ridge (lightest) ~~~~          │
│        ~~~~~ middle ridge (mid value) ~~~~~              │
│     ~~~~ foreground ridge (darkest, soft edge) ~~~~      │
│  ground / haze fade into page background                 │
└──────────────────────────────────────────────────────────┘
```

### 2.3 Depth roles

| Layer | Role | Visual treatment |
| --- | --- | --- |
| Background | Distant massif | Lightest value, highest haze, lowest contrast |
| Middle-ground | Secondary ridge | Mid value, soft edge, slight detail |
| Foreground | Near ridge / foothill | Darkest (fir-leaning), soft silhouette, minimal texture |
| Atmosphere | Haze / mist volumes | Very low opacity; optional volumetric treatment |
| Clear space | Editorial field | Uncluttered sky/mist for Newsreader headlines |

---

## 3. Visual design

### 3.1 Scene palette (3D-specific)

These colours grade the **3D environment**. UI tokens in `src/design-system/tokens.css` remain the product chrome source of truth; the scene palette is intentionally close but tuned for atmospheric rendering.

| Name | Hex | Use in scene |
| --- | --- | --- |
| Fir | `#263B32` | Foreground ridges, deepest silhouettes |
| Glacier | `#C4D7D8` | Distant haze, cool sky wash, far ridges |
| Chalk | `#F3F0E7` | Ambient fill, soft sky base, page blend edge |
| Sage | `#A7B2A0` | Mid-ridge vegetation suggestion, soft secondary mass |

Value progression should read **fir → sage → glacier → chalk** from near to far.

### 3.2 Materials

- Matte natural surfaces only.
- Soft **stone-like** appearance (limestone / weathered rock), not polished marble.
- Natural, soft daylight — overcast Alpine morning preferred.
- **No** metallic, chrome, specular spikes, or clear-coat car-paint looks.
- **No** neon, purple glow, emissive fantasy materials, or artificial gradient shaders as the look.

Suggested Blender material intent:

| Material | Base | Roughness | Notes |
| --- | --- | --- | --- |
| `MAT_Ridge_Near` | Fir `#263B32` | 0.85–0.95 | Almost flat silhouette |
| `MAT_Ridge_Mid` | Sage `#A7B2A0` | 0.8–0.9 | Slight value noise only |
| `MAT_Ridge_Far` | Mix sage/glacier | 0.75–0.9 | Heavily haze-tinted |
| `MAT_Atmosphere` | Glacier/chalk | n/a | Volume or transparent planes; keep cheap |

Texture maps, if used, must be subtle (micro height / AO). Prefer vertex colour or solid materials for silhouette layers to keep the GLB light.

### 3.3 Lighting

- Single soft key: cool daylight from upper-left or upper-centre (Alpine overcast).
- Low-contrast fill from chalk-tinted environment / HDRI with intensity restrained.
- Avoid hard shadows that cut through the type zone.
- No coloured rim lights, god-ray theatrics, or animated neon accents.

---

## 4. Animation direction (future implementation only)

When (and only when) engineering integrates the scene, motion must stay subordinate to content. Align with [ANIMATION.md](./ANIMATION.md).

**Allowed (subtle):**

- Very slight **multi-layer parallax** on pointer / scroll (foreground moves more than background).
- Slow atmospheric drift (mist opacity / offset measured in minutes-scale loops, not busy loops).
- Gentle camera transitions on route enter (≤ few degrees / few centimetres of virtual move).
- Immediate static pose when `prefers-reduced-motion: reduce`.

**Avoid:**

- Orbiting cameras, fly-throughs, gamified exploration.
- Continuous spinning, bouncing, or particle fireworks.
- Parallax that causes layout shift, vertigo, or competes with reading.

---

## 5. Blender production specification

### 5.1 Camera and composition

| Setting | Spec |
| --- | --- |
| Camera type | Perspective |
| Focal length | ~40–50mm equivalent (editorial, not ultra-wide distortion) |
| Camera height | Slightly above mid-ridge horizon; look toward horizon, not down into a valley bowl |
| Horizon | Place in the **lower third to mid** so the upper field stays clear for type |
| DOF | Prefer optical clarity; if used, keep subtle — never blur the type zone |
| Clipping | Generous far clip so distant ridges do not pop |

Lock a named camera: `CAM_Hero_Desktop`.

### 5.2 Desktop and mobile framing

| Viewport | Framing notes |
| --- | --- |
| Desktop (≥1024px) | Wide landscape; type sits safely in upper-left / upper-centre clear mist; ridges occupy lower 40–55% |
| Tablet | Same composition; ensure left ~45% remains calm for stacked headline + CTA |
| Mobile | Prefer a **secondary camera** `CAM_Hero_Mobile` or tighter crop: keep at least the top ~50% of frame as clear space; avoid a ridge peak sitting under the H1 |

Deliver stills from both cameras for art review before any realtime work.

### 5.3 Scene layers (collections)

Recommended Blender collection structure:

```
SC_Palatty_Hero_AlpineSilhouette
├── CAM
│   ├── CAM_Hero_Desktop
│   └── CAM_Hero_Mobile
├── LIGHT
│   ├── LGT_Key_Daylight
│   ├── LGT_Fill_Soft
│   └── LGT_World_Env (or World settings)
├── GEO_Foreground
│   └── Ridge_Near
├── GEO_Middleground
│   └── Ridge_Mid
├── GEO_Background
│   └── Ridge_Far (+ optional secondary far band)
├── FX_Atmosphere          ← optional; can be omitted for v1 GLB
│   └── Mist / volume / card planes
├── REF_Guides             ← not exported
│   ├── SafeType_Desktop
│   └── SafeType_Mobile
└── OUT_Export
    └── (export assembly / empties)
```

Empty objects / empties for parallax pivots: `XFORM_Parallax_Near`, `XFORM_Parallax_Mid`, `XFORM_Parallax_Far`.

### 5.4 Geometry guidelines

- Silhouette-first modelling: readable massing over triangulation noise.
- Target **low-poly** layered meshes (see performance). Prefer few large forms over thousands of micro rocks.
- No Swiss-chalet kits, cows, flags, or path networks in this hero file.
- Keep origin centred; ground plane aligned so the web scene can sit the model without mystery offsets.

### 5.5 Material definitions (Blender naming)

Use the `MAT_*` names in §3.2. Assign only those materials to export collections. Do not pack unused library materials into the GLB.

### 5.6 Lighting setup (checklist)

1. World strength low; chalk/glacier tint.
2. Key light large area / soft sun, cool white (~6500K feeling), soft shadows.
3. Optional fill from opposite side at ≤30% key.
4. Disable specular-dominant HDRI looks that create chrome sheen on stone.

### 5.7 Export requirements

| Item | Requirement |
| --- | --- |
| Format | **glTF 2.0 Binary (`.glb`)** |
| Units | Metres |
| Transform | Apply scale/rotation; Y-up or document engine conversion explicitly |
| Embed | Embed textures only if required; prefer untextured mats for v1 |
| Animations | None required for v1 (parallax can be runtime transforms) |
| Cameras / lights | **Do not rely on** exported lights for runtime; bake look into materials/values. Cameras are for stills / reference |
| Naming | `palatty-hero-alpine-silhouette-v001.glb` |
| Companion stills | PNG/WebP from `CAM_Hero_Desktop` and `CAM_Hero_Mobile` at 2x |

Export assembly should include only `GEO_*` (+ optional cheap `FX_Atmosphere` planes). Exclude `REF_Guides`.

### 5.8 GLB performance considerations

| Budget (v1 target) | Guidance |
| --- | --- |
| Draw calls | Prefer ≤ 5–8 meshes (merge by material where sensible) |
| Triangles | Aim **&lt; 50k** for hero silhouette set; stretch to ~80k only if justified |
| Textures | Avoid unless necessary; if used: ≤ 1–2 maps, ≤ 1k–2k, compressed |
| File size | Target **&lt; 1.5 MB** GLB for v1; hard review if &gt; 3 MB |
| Runtime | Progressive load; show static fallback first |
| Devices | Must remain acceptable on mid-range mobile GPUs |

### 5.9 Static image fallback

Always ship art-directed stills (and later CMS-managed hero images) so the site works when:

- WebGL is unavailable or blocked
- `prefers-reduced-motion: reduce`
- Low-power / data-saver modes
- Feature flag off

Fallback stills must use the same framing, palette and clear type zone as the realtime scene. Real practice photography remains separate content — do not replace clinical photos with 3D stills.

### 5.10 Accessibility considerations

- Scene is decorative: meaningful content must not exist only inside the canvas.
- Honour `prefers-reduced-motion` with a static frame (no parallax).
- Maintain contrast for text over the clear zone (type sits on chalk/mist, not dark fir rock).
- Do not convey essential information by colour or motion alone.
- Provide a non-canvas experience equivalent for all CTAs and copy.

---

## 6. Supporting motifs

| Motif | Role | When |
| --- | --- | --- |
| **Distant Alpine silhouette** | Primary homepage hero | Locked |
| **Volumetric fog over Appenzell ridges** | Optional atmospheric treatment on / behind silhouette layers | Additive; can be planes or light volume — keep cheap |
| **Abstract limestone pavilion** | Reserved for **Praxis / Ankommen** section | Separate Blender file later; not part of hero export |

Do not combine pavilion architecture into the homepage silhouette hero.

---

## 7. Explicit restrictions

Do **not** include:

- Swiss flags
- Floating miniature islands
- Cartoon cows
- Floating teeth or playful anatomical dentistry props
- Game-like traversable environments
- AI-generated fake practice or staff photography

**Primary human and clinical content** remains authentic client-provided office and staff photography (SDN pack and future CMS uploads). The 3D motif sets place and mood; photography sets trust and people.

---

## 8. Runtime implementation (current)

| Piece | Location |
| --- | --- |
| Hero integration | `HeroBlockView` — Alpine scene when no CMS hero image |
| Atmosphere shell | `src/components/three/AlpineHeroAtmosphere.tsx` |
| WebGL scene | `src/components/three/AlpineSilhouetteScene.tsx` |
| Static fallback | `src/components/three/AlpineSilhouetteFallback.tsx` |
| Palette | `src/components/three/alpinePalette.ts` |

**Behaviour**

- Static SVG paints first / for `prefers-reduced-motion` / when the feature flag is `false`.
- WebGL mounts client-side with subtle pointer parallax (disabled on small viewports for cost).
- CMS photography still wins when a hero/main image is set — clinical photos are not replaced by 3D.
- Payload CMS architecture is unchanged.

**Next artist step:** replace procedural ridges with the approved `palatty-hero-alpine-silhouette-v001.glb` without changing the shell API.

---

## 9. Review checklist (for stakeholders)

- [ ] Distant Alpine silhouette confirmed as homepage hero motif
- [ ] Palette (Fir / Glacier / Chalk / Sage) approved for scene grading
- [ ] Desktop and mobile clear-type zones accepted
- [ ] Restrictions list accepted (no flags, cows, teeth, islands, game worlds)
- [ ] Pavilion reserved for Praxis / Ankommen only
- [ ] Fallback stills + reduced-motion approach accepted
- [ ] Performance budgets accepted before modelling starts

---

## Related docs

- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — Alpine Modernism UI tokens and components
- [ANIMATION.md](./ANIMATION.md) — motion principles and reduced-motion
- [PHOTOGRAPHY.md](./PHOTOGRAPHY.md) — real practice photography guidelines
- [WEBSITE.md](./WEBSITE.md) — current website architecture (no 3D runtime yet)
