# Component guidelines

Import from `@/design-system`. All components are typed React. Prefer semantic HTML and visible focus states (`--focus-ring`).

## Principles

1. **One job** — each component does one clear thing.
2. **Flat over chrome** — avoid default card boxes; use hairlines, `Surface`, or editorial borders when needed.
3. **CMS-owned facts** — never hardcode addresses, phones, booking URLs, staff titles, or medical claims.
4. **Shared brand** — Appenzell and Gais use the same components; only data differs.
5. **Accessible** — labels, `aria-*`, keyboard focus, sufficient contrast.

## Inventory

| Component | Use |
| --- | --- |
| `Container` / `Section` | Page structure, tone bands |
| `Stack` / `Cluster` | Vertical / wrapping layout |
| `Heading` / `Text` / `Eyebrow` / `Lead` / `Prose` | Typography |
| `Button` / `ButtonLink` / `TextLink` / `AppointmentCTA` | Actions |
| `Field` / `Label` / `Input` / `Textarea` / `Select` / `FieldHint` | Forms |
| `NavBar` | Header chrome |
| `SiteFooterBar` | Footer composition |
| `ServiceCard` / `StaffCard` / `LocationCard` | Content teasers |
| `MediaFrame` / `ImageGallery` | Photography |
| `OpeningHours` / `ContactInfo` / `Breadcrumbs` | Practical UI |
| `Badge` / `Divider` / `Surface` / `SkipLink` | Supporting |

## States (required)

| State | Expectation |
| --- | --- |
| Default | Clear hierarchy |
| Hover | Fast colour/opacity (`--duration-fast`) |
| Focus | `--focus-ring` via `:focus-visible` |
| Disabled | Reduced opacity, no pointer events |
| Inverse | For fir-deep bands only |

## Anti-patterns

- Pill clusters, icon soups, multi-shadow stacks
- Invented staff biographies on `StaffCard`
- Decorative gradients as component backgrounds
- Separate component trees per location domain
