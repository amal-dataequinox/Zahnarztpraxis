import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ADD COLUMN "logo_id" integer;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "locations_logo_idx" ON "locations" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP CONSTRAINT "locations_logo_id_media_id_fk";
  
  DROP INDEX "locations_logo_idx";
  ALTER TABLE "locations" DROP COLUMN "logo_id";`)
}
