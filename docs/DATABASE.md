# Database

## Engine

PostgreSQL 17, accessed through `@payloadcms/db-postgres`.

Local development uses Docker Compose:

```bash
docker compose up -d
docker compose ps          # postgres should be healthy
docker compose logs -f postgres
```

Connection string (see `.env.example`):

```
DATABASE_URL=postgresql://palatty:palatty@127.0.0.1:5432/palatty
```

## Migrations (source of truth)

Schema push is **disabled** (`push: false` in `src/payload.config.ts`). Every schema change must go through a migration.

```bash
# After editing a collection / global / block
pnpm migrate:create <descriptive-name>
pnpm migrate

# Inspect status
pnpm migrate:status
```

Migration files live in `src/migrations/` and are committed to git. The initial migration is `20261118_101545_initial`.

### Fresh environment

```bash
docker compose up -d
pnpm migrate
pnpm seed
```

### Production

Never use schema push. Deployments must run `pnpm migrate` (or `payload migrate`) against the production database before starting the app. Keep a backup (see below) before applying migrations in production.

## Seed data

`pnpm seed` is idempotent and creates:

- Super admin from `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD`
- Appenzell and Gais locations with real contact data from the live websites
- Eight treatment names as **unpublished drafts** (no invented medical descriptions)
- Site settings defaults
- An empty shared main navigation

It does **not** create team members, testimonials, media or fabricated content.

## Backup strategy

### Local / staging

```bash
# Dump
docker compose exec -T postgres pg_dump -U palatty -d palatty -Fc > backup-$(date +%Y%m%d).dump

# Restore into a fresh database
docker compose exec -T postgres pg_restore -U palatty -d palatty --clean --if-exists < backup-YYYYMMDD.dump
```

### Production

- Prefer the hosting provider's managed automated backups (daily, retain ≥ 14 days).
- Before every production migration, take a manual snapshot / `pg_dump`.
- Store dumps encrypted and outside the application server.
- Media files (`/media` or the configured object storage) must be backed up separately from the database.

## Credentials

Never commit real credentials. `.env` is gitignored. Use `.env.example` as the template. Rotate `PAYLOAD_SECRET` independently per environment.
