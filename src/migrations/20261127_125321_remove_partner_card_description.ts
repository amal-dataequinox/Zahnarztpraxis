import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_overview_partners_locales" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_team_overview_partners_locales" DROP COLUMN "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_overview_partners_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview_partners_locales" ADD COLUMN "description" varchar;`)
}
