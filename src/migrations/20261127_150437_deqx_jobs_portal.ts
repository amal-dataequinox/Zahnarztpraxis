import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_status" AS ENUM('active', 'closed');
  CREATE TYPE "public"."enum_jobs_employment_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'reviewing', 'interviewing', 'rejected', 'hired');
  CREATE TABLE "pages_blocks_jobs_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_filters" boolean DEFAULT true,
  	"show_application_guide" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_jobs_overview_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"intro" varchar,
  	"empty_heading" varchar,
  	"empty_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_jobs_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_filters" boolean DEFAULT true,
  	"show_application_guide" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_jobs_overview_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"intro" varchar,
  	"empty_heading" varchar,
  	"empty_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"job_id" varchar NOT NULL,
  	"status" "enum_jobs_status" DEFAULT 'active' NOT NULL,
  	"workload" varchar,
  	"employment_type" "enum_jobs_employment_type" DEFAULT 'part-time' NOT NULL,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "jobs_locales" (
  	"title" varchar NOT NULL,
  	"department" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"start_date" varchar,
  	"summary" varchar,
  	"description" jsonb NOT NULL,
  	"requirements" jsonb NOT NULL,
  	"tasks" jsonb,
  	"benefits" jsonb,
  	"application_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"job_id" integer NOT NULL,
  	"status" "enum_job_applications_status" DEFAULT 'new' NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"linkedin" varchar,
  	"has_portfolio" boolean DEFAULT false,
  	"resume_id" integer NOT NULL,
  	"additional_comments" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resumes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'palatty-resumes',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "job_board_config_application_guide_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "job_board_config_application_guide_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "job_board_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "job_board_config_locales" (
  	"eyebrow" varchar DEFAULT 'Karriere bei Palatty',
  	"title" varchar DEFAULT 'Offene Stellen' NOT NULL,
  	"description" varchar DEFAULT 'Verstärken Sie unser engagiertes Praxisteam in Appenzell und Gais — mit modernen Räumen, klaren Abläufen und persönlicher Wertschätzung.' NOT NULL,
  	"application_guide_heading" varchar DEFAULT 'Ihr unkomplizierter Weg ins Team.',
  	"application_guide_description" varchar DEFAULT 'Wir prüfen jede Bewerbung persönlich und melden uns in der Regel innerhalb weniger Arbeitstage bei Ihnen.',
  	"application_guide_form_intro" varchar DEFAULT 'Reichen Sie Ihre Kontaktdaten und Ihren Lebenslauf direkt online ein — wir behandeln Ihre Unterlagen streng vertraulich.',
  	"application_guide_success_message" varchar DEFAULT 'Vielen Dank für Ihre Bewerbung. Unser Praxisteam hat Ihre Unterlagen erhalten und meldet sich zeitnah bei Ihnen.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resumes_id" integer;
  ALTER TABLE "pages_blocks_jobs_overview" ADD CONSTRAINT "pages_blocks_jobs_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jobs_overview_locales" ADD CONSTRAINT "pages_blocks_jobs_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_jobs_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jobs_overview" ADD CONSTRAINT "_pages_v_blocks_jobs_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jobs_overview_locales" ADD CONSTRAINT "_pages_v_blocks_jobs_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_jobs_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_board_config_application_guide_steps" ADD CONSTRAINT "job_board_config_application_guide_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_board_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_board_config_application_guide_steps_locales" ADD CONSTRAINT "job_board_config_application_guide_steps_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_board_config_application_guide_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_board_config_locales" ADD CONSTRAINT "job_board_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_board_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_jobs_overview_order_idx" ON "pages_blocks_jobs_overview" USING btree ("_order");
  CREATE INDEX "pages_blocks_jobs_overview_parent_id_idx" ON "pages_blocks_jobs_overview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_jobs_overview_path_idx" ON "pages_blocks_jobs_overview" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_jobs_overview_locales_locale_parent_id_unique" ON "pages_blocks_jobs_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_jobs_overview_locales_parent_id_idx" ON "pages_blocks_jobs_overview_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_jobs_overview_order_idx" ON "_pages_v_blocks_jobs_overview" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_jobs_overview_parent_id_idx" ON "_pages_v_blocks_jobs_overview" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_jobs_overview_path_idx" ON "_pages_v_blocks_jobs_overview" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_jobs_overview_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_jobs_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_jobs_overview_locales_parent_id_idx" ON "_pages_v_blocks_jobs_overview_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE UNIQUE INDEX "jobs_job_id_idx" ON "jobs" USING btree ("job_id");
  CREATE INDEX "jobs_display_order_idx" ON "jobs" USING btree ("display_order");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs_title_idx" ON "jobs_locales" USING btree ("title","_locale");
  CREATE INDEX "jobs_meta_meta_image_idx" ON "jobs_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "jobs_locales_locale_parent_id_unique" ON "jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "jobs_locales_parent_id_idx" ON "jobs_locales" USING btree ("_parent_id");
  CREATE INDEX "job_applications_job_idx" ON "job_applications" USING btree ("job_id");
  CREATE INDEX "job_applications_resume_idx" ON "job_applications" USING btree ("resume_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "resumes_updated_at_idx" ON "resumes" USING btree ("updated_at");
  CREATE INDEX "resumes_created_at_idx" ON "resumes" USING btree ("created_at");
  CREATE UNIQUE INDEX "resumes_filename_idx" ON "resumes" USING btree ("filename");
  CREATE INDEX "job_board_config_application_guide_steps_order_idx" ON "job_board_config_application_guide_steps" USING btree ("_order");
  CREATE INDEX "job_board_config_application_guide_steps_parent_id_idx" ON "job_board_config_application_guide_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "job_board_config_application_guide_steps_locales_locale_pare" ON "job_board_config_application_guide_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_board_config_application_guide_steps_locales_parent__idx" ON "job_board_config_application_guide_steps_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "job_board_config_locales_locale_parent_id_unique" ON "job_board_config_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_board_config_locales_parent_id_idx" ON "job_board_config_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resumes_fk" FOREIGN KEY ("resumes_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_resumes_id_idx" ON "payload_locked_documents_rels" USING btree ("resumes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_jobs_overview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_jobs_overview_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_jobs_overview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_jobs_overview_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resumes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_board_config_application_guide_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_board_config_application_guide_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_board_config" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_board_config_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_jobs_overview" CASCADE;
  DROP TABLE "pages_blocks_jobs_overview_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_jobs_overview" CASCADE;
  DROP TABLE "_pages_v_blocks_jobs_overview_locales" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "jobs_locales" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "resumes" CASCADE;
  DROP TABLE "job_board_config_application_guide_steps" CASCADE;
  DROP TABLE "job_board_config_application_guide_steps_locales" CASCADE;
  DROP TABLE "job_board_config" CASCADE;
  DROP TABLE "job_board_config_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_jobs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resumes_fk";
  
  DROP INDEX "payload_locked_documents_rels_jobs_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_resumes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "jobs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resumes_id";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum_jobs_employment_type";
  DROP TYPE "public"."enum_job_applications_status";`)
}
