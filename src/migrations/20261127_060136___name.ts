import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_rich_text_appearance" AS ENUM('editorial-card', 'bento-sections', 'urgent-split', 'plain'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_services_overview_journey_steps_icon" AS ENUM('chat', 'compass', 'shield'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_rich_text_appearance" AS ENUM('editorial-card', 'bento-sections', 'urgent-split', 'plain'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_services_overview_journey_steps_icon" AS ENUM('chat', 'compass', 'shield'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_services_category" AS ENUM('vorsorge', 'zahnerhalt', 'aesthetik', 'notfall'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__services_v_version_category" AS ENUM('vorsorge', 'zahnerhalt', 'aesthetik', 'notfall'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_media_media_type" AS ENUM('image', 'video', 'hls', 'document'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_design_system_theme_preset" AS ENUM('appenzell', 'dental-blue', 'medical-blue', 'alpine-emerald', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_design_system_heading_font" AS ENUM('ibm-plex', 'general', 'switzer', 'system'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_design_system_body_font" AS ENUM('ibm-plex', 'switzer', 'general', 'system'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_home_page_care_cards_icon" AS ENUM('shield', 'tooth', 'sparkles'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_home_page_care_cards_surface_style" AS ENUM('tinted-soft', 'white', 'tinted-cool'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_home_page_gallery_items_layout_span" AS ENUM('standard', 'wide'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_home_page_hero_background_type" AS ENUM('media', 'color', 'gradient'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TYPE "public"."_locales" ADD VALUE IF NOT EXISTS 'en';
  ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE IF NOT EXISTS 'en';
  ALTER TYPE "public"."enum__services_v_published_locale" ADD VALUE IF NOT EXISTS 'en';

  CREATE TABLE IF NOT EXISTS "locations_emergency_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar NOT NULL,
  	"phone" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_services_overview_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"icon" "enum_pages_blocks_services_overview_journey_steps_icon" DEFAULT 'chat',
  	"title" varchar,
  	"description" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_services_overview_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"icon" "enum__pages_v_blocks_services_overview_journey_steps_icon" DEFAULT 'chat',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "design_system" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accent" varchar DEFAULT '#00a887' NOT NULL,
  	"theme_preset" "enum_design_system_theme_preset" DEFAULT 'appenzell' NOT NULL,
  	"accent_text" varchar DEFAULT '#FFFFFF' NOT NULL,
  	"ink" varchar DEFAULT '#0e2a2f' NOT NULL,
  	"paper" varchar DEFAULT '#f7faf9' NOT NULL,
  	"surface" varchar DEFAULT '#ffffff' NOT NULL,
  	"heading_font" "enum_design_system_heading_font" DEFAULT 'ibm-plex',
  	"body_font" "enum_design_system_body_font" DEFAULT 'ibm-plex',
  	"card_radius" numeric DEFAULT 16,
  	"section_spacing" numeric DEFAULT 96,
  	"content_width" numeric DEFAULT 1152,
  	"header_width" numeric DEFAULT 1440,
  	"motion_enabled" boolean DEFAULT true,
  	"site_name" varchar DEFAULT 'Zahnarztpraxis Palatty',
  	"site_url" varchar DEFAULT 'https://zahnarztpraxis-palatty.ch',
  	"organization_name" varchar DEFAULT 'Zahnarztpraxis Palatty AG',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "home_page_about_extended_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "home_page_about_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "home_page_care_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"icon" "enum_home_page_care_cards_icon" DEFAULT 'shield',
  	"surface_style" "enum_home_page_care_cards_surface_style" DEFAULT 'tinted-soft',
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"link_label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "home_page_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"category" varchar NOT NULL,
  	"caption" varchar NOT NULL,
  	"layout_span" "enum_home_page_gallery_items_layout_span" DEFAULT 'standard'
  );

  CREATE TABLE IF NOT EXISTS "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar DEFAULT 'Zahnarztpraxis Palatty',
  	"hero_headline_top" varchar DEFAULT 'Zahnmedizin,',
  	"hero_headline_prefix" varchar DEFAULT 'die sich',
  	"hero_headline_highlight" varchar DEFAULT 'gut
anfühlt.',
  	"hero_subheadline" varchar DEFAULT 'Moderne Behandlung. Persönliche Betreuung.
Für Sie und Ihre Familie.',
  	"hero_primary_cta_label" varchar DEFAULT 'Termin vereinbaren',
  	"hero_primary_cta_href" varchar DEFAULT '/kontakt#termin',
  	"hero_secondary_cta_label" varchar DEFAULT 'Behandlungen entdecken',
  	"hero_secondary_cta_href" varchar DEFAULT '/leistungen',
  	"hero_scroll_label" varchar DEFAULT 'Entdecken',
  	"hero_background_type" "enum_home_page_hero_background_type" DEFAULT 'media',
  	"hero_background_color" varchar DEFAULT '#0c1824',
  	"hero_background_gradient" varchar,
  	"hero_media_id" integer,
  	"hero_hls_url" varchar,
  	"hero_video_id" integer,
  	"hero_video_poster_id" integer,
  	"hero_video_autoplay" boolean DEFAULT true,
  	"hero_video_loop" boolean DEFAULT true,
  	"hero_video_muted" boolean DEFAULT true,
  	"about_eyebrow" varchar DEFAULT 'Zahnarztpraxis',
  	"about_heading" varchar DEFAULT 'Im Herzen von Appenzell',
  	"about_lead" varchar DEFAULT 'Willkommen in unserer Zahnarztpraxis — wo moderne Zahnmedizin auf persönliche Betreuung trifft. Unter dem Motto «Dein Lächeln. Unsere Leidenschaft.» setzen wir uns dafür ein, dass Sie sich rundum wohlfühlen.',
  	"about_body" varchar DEFAULT 'Als Familienzahnarztpraxis begleiten wir Menschen jeden Alters mit klarer Beratung und modernen Räumen. Bei uns wissen Sie jederzeit, was gemacht wird — transparent und nachvollziehbar.',
  	"about_link_label" varchar DEFAULT 'Zum Team',
  	"about_link_href" varchar DEFAULT '/team',
  	"about_image_id" integer,
  	"about_detail_image_id" integer,
  	"about_badge_label" varchar DEFAULT 'Im Herzen der Praxis',
  	"care_headline_top" varchar DEFAULT 'Für gesunde Zähne.',
  	"care_headline_highlight" varchar DEFAULT 'In jeder Lebensphase.',
  	"care_subtitle" varchar DEFAULT 'Von der Vorsorge bis zur individuellen Behandlung: Wir begleiten Ihr Lächeln.',
  	"gallery_eyebrow" varchar DEFAULT 'Atmosphäre & Räume',
  	"gallery_heading" varchar DEFAULT 'Einblicke in unsere Praxis.',
  	"gallery_highlight" varchar DEFAULT 'Helle Räume in Appenzell.',
  	"gallery_description" varchar DEFAULT 'Lichtdurchflutete Behandlungszimmer, ruhige Materialien und ein herzlicher Empfang – damit Sie sich vom ersten Moment an gut aufgehoben fühlen.',
  	"services_eyebrow" varchar DEFAULT 'Leistungen',
  	"services_heading" varchar DEFAULT 'Behandlungen',
  	"services_heading_highlight" varchar DEFAULT 'in Appenzell.',
  	"services_description" varchar DEFAULT 'Moderne Zahnmedizin und einfühlsame Behandlungskonzepte für Ihre Zahngesundheit.',
  	"services_link_label" varchar DEFAULT 'Alle Leistungen',
  	"team_eyebrow" varchar DEFAULT 'Team',
  	"team_heading" varchar DEFAULT 'Erfahren Sie mehr über unser Team',
  	"team_description" varchar DEFAULT 'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch professionell und persönlich ist.',
  	"team_link_label" varchar DEFAULT 'Team-Seite',
  	"team_default_role_label" varchar DEFAULT 'Praxisteam Appenzell',
  	"location_eyebrow" varchar DEFAULT 'Standort',
  	"location_heading" varchar DEFAULT 'Zahnarztpraxis Appenzell',
  	"location_heading_highlight" varchar DEFAULT 'erreichen.',
  	"location_description" varchar DEFAULT 'Ihre Praxis für zahnärztliche Fachkompetenz und moderne Behandlung im Herzen von Appenzell.',
  	"hours_disclaimer" varchar DEFAULT '',
  	"appointment_eyebrow" varchar DEFAULT 'Termin',
  	"appointment_heading" varchar DEFAULT 'Wir freuen uns auf Sie',
  	"appointment_description" varchar DEFAULT 'Rufen Sie an, schreiben Sie eine E-Mail oder nutzen Sie die Kontaktseite.',
  	"appointment_link_label" varchar DEFAULT 'Zur Kontaktseite',
  	"appointment_image_id" integer,
  	"location_address_label" varchar DEFAULT 'Praxisadresse',
  	"location_map_label" varchar DEFAULT 'Route planen',
  	"pricing_eyebrow" varchar DEFAULT 'Transparenz & Tarif',
  	"pricing_heading" varchar DEFAULT 'Kosten – Zahnarzt',
  	"pricing_highlight" varchar DEFAULT 'fair und nachvollziehbar.',
  	"pricing_card_eyebrow" varchar DEFAULT '01 / SSO & DENTOTAR®',
  	"pricing_chip_one" varchar DEFAULT 'Krankenkassen',
  	"pricing_chip_two" varchar DEFAULT 'Privatpatienten',
  	"pricing_tax_point_label" varchar DEFAULT 'Unser Taxpunkt (DENTOTAR®)',
  	"pricing_tax_point_value" varchar DEFAULT '1.10',
  	"pricing_subcaption" varchar DEFAULT 'Mindesttarif gemäss Schweizerischer Zahnärzte-Gesellschaft (SSO)',
  	"pricing_description" varchar DEFAULT 'Wir halten uns an die Richtlinien der SSO (Schweizerische Zahnärztegesellschaft) und an den Vertrag mit den Sozialversicherungspartnern. Der mit Januar 2018 eingeführte Mindesttarif (DENTOTAR)® ist für Krankenkassen und auch für Privatpatienten gültig.',
  	"pricing_estimate_eyebrow" varchar DEFAULT '02 / KOSTENVORANSCHLAG',
  	"pricing_estimate_heading" varchar DEFAULT 'Klarheit vor jeder Behandlung.',
  	"pricing_note" varchar DEFAULT 'Es ist wichtig, dass Sie nach der Zahnarztuntersuchung über den Befund, die Diagnose, mögliche Behandlungsvarianten und die damit verbundenen Kosten informiert werden. Natürlich können wir Ihnen einen schriftlichen Kostenvoranschlag erstellen, um Ihnen eine genaue Vorstellung der zu erwartenden Kosten für Ihre Behandlung zu geben. Es ist uns wichtig, dass Sie alle Informationen haben, um eine fundierte Entscheidung zu treffen.',
  	"pricing_services_cta_label" varchar DEFAULT 'Fachbereiche ansehen',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "location_address_label" varchar DEFAULT 'Praxisadresse';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "location_map_label" varchar DEFAULT 'Route planen';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_card_eyebrow" varchar DEFAULT '01 / SSO & DENTOTAR®';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_chip_one" varchar DEFAULT 'Krankenkassen';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_chip_two" varchar DEFAULT 'Privatpatienten';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_subcaption" varchar DEFAULT 'Mindesttarif gemäss Schweizerischer Zahnärzte-Gesellschaft (SSO)';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_estimate_eyebrow" varchar DEFAULT '02 / KOSTENVORANSCHLAG';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_estimate_heading" varchar DEFAULT 'Klarheit vor jeder Behandlung.';
  ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "pricing_services_cta_label" varchar DEFAULT 'Fachbereiche ansehen';

  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "primary_color" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "hin_email" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "emergency_leaflet_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "emergency_leaflet_label" varchar DEFAULT 'Merkblatt zum Zahnunfall (PDF)';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "hide_default_actions" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "title_highlight" varchar;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN IF NOT EXISTS "appearance" "enum_pages_blocks_rich_text_appearance" DEFAULT 'editorial-card';
  ALTER TABLE "pages_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "sidebar_title" varchar;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "sidebar_text" varchar;
  ALTER TABLE "pages_blocks_services_overview" ADD COLUMN IF NOT EXISTS "cta_button_href" varchar;
  ALTER TABLE "pages_blocks_services_overview" ADD COLUMN IF NOT EXISTS "cta_image_id" integer;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "heading_highlight" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "card_link_label" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_eyebrow" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_heading" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_highlight" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_description" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_eyebrow" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_heading" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_highlight" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_description" varchar;
  ALTER TABLE "pages_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar;
  ALTER TABLE "pages_blocks_team_overview" ADD COLUMN IF NOT EXISTS "show_biographies" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_team_overview_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "pages_blocks_team_overview_locales" ADD COLUMN IF NOT EXISTS "default_role_label" varchar;
  ALTER TABLE "pages_blocks_call_to_action" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "pages_blocks_call_to_action_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "hide_default_actions" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD COLUMN IF NOT EXISTS "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN IF NOT EXISTS "appearance" "enum__pages_v_blocks_rich_text_appearance" DEFAULT 'editorial-card';
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "sidebar_title" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD COLUMN IF NOT EXISTS "sidebar_text" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview" ADD COLUMN IF NOT EXISTS "cta_button_href" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview" ADD COLUMN IF NOT EXISTS "cta_image_id" integer;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "heading_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "card_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_heading" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "journey_description" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_heading" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_description" varchar;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview" ADD COLUMN IF NOT EXISTS "show_biographies" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ADD COLUMN IF NOT EXISTS "default_role_label" varchar;
  ALTER TABLE "_pages_v_blocks_call_to_action" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "_pages_v_blocks_call_to_action_locales" ADD COLUMN IF NOT EXISTS "eyebrow" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "category" "enum_services_category" DEFAULT 'zahnerhalt';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_category" "enum__services_v_version_category" DEFAULT 'zahnerhalt';
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "media_type" "enum_media_media_type" DEFAULT 'image';
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "hls_url" varchar;

  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "shared_media_default_hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "shared_media_default_cta_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "booking_cta_label" varchar DEFAULT 'Termin anfragen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_form_button_label" varchar DEFAULT 'Nachricht senden';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_sidebar_eyebrow" varchar DEFAULT 'Termin & Beratung';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "related_services_heading" varchar DEFAULT 'Weitere Behandlungen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_sidebar_description" varchar DEFAULT 'Vereinbaren Sie Ihren Termin bequem telefonisch oder online – unser Praxisteam in Appenzell berät Sie gerne persönlich.';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_fallback_detail" varchar DEFAULT 'Jede zahnmedizinische Behandlung beginnt bei uns mit einem ruhigen Gespräch und einer verständlichen Diagnostik. Gerne erläutern wir Ihnen alle passenden Behandlungsschritte direkt in unserer Praxis.';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_hours_label" varchar DEFAULT 'Öffnungszeiten';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_nav_label" varchar DEFAULT 'Navigation';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_legal_label" varchar DEFAULT 'Praxis & Rechtliches';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_notfall_label" varchar DEFAULT 'Notfall';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_jobs_label" varchar DEFAULT 'Jobs';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_impressum_label" varchar DEFAULT 'Impressum';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_datenschutz_label" varchar DEFAULT 'Datenschutz';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_section_eyebrow" varchar DEFAULT 'Kontakt';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_name_label" varchar DEFAULT 'Name';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_email_label" varchar DEFAULT 'E-Mail';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_message_label" varchar DEFAULT 'Nachricht';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_form_note" varchar DEFAULT 'Mit dem Absenden öffnet sich Ihr E-Mail-Programm';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "services_filter_all_label" varchar DEFAULT 'Alle Behandlungen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "services_filter_vorsorge_label" varchar DEFAULT 'Vorsorge & Hygiene';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "services_filter_zahnerhalt_label" varchar DEFAULT 'Zahnerhalt & Implantate';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "services_filter_aesthetik_label" varchar DEFAULT 'Ästhetik & Korrektur';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "services_filter_notfall_label" varchar DEFAULT 'Notfall & Akut';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_breadcrumb_label" varchar DEFAULT 'Alle Leistungen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_detail_eyebrow" varchar DEFAULT 'Behandlungsdetails';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_related_eyebrow" varchar DEFAULT 'Entdecken';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_view_all_label" varchar DEFAULT 'Alle ansehen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_card_details_label" varchar DEFAULT 'Details ansehen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "location_eyebrow_label" varchar DEFAULT 'Standort & Anfahrt';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "location_map_action_label" varchar DEFAULT 'Google Maps Route öffnen';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "emergency_section_label" varchar DEFAULT 'Notfalldienst';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "team_portrait_placeholder_label" varchar DEFAULT 'Porträt folgt';

  DO $$ BEGIN ALTER TABLE "locations_emergency_services" ADD CONSTRAINT "locations_emergency_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_services_overview_journey_steps" ADD CONSTRAINT "pages_blocks_services_overview_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_overview"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_services_overview_journey_steps" ADD CONSTRAINT "_pages_v_blocks_services_overview_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_overview"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page_about_extended_paragraphs" ADD CONSTRAINT "home_page_about_extended_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page_about_highlights" ADD CONSTRAINT "home_page_about_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page_care_cards" ADD CONSTRAINT "home_page_care_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page_gallery_items" ADD CONSTRAINT "home_page_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page_gallery_items" ADD CONSTRAINT "home_page_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_poster_id_media_id_fk" FOREIGN KEY ("hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_detail_image_id_media_id_fk" FOREIGN KEY ("about_detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "home_page" ADD CONSTRAINT "home_page_appointment_image_id_media_id_fk" FOREIGN KEY ("appointment_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_emergency_leaflet_id_media_id_fk" FOREIGN KEY ("emergency_leaflet_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_services_overview" ADD CONSTRAINT "pages_blocks_services_overview_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_services_overview" ADD CONSTRAINT "_pages_v_blocks_services_overview_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_shared_media_default_hero_image_id_media_id_fk" FOREIGN KEY ("shared_media_default_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "shared_media_default_cta_image_id" integer; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_shared_media_default_cta_image_id_media_id_fk" FOREIGN KEY ("shared_media_default_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "locations_emergency_services_order_idx" ON "locations_emergency_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_emergency_services_parent_id_idx" ON "locations_emergency_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_overview_journey_steps_order_idx" ON "pages_blocks_services_overview_journey_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_overview_journey_steps_parent_id_idx" ON "pages_blocks_services_overview_journey_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_overview_journey_steps_order_idx" ON "_pages_v_blocks_services_overview_journey_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_overview_journey_steps_parent_id_idx" ON "_pages_v_blocks_services_overview_journey_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_extended_paragraphs_order_idx" ON "home_page_about_extended_paragraphs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_about_extended_paragraphs_parent_id_idx" ON "home_page_about_extended_paragraphs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_highlights_order_idx" ON "home_page_about_highlights" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_about_highlights_parent_id_idx" ON "home_page_about_highlights" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_care_cards_order_idx" ON "home_page_care_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_care_cards_parent_id_idx" ON "home_page_care_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_gallery_items_order_idx" ON "home_page_gallery_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_gallery_items_parent_id_idx" ON "home_page_gallery_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_gallery_items_image_idx" ON "home_page_gallery_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "home_page_hero_media_idx" ON "home_page" USING btree ("hero_media_id");
  CREATE INDEX IF NOT EXISTS "home_page_hero_video_idx" ON "home_page" USING btree ("hero_video_id");
  CREATE INDEX IF NOT EXISTS "home_page_hero_video_poster_idx" ON "home_page" USING btree ("hero_video_poster_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_image_idx" ON "home_page" USING btree ("about_image_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_detail_image_idx" ON "home_page" USING btree ("about_detail_image_id");
  CREATE INDEX IF NOT EXISTS "home_page_appointment_image_idx" ON "home_page" USING btree ("appointment_image_id");
  CREATE INDEX IF NOT EXISTS "locations_emergency_leaflet_idx" ON "locations" USING btree ("emergency_leaflet_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_services_overview_cta_image_idx" ON "pages_blocks_services_overview" USING btree ("cta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_call_to_action_image_idx" ON "pages_blocks_call_to_action" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_services_overview_cta_image_idx" ON "_pages_v_blocks_services_overview" USING btree ("cta_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_call_to_action_image_idx" ON "_pages_v_blocks_call_to_action" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_shared_media_shared_media_default_hero_ima_idx" ON "site_settings" USING btree ("shared_media_default_hero_image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_shared_media_shared_media_default_cta_imag_idx" ON "site_settings" USING btree ("shared_media_default_cta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations_emergency_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_services_overview_journey_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_services_overview_journey_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "design_system" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_about_extended_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_about_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_care_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations_emergency_services" CASCADE;
  DROP TABLE "pages_blocks_services_overview_journey_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_services_overview_journey_steps" CASCADE;
  DROP TABLE "design_system" CASCADE;
  DROP TABLE "home_page_about_extended_paragraphs" CASCADE;
  DROP TABLE "home_page_about_highlights" CASCADE;
  DROP TABLE "home_page_care_cards" CASCADE;
  DROP TABLE "home_page_gallery_items" CASCADE;
  DROP TABLE "home_page" CASCADE;
  ALTER TABLE "locations" DROP CONSTRAINT "locations_emergency_leaflet_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_services_overview" DROP CONSTRAINT "pages_blocks_services_overview_cta_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_call_to_action" DROP CONSTRAINT "pages_blocks_call_to_action_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_services_overview" DROP CONSTRAINT "_pages_v_blocks_services_overview_cta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_call_to_action" DROP CONSTRAINT "_pages_v_blocks_call_to_action_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_shared_media_default_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_shared_media_default_cta_image_id_media_id_fk";
  
  ALTER TABLE "locations_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "locations_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_rich_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_image_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_image_gallery_images_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_image_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_services_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_team_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_location_information_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_contact_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_call_to_action_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_image_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_image_gallery_images_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_image_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_location_information_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_contact_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_call_to_action_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "services_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_services_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "team_members_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('de');
  ALTER TABLE "locations_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "locations_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_rich_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_image_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_image_gallery_images_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_image_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_services_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_team_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_location_information_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_contact_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_call_to_action_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_image_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_image_gallery_images_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_image_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_location_information_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_contact_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_call_to_action_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "services_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_services_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "team_members_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "site_settings_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_published_locale";
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('de');
  ALTER TABLE "_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__pages_v_published_locale" USING "published_locale"::"public"."enum__pages_v_published_locale";
  ALTER TABLE "_services_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__services_v_published_locale";
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('de');
  ALTER TABLE "_services_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__services_v_published_locale" USING "published_locale"::"public"."enum__services_v_published_locale";
  DROP INDEX "locations_emergency_leaflet_idx";
  DROP INDEX "pages_blocks_services_overview_cta_image_idx";
  DROP INDEX "pages_blocks_call_to_action_image_idx";
  DROP INDEX "_pages_v_blocks_services_overview_cta_image_idx";
  DROP INDEX "_pages_v_blocks_call_to_action_image_idx";
  DROP INDEX "site_settings_shared_media_shared_media_default_hero_ima_idx";
  DROP INDEX "site_settings_shared_media_shared_media_default_cta_imag_idx";
  ALTER TABLE "locations" DROP COLUMN "primary_color";
  ALTER TABLE "locations" DROP COLUMN "hin_email";
  ALTER TABLE "locations" DROP COLUMN "emergency_leaflet_id";
  ALTER TABLE "locations" DROP COLUMN "emergency_leaflet_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "hide_default_actions";
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "appearance";
  ALTER TABLE "pages_blocks_rich_text_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_rich_text_locales" DROP COLUMN "sidebar_title";
  ALTER TABLE "pages_blocks_rich_text_locales" DROP COLUMN "sidebar_text";
  ALTER TABLE "pages_blocks_services_overview" DROP COLUMN "cta_button_href";
  ALTER TABLE "pages_blocks_services_overview" DROP COLUMN "cta_image_id";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "heading_highlight";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "card_link_label";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "journey_eyebrow";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "journey_heading";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "journey_highlight";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "journey_description";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "cta_eyebrow";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "cta_heading";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "cta_highlight";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "cta_description";
  ALTER TABLE "pages_blocks_services_overview_locales" DROP COLUMN "cta_button_label";
  ALTER TABLE "pages_blocks_team_overview" DROP COLUMN "show_biographies";
  ALTER TABLE "pages_blocks_team_overview_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_team_overview_locales" DROP COLUMN "default_role_label";
  ALTER TABLE "pages_blocks_call_to_action" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_call_to_action_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "hide_default_actions";
  ALTER TABLE "_pages_v_blocks_hero_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_hero_locales" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "appearance";
  ALTER TABLE "_pages_v_blocks_rich_text_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_rich_text_locales" DROP COLUMN "sidebar_title";
  ALTER TABLE "_pages_v_blocks_rich_text_locales" DROP COLUMN "sidebar_text";
  ALTER TABLE "_pages_v_blocks_services_overview" DROP COLUMN "cta_button_href";
  ALTER TABLE "_pages_v_blocks_services_overview" DROP COLUMN "cta_image_id";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "heading_highlight";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "card_link_label";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "journey_eyebrow";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "journey_heading";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "journey_highlight";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "journey_description";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "cta_eyebrow";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "cta_heading";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "cta_highlight";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "cta_description";
  ALTER TABLE "_pages_v_blocks_services_overview_locales" DROP COLUMN "cta_button_label";
  ALTER TABLE "_pages_v_blocks_team_overview" DROP COLUMN "show_biographies";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_team_overview_locales" DROP COLUMN "default_role_label";
  ALTER TABLE "_pages_v_blocks_call_to_action" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_call_to_action_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "services" DROP COLUMN "category";
  ALTER TABLE "_services_v" DROP COLUMN "version_category";
  ALTER TABLE "media" DROP COLUMN "media_type";
  ALTER TABLE "media" DROP COLUMN "hls_url";
  ALTER TABLE "site_settings" DROP COLUMN "shared_media_default_hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "shared_media_default_cta_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "booking_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_form_button_label";
  ALTER TABLE "site_settings" DROP COLUMN "service_sidebar_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "related_services_heading";
  ALTER TABLE "site_settings" DROP COLUMN "service_sidebar_description";
  ALTER TABLE "site_settings" DROP COLUMN "service_fallback_detail";
  ALTER TABLE "site_settings" DROP COLUMN "footer_hours_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_nav_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_legal_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_notfall_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_jobs_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_impressum_label";
  ALTER TABLE "site_settings" DROP COLUMN "footer_datenschutz_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_section_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "contact_name_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_email_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_message_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_form_note";
  ALTER TABLE "site_settings" DROP COLUMN "services_filter_all_label";
  ALTER TABLE "site_settings" DROP COLUMN "services_filter_vorsorge_label";
  ALTER TABLE "site_settings" DROP COLUMN "services_filter_zahnerhalt_label";
  ALTER TABLE "site_settings" DROP COLUMN "services_filter_aesthetik_label";
  ALTER TABLE "site_settings" DROP COLUMN "services_filter_notfall_label";
  ALTER TABLE "site_settings" DROP COLUMN "service_breadcrumb_label";
  ALTER TABLE "site_settings" DROP COLUMN "service_detail_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "service_related_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "service_view_all_label";
  ALTER TABLE "site_settings" DROP COLUMN "service_card_details_label";
  ALTER TABLE "site_settings" DROP COLUMN "location_eyebrow_label";
  ALTER TABLE "site_settings" DROP COLUMN "location_map_action_label";
  ALTER TABLE "site_settings" DROP COLUMN "emergency_section_label";
  ALTER TABLE "site_settings" DROP COLUMN "team_portrait_placeholder_label";
  DROP TYPE "public"."enum_pages_blocks_rich_text_appearance";
  DROP TYPE "public"."enum_pages_blocks_services_overview_journey_steps_icon";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_services_overview_journey_steps_icon";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum__services_v_version_category";
  DROP TYPE "public"."enum_media_media_type";
  DROP TYPE "public"."enum_design_system_theme_preset";
  DROP TYPE "public"."enum_design_system_heading_font";
  DROP TYPE "public"."enum_design_system_body_font";
  DROP TYPE "public"."enum_home_page_care_cards_icon";
  DROP TYPE "public"."enum_home_page_care_cards_surface_style";
  DROP TYPE "public"."enum_home_page_gallery_items_layout_span";
  DROP TYPE "public"."enum_home_page_hero_background_type";`)
}
