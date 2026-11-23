# Zahnarztpraxis Palatty

Unified Payload CMS and multi-domain website for the Appenzell and Gais dental practices.

| Domain | Location |
| --- | --- |
| [zahnarztpraxis-palatty.ch](https://zahnarztpraxis-palatty.ch/) | Appenzell |
| [zahnarzt-palatty.ch](https://zahnarzt-palatty.ch/) | Gais |

This repository is developed in three strictly separated phases. **Phases 1–3 are implemented.**

1. **Phase 1 — Payload CMS foundation** (done)
2. **Phase 2 — Alpine Modernism design system** (done)
3. **Phase 3 — Website experience** (done — awaiting review)

## Stack

- Next.js 16 (App Router)
- Payload CMS 3.94
- TypeScript (strict)
- PostgreSQL 17 via `@payloadcms/db-postgres`
- Tailwind CSS 4 + Alpine Modernism design tokens / components
- pnpm

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables and adjust as needed
cp .env.example .env

# 3. Start PostgreSQL
docker compose up -d

# 4. Apply database migrations
pnpm migrate

# 5. Seed the two locations, draft services and a super admin
pnpm seed

# 6. Start the development server
pnpm dev
```

Then open:

- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Login with `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` from `.env`
- Appenzell verification page: [http://appenzell.localhost:3000](http://appenzell.localhost:3000)
- Gais verification page: [http://gais.localhost:3000](http://gais.localhost:3000)
- Design system reference: [http://localhost:3000/design-system](http://localhost:3000/design-system)

Browsers resolve `*.localhost` to `127.0.0.1` automatically — no `/etc/hosts` changes required.

## Useful scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js + Payload in development |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm migrate` | Apply pending database migrations |
| `pnpm migrate:create <name>` | Create a new migration from schema changes |
| `pnpm migrate:status` | Show migration status |
| `pnpm seed` | Idempotent seed (locations, draft services, admin) |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the Payload admin import map |
| `pnpm typecheck` | Strict TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test:unit` | Domain-resolution unit tests |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [CMS collections](docs/CMS-COLLECTIONS.md)
- [Database](docs/DATABASE.md)
- [Domain resolution](docs/DOMAIN-RESOLUTION.md)
- [Development](docs/DEVELOPMENT.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Photography](docs/PHOTOGRAPHY.md)
- [3D art direction](docs/3D-ART-DIRECTION.md)
- [Animation](docs/ANIMATION.md)

## Phase status

- **Phase 1**: CMS foundation, domains, collections, migrations.
- **Phase 2**: Alpine Modernism tokens, typography, components and guidelines (`/design-system`).
- **Phase 3**: Public website for both domains — shell, homepage, Leistungen, Team, Kontakt, CMS block rendering.

### Public routes

| Path | Purpose |
| --- | --- |
| `/` | Location homepage (CMS home blocks or DefaultHome fallback) |
| `/leistungen` | Published services for the resolved location |
| `/leistungen/[slug]` | Service detail |
| `/team` | Team overview (CMS profiles only) |
| `/kontakt` | Contact + opening hours |
| `/[slug]` | Other published CMS pages |
| `/design-system` | Internal design reference (`noindex`) |
