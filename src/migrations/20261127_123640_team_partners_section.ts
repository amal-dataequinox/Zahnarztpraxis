import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_team_overview_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_team_overview_partners_locales" (
  	"name" varchar,
  	"category_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_team_overview_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_overview_partners_locales" (
  	"name" varchar,
  	"category_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_team_overview" ADD COLUMN "show_partners" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_team_overview_locales" ADD COLUMN "partners_eyebrow" varchar;
  ALTER TABLE "pages_blocks_team_overview_locales" ADD COLUMN "partners_heading" varchar;
  ALTER TABLE "pages_blocks_team_overview_locales" ADD COLUMN "partners_intro" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview" ADD COLUMN "show_partners" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ADD COLUMN "partners_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ADD COLUMN "partners_heading" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ADD COLUMN "partners_intro" varchar;
  ALTER TABLE "pages_blocks_team_overview_partners" ADD CONSTRAINT "pages_blocks_team_overview_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_overview_partners" ADD CONSTRAINT "pages_blocks_team_overview_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_overview_partners_locales" ADD CONSTRAINT "pages_blocks_team_overview_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_overview_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_overview_partners" ADD CONSTRAINT "_pages_v_blocks_team_overview_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_overview_partners" ADD CONSTRAINT "_pages_v_blocks_team_overview_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_overview_partners_locales" ADD CONSTRAINT "_pages_v_blocks_team_overview_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_overview_partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_overview_partners_order_idx" ON "pages_blocks_team_overview_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_overview_partners_parent_id_idx" ON "pages_blocks_team_overview_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_overview_partners_logo_idx" ON "pages_blocks_team_overview_partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "pages_blocks_team_overview_partners_locales_locale_parent_id" ON "pages_blocks_team_overview_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_team_overview_partners_locales_parent_id_idx" ON "pages_blocks_team_overview_partners_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_overview_partners_order_idx" ON "_pages_v_blocks_team_overview_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_overview_partners_parent_id_idx" ON "_pages_v_blocks_team_overview_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_overview_partners_logo_idx" ON "_pages_v_blocks_team_overview_partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_overview_partners_locales_locale_parent" ON "_pages_v_blocks_team_overview_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_team_overview_partners_locales_parent_id_idx" ON "_pages_v_blocks_team_overview_partners_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_team_overview_partners" CASCADE;
  DROP TABLE "pages_blocks_team_overview_partners_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_team_overview_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_team_overview_partners_locales" CASCADE;
  ALTER TABLE "pages_blocks_team_overview" DROP COLUMN "show_partners";
  ALTER TABLE "pages_blocks_team_overview_locales" DROP COLUMN "partners_eyebrow";
  ALTER TABLE "pages_blocks_team_overview_locales" DROP COLUMN "partners_heading";
  ALTER TABLE "pages_blocks_team_overview_locales" DROP COLUMN "partners_intro";
  ALTER TABLE "_pages_v_blocks_team_overview" DROP COLUMN "show_partners";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" DROP COLUMN "partners_eyebrow";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" DROP COLUMN "partners_heading";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" DROP COLUMN "partners_intro";`)
}
