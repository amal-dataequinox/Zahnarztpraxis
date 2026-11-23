# Development

## Prerequisites

- Node.js ≥ 20.9 (22 LTS recommended; Payload's advertised engine list is stricter but the app runs on current Node)
- pnpm 9+
- Docker (for PostgreSQL)

## First-time setup

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm migrate
pnpm seed
pnpm dev
```

Admin login uses the credentials in `.env` (`SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD`).

## Daily workflow

```bash
docker compose up -d   # if Postgres is not already running
pnpm dev
```

Verification pages (intentionally unstyled):

- [http://appenzell.localhost:3000](http://appenzell.localhost:3000)
- [http://gais.localhost:3000](http://gais.localhost:3000)

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Schema changes

1. Edit the collection / global / block under `src/`.
2. `pnpm migrate:create <name>`
3. Review the generated file in `src/migrations/`.
4. `pnpm migrate`
5. `pnpm generate:types`
6. `pnpm generate:importmap` (if admin UI components changed)

Never rely on schema push. It is disabled.

## Content workflows

### Create a location-scoped page

1. Admin → Seiten → Neu
2. Set title, slug, location (Appenzell or Gais), page type
3. Add layout blocks as needed
4. Fill SEO tab
5. Save as draft, then Publish when ready

### Assign a service to both locations

Open the service → Seitenleiste "Angeboten an Standorten" → select Appenzell and Gais.

### Upload media

Admin → Medien → upload a real practice photograph, fill the required alt text. Responsive WebP sizes are generated automatically.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm build
```

## Testing both locations

1. Confirm seed created both locations: Admin → Standorte.
2. Open `http://appenzell.localhost:3000` — must show Appenzell address and `+41 71 787 82 82`.
3. Open `http://gais.localhost:3000` — must show Gais address and `+41 71 793 10 20`.
4. Create a draft page on Appenzell only — it must **not** appear on the Gais domain until published, and never on Gais if scoped to Appenzell.
5. Create an editor user (as super admin) and confirm they cannot access Benutzerverwaltung.
6. Upload one real photograph from the client media pack and confirm alt text is required.

## Deployment outline

1. Provision PostgreSQL and set `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `DOMAIN_LOCATION_MAP`.
2. Leave `DEFAULT_LOCATION_SLUG` empty in production.
3. Point both production domains at the same deployment.
4. `pnpm install --frozen-lockfile`
5. `pnpm migrate`
6. `pnpm build`
7. `pnpm start` (or the platform's Node start command)
8. Configure media persistence (volume or object storage) so uploads survive redeploys.

## Phase boundaries

Do not start Phase 2 (design system) or Phase 3 (website UI) until Phase 1 is explicitly approved. Phase 1 delivers the CMS foundation only.
