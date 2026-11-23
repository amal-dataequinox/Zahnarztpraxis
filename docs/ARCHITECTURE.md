# Architecture

## Overview

A single Next.js App Router application hosts:

- one Payload CMS installation
- one PostgreSQL database
- two independent website experiences (Appenzell and Gais)

Location-specific data (address, phone, opening hours, booking URL, SEO) lives in the `locations` collection. Shared brand configuration lives in the `site-settings` global. Domain resolution maps the request hostname to a location slug; the frontend consumes that resolved location context and never hardcodes location-specific information.

```
                    ┌─────────────────────────────┐
                    │   Next.js + Payload app     │
                    │                             │
  Host header ───►  │  resolveDomain()            │
                    │         │                   │
                    │         ▼                   │
                    │  resolveCurrentLocation()   │
                    │         │                   │
                    │         ▼                   │
                    │  Location-scoped content    │
                    │  (pages, services, team…)   │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                           PostgreSQL 17
```

## Application layout

```
src/
  app/
    (frontend)/          # Public website (unstyled verification routes in Phase 1)
    (payload)/           # Payload Admin UI and REST/GraphQL API
  access/                # Role-based access-control helpers
  blocks/                # Layout block schemas (no visual rendering yet)
  collections/           # Payload collections
  fields/                # Reusable field factories (slug, opening hours, link)
  globals/               # SiteSettings
  migrations/            # Database migrations (source of truth for schema)
  seed/                  # Idempotent development seed
  utilities/             # Domain resolution, SEO helpers
  payload.config.ts
```

## Domains

| Hostname | Location slug |
| --- | --- |
| `zahnarztpraxis-palatty.ch` (+ `www`) | `appenzell` |
| `zahnarzt-palatty.ch` (+ `www`) | `gais` |
| `appenzell.localhost` | `appenzell` (local development) |
| `gais.localhost` | `gais` (local development) |

See [DOMAIN-RESOLUTION.md](./DOMAIN-RESOLUTION.md) for the full resolution rules.

## Content model (high level)

- A **Location** owns contact data, hours, booking URL and domain.
- A **Page** may belong to one location or be shared (no location).
- A **Service** and a **Team Member** can belong to multiple locations.
- **Navigation** can be shared or location-specific.
- **Media** is global; alt text is required.
- **Testimonials** are location-scoped and require approval before public read.
- **Site Settings** holds brand-wide configuration.

## Localisation

German (`de`) is the sole configured locale and the source language. Content fields that will need translation later are already marked `localized: true`. Adding English later is a configuration change, not a schema rewrite. No automatic translation is performed.

## Security model

| Role | Capabilities |
| --- | --- |
| Super Admin | Full access, including user management |
| Editor | Create/update content collections; cannot manage users or delete locations |
| Public | Read published / active / approved content only |

Inactive users cannot log in (`beforeLogin` hook). Draft documents are invisible to the public. See collection access functions in `src/access/`.

## What is deliberately out of scope (Phase 1)

- Visual design, design tokens, Alpine Modernism components
- Homepage / marketing page layouts
- Animation and 3D libraries
- Fabricated staff, testimonials or medical claims
