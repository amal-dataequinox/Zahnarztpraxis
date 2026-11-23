# Domain resolution

## Purpose

Both practice websites share one codebase and one CMS. Domain resolution is the single place that maps a request hostname to a location slug. Everything else — contact data, pages, SEO canonicals — is derived from the resolved location.

## Mapping

Configured via `DOMAIN_LOCATION_MAP` (comma-separated `hostname:slug` pairs). Defaults:

| Hostname | Location slug |
| --- | --- |
| `zahnarztpraxis-palatty.ch` | `appenzell` |
| `www.zahnarztpraxis-palatty.ch` | `appenzell` |
| `zahnarzt-palatty.ch` | `gais` |
| `www.zahnarzt-palatty.ch` | `gais` |
| `appenzell.localhost` | `appenzell` |
| `gais.localhost` | `gais` |

## Resolution order

Implemented in `src/utilities/resolveDomain.ts`:

1. Sanitise the Host header (strip port, lowercase, reject schemes / paths / spaces).
2. Exact match against the configured map.
3. `<known-slug>.localhost` convention for local development.
4. Bare `localhost` / `127.0.0.1` → `DEFAULT_LOCATION_SLUG` (development convenience). Leave this empty in production.
5. Otherwise → `null` (caller should 404).

Unknown hostnames are never trusted and never silently served the wrong location's phone number, address or booking link.

## Frontend usage

```ts
import { resolveCurrentLocation } from '@/utilities/resolveLocation'

const location = await resolveCurrentLocation()
if (!location) notFound()
// use location.phone, location.address, …
```

`resolveCurrentLocation` reads the Host header, resolves the slug, then loads the **active** Location document from Payload. Results are cached per request via React `cache`.

## Local development strategy

Modern browsers resolve `*.localhost` to `127.0.0.1` automatically. No `/etc/hosts` edits are required.

```
http://appenzell.localhost:3000   → Appenzell location
http://gais.localhost:3000        → Gais location
http://localhost:3000             → DEFAULT_LOCATION_SLUG (appenzell in .env)
```

Admin is available on any of these hosts at `/admin`.

## SEO implications

- Canonical URLs always use the location's production domain (`https://{location.domain}/…`), never the development hostname.
- `sitemap.ts` and `robots.ts` are host-aware and emit per-domain output.
- Structured data (`Dentist` JSON-LD) is built exclusively from CMS-managed location fields.

## Preview / inactive locations

- Inactive locations (`active: false`) are invisible to public reads and therefore cannot be resolved.
- Draft pages are only readable when draft mode is enabled (admin preview).
- Missing or inactive locations yield a 404 via `notFound()`.

## CORS / CSRF

`payload.config.ts` builds an allowlist from `NEXT_PUBLIC_SERVER_URL` plus every known domain (https for production hostnames, http for `*.localhost`). Adding a domain to `DOMAIN_LOCATION_MAP` automatically includes it.
