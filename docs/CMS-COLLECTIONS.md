# CMS collections

All collections live under `src/collections/`. Block schemas live under `src/blocks/`. Shared field factories live under `src/fields/`.

## Users (`users`)

CMS authentication.

| Field | Notes |
| --- | --- |
| `name` | Required |
| `email` / `password` | Provided by Payload auth |
| `role` | `super-admin` \| `editor` (JWT-persisted, super-admin only to change) |
| `active` | Inactive accounts cannot log in |

Access: only super admins manage other users; users may read/update themselves.

## Locations (`locations`)

Independent practice locations. Each has its own domain, contact data and schedules.

Key fields: `name`, `slug`, `domain` (unique, validated hostname), `shortDescription`, structured `address`, `phone`, `email`, `googleMapsUrl`, `latitude` / `longitude`, `bookingUrl`, `openingHours`, `telephoneAvailability`, `emergencyInfo`, `mainImage`, `gallery`, `active`, plus SEO via `@payloadcms/plugin-seo`.

Opening hours and telephone availability use the shared `weeklyScheduleField`: one entry per weekday, with optional multiple time ranges and a closed flag. The two locations intentionally have different schedules.

## Pages (`pages`)

Dynamic pages with a blocks-based layout. Drafts and versions are enabled; the public only reads published documents.

Key fields: `title`, `slug` (unique per location-or-shared scope), optional `location`, `pageType` (`home` \| `standard` \| `contact` \| `legal`), `featuredImage`, `layout` (blocks), SEO.

### Layout blocks (schema only)

| Block | Slug | Purpose |
| --- | --- | --- |
| Hero | `hero` | Heading, subheading, image, CTA |
| Rich text | `richText` | Lexical content |
| Image and text | `imageText` | Image + rich text with left/right position |
| Image gallery | `imageGallery` | Array of images with captions |
| Services overview | `servicesOverview` | Selected or auto location services |
| Team overview | `teamOverview` | Selected or auto location team |
| Location information | `locationInformation` | Flags for address / hours / contact / map / emergency |
| Contact | `contact` | Intro + form / booking toggles |
| Call to action | `callToAction` | Heading, text, link |

Visual rendering of these blocks is Phase 2/3 work.

## Services (`services`)

Dental treatments. Drafts enabled. Descriptions are editor-supplied — never auto-generated medical claims.

Key fields: `name`, `slug`, `shortDescription`, `detailedDescription`, `featuredImage`, `icon`, `relatedServices`, `locations` (hasMany), `displayOrder`, SEO.

## Team Members (`team-members`)

Staff profiles. No seed data; real names and photographs are provided by the practice.

Key fields: `fullName`, `professionalTitle`, `position`, `biography`, `photo`, `qualifications`, `languages`, `locations` (hasMany), `displayOrder`, `active`.

## Media (`media`)

Upload collection with required localised `alt`, optional `description`, focal point and WebP image sizes (`thumbnail`, `card`, `hero`). MIME types are restricted to common image formats. Files are stored under `/media` (gitignored).

## Testimonials (`testimonials`)

Key fields: `displayName`, `text`, `location`, `source`, `displayOrder`, `approved`. Public reads approved entries only. No seed data.

## Navigation (`navigation`)

Key fields: `name`, `identifier` (`main` \| `footer`), optional `location` (empty = shared), `items` (array of reusable link groups: internal page or external URL).

## Redirects (`redirects`)

Provided by `@payloadcms/plugin-redirects`, scoped to pages. Used for redirect management across both domains.

## Global: Site Settings (`site-settings`)

Brand-wide configuration: `brandName`, `brandContact`, `defaultLanguage`, `footerText`, `socialLinks`, `defaultSEO`, `announcement`, `sharedMedia` (logo / fallback OG image). Location-specific contact and SEO stay on the Locations collection.

## Relationships summary

```
Location 1───* Page          (optional; empty = shared)
Location *───* Service
Location *───* TeamMember
Location 1───* Testimonial
Location 1───* Navigation    (optional; empty = shared)
Page     *───  Media         (featured image + block uploads)
Service  *───* Service       (relatedServices)
```
