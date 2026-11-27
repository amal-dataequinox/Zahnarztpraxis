import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT 'palatty-media';
    UPDATE "media" SET "prefix" = 'palatty-media' WHERE "prefix" IS NULL OR "prefix" = 'media';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT 'media';
    UPDATE "media" SET "prefix" = 'media' WHERE "prefix" = 'palatty-media';
  `)
}
