import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_documents_category" AS ENUM('contract', 'health-guarantee', 'info-packet', 'other');
  CREATE TYPE "public"."enum_dogs_role" AS ENUM('sire', 'dam', 'retired');
  CREATE TYPE "public"."enum_dogs_sex" AS ENUM('male', 'female');
  CREATE TYPE "public"."enum_litters_status" AS ENUM('planned', 'expecting', 'born', 'available', 'reserved', 'placed');
  CREATE TYPE "public"."enum_puppies_sex" AS ENUM('male', 'female');
  CREATE TYPE "public"."enum_puppies_status" AS ENUM('available', 'reserved', 'under-evaluation', 'waitlist-only', 'placed');
  CREATE TYPE "public"."enum_applications_housing_type" AS ENUM('house', 'townhouse', 'apartment', 'farm', 'other');
  CREATE TYPE "public"."enum_applications_yard_fence" AS ENUM('fenced', 'unfenced', 'none');
  CREATE TYPE "public"."enum_applications_sex_preference" AS ENUM('either', 'male', 'female');
  CREATE TYPE "public"."enum_applications_status" AS ENUM('new', 'needs-follow-up', 'approved', 'deposit-sent', 'reserved', 'waitlisted', 'declined');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('general', 'pricing', 'waitlist', 'registration', 'health', 'pickup', 'care');
  CREATE TYPE "public"."enum_deposits_status" AS ENUM('draft', 'sent', 'paid', 'refunded', 'cancelled');
  CREATE TYPE "public"."enum_site_settings_address_visibility" AS ENUM('hidden', 'generalized', 'full');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_documents_category" DEFAULT 'other',
  	"public" boolean DEFAULT false,
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
  
  CREATE TABLE "dogs_health_testing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"test" varchar NOT NULL,
  	"result" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "dogs_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "dogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"call_name" varchar NOT NULL,
  	"registered_name" varchar,
  	"slug" varchar,
  	"role" "enum_dogs_role" DEFAULT 'dam' NOT NULL,
  	"sex" "enum_dogs_sex" NOT NULL,
  	"date_of_birth" timestamp(3) with time zone,
  	"color" varchar,
  	"weight" varchar,
  	"temperament" varchar,
  	"pedigree_notes" varchar,
  	"titles" varchar,
  	"featured_image_id" integer,
  	"published" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "litters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"sire_id" integer,
  	"dam_id" integer,
  	"status" "enum_litters_status" DEFAULT 'planned' NOT NULL,
  	"waitlist_open" boolean DEFAULT false,
  	"expected_date" timestamp(3) with time zone,
  	"go_home_date" timestamp(3) with time zone,
  	"description" varchar,
  	"cover_image_id" integer,
  	"published" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "puppies_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "puppies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"collar_color" varchar,
  	"slug" varchar,
  	"litter_id" integer NOT NULL,
  	"sex" "enum_puppies_sex" NOT NULL,
  	"status" "enum_puppies_status" DEFAULT 'under-evaluation' NOT NULL,
  	"date_of_birth" timestamp(3) with time zone,
  	"go_home_date" timestamp(3) with time zone,
  	"color" varchar,
  	"notes" varchar,
  	"featured_image_id" integer,
  	"published" boolean DEFAULT false,
  	"allow_deposit" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"applicant_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"city_state" varchar NOT NULL,
  	"household_members" varchar NOT NULL,
  	"children" varchar,
  	"other_pets" varchar,
  	"housing_type" "enum_applications_housing_type" NOT NULL,
  	"yard_fence" "enum_applications_yard_fence",
  	"work_schedule" varchar NOT NULL,
  	"prior_experience" varchar NOT NULL,
  	"vet_reference" varchar,
  	"activity_level" varchar NOT NULL,
  	"training_plan" varchar NOT NULL,
  	"why_breed" varchar NOT NULL,
  	"desired_timing" varchar NOT NULL,
  	"sex_preference" "enum_applications_sex_preference",
  	"puppy_id" integer,
  	"agreement" boolean DEFAULT false NOT NULL,
  	"contact_consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_applications_status" DEFAULT 'new' NOT NULL,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "applications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"deposits_id" integer
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"owner_name" varchar NOT NULL,
  	"dog_name" varchar,
  	"location" varchar,
  	"date" timestamp(3) with time zone,
  	"photo_id" integer,
  	"published" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'general',
  	"order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"subtitle" varchar,
  	"hero_image_id" integer,
  	"body" jsonb,
  	"published" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "deposits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"application_id" integer NOT NULL,
  	"puppy_id" integer,
  	"amount" numeric NOT NULL,
  	"status" "enum_deposits_status" DEFAULT 'draft',
  	"payment_url" varchar,
  	"stripe_id" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"dogs_id" integer,
  	"litters_id" integer,
  	"puppies_id" integer,
  	"applications_id" integer,
  	"contact_messages_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"pages_id" integer,
  	"deposits_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_name" varchar DEFAULT 'Cirilli English Goldens' NOT NULL,
  	"tagline" varchar DEFAULT 'Thoughtfully raised English Golden Retrievers in Suffolk, Virginia.',
  	"breeder_name" varchar DEFAULT 'Pamela Cirilli',
  	"show_breeder_name" boolean DEFAULT true,
  	"logo_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"address_visibility" "enum_site_settings_address_visibility" DEFAULT 'generalized',
  	"city" varchar DEFAULT 'Suffolk',
  	"state" varchar DEFAULT 'VA',
  	"street_address" varchar,
  	"postal_code" varchar,
  	"service_area" varchar DEFAULT 'Suffolk, VA and the greater Hampton Roads / Tidewater area',
  	"badge_akc" boolean DEFAULT false,
  	"badge_ofa" boolean DEFAULT false,
  	"badge_embark" boolean DEFAULT false,
  	"badge_vet_checked" boolean DEFAULT true,
  	"badge_family_raised" boolean DEFAULT true,
  	"facebook" varchar,
  	"instagram" varchar,
  	"youtube" varchar,
  	"tiktok" varchar,
  	"default_meta_title" varchar,
  	"default_meta_description" varchar,
  	"default_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dogs_health_testing" ADD CONSTRAINT "dogs_health_testing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dogs_gallery" ADD CONSTRAINT "dogs_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dogs_gallery" ADD CONSTRAINT "dogs_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dogs" ADD CONSTRAINT "dogs_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dogs" ADD CONSTRAINT "dogs_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "litters" ADD CONSTRAINT "litters_sire_id_dogs_id_fk" FOREIGN KEY ("sire_id") REFERENCES "public"."dogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "litters" ADD CONSTRAINT "litters_dam_id_dogs_id_fk" FOREIGN KEY ("dam_id") REFERENCES "public"."dogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "litters" ADD CONSTRAINT "litters_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "litters" ADD CONSTRAINT "litters_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "puppies_photos" ADD CONSTRAINT "puppies_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "puppies_photos" ADD CONSTRAINT "puppies_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."puppies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "puppies" ADD CONSTRAINT "puppies_litter_id_litters_id_fk" FOREIGN KEY ("litter_id") REFERENCES "public"."litters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "puppies" ADD CONSTRAINT "puppies_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_puppy_id_puppies_id_fk" FOREIGN KEY ("puppy_id") REFERENCES "public"."puppies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_rels" ADD CONSTRAINT "applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_rels" ADD CONSTRAINT "applications_rels_deposits_fk" FOREIGN KEY ("deposits_id") REFERENCES "public"."deposits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deposits" ADD CONSTRAINT "deposits_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deposits" ADD CONSTRAINT "deposits_puppy_id_puppies_id_fk" FOREIGN KEY ("puppy_id") REFERENCES "public"."puppies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dogs_fk" FOREIGN KEY ("dogs_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_litters_fk" FOREIGN KEY ("litters_id") REFERENCES "public"."litters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_puppies_fk" FOREIGN KEY ("puppies_id") REFERENCES "public"."puppies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deposits_fk" FOREIGN KEY ("deposits_id") REFERENCES "public"."deposits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "dogs_health_testing_order_idx" ON "dogs_health_testing" USING btree ("_order");
  CREATE INDEX "dogs_health_testing_parent_id_idx" ON "dogs_health_testing" USING btree ("_parent_id");
  CREATE INDEX "dogs_gallery_order_idx" ON "dogs_gallery" USING btree ("_order");
  CREATE INDEX "dogs_gallery_parent_id_idx" ON "dogs_gallery" USING btree ("_parent_id");
  CREATE INDEX "dogs_gallery_image_idx" ON "dogs_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "dogs_slug_idx" ON "dogs" USING btree ("slug");
  CREATE INDEX "dogs_featured_image_idx" ON "dogs" USING btree ("featured_image_id");
  CREATE INDEX "dogs_seo_seo_image_idx" ON "dogs" USING btree ("seo_image_id");
  CREATE INDEX "dogs_updated_at_idx" ON "dogs" USING btree ("updated_at");
  CREATE INDEX "dogs_created_at_idx" ON "dogs" USING btree ("created_at");
  CREATE UNIQUE INDEX "litters_slug_idx" ON "litters" USING btree ("slug");
  CREATE INDEX "litters_sire_idx" ON "litters" USING btree ("sire_id");
  CREATE INDEX "litters_dam_idx" ON "litters" USING btree ("dam_id");
  CREATE INDEX "litters_cover_image_idx" ON "litters" USING btree ("cover_image_id");
  CREATE INDEX "litters_seo_seo_image_idx" ON "litters" USING btree ("seo_image_id");
  CREATE INDEX "litters_updated_at_idx" ON "litters" USING btree ("updated_at");
  CREATE INDEX "litters_created_at_idx" ON "litters" USING btree ("created_at");
  CREATE INDEX "puppies_photos_order_idx" ON "puppies_photos" USING btree ("_order");
  CREATE INDEX "puppies_photos_parent_id_idx" ON "puppies_photos" USING btree ("_parent_id");
  CREATE INDEX "puppies_photos_image_idx" ON "puppies_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "puppies_slug_idx" ON "puppies" USING btree ("slug");
  CREATE INDEX "puppies_litter_idx" ON "puppies" USING btree ("litter_id");
  CREATE INDEX "puppies_featured_image_idx" ON "puppies" USING btree ("featured_image_id");
  CREATE INDEX "puppies_updated_at_idx" ON "puppies" USING btree ("updated_at");
  CREATE INDEX "puppies_created_at_idx" ON "puppies" USING btree ("created_at");
  CREATE INDEX "applications_puppy_idx" ON "applications" USING btree ("puppy_id");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "applications_rels_order_idx" ON "applications_rels" USING btree ("order");
  CREATE INDEX "applications_rels_parent_idx" ON "applications_rels" USING btree ("parent_id");
  CREATE INDEX "applications_rels_path_idx" ON "applications_rels" USING btree ("path");
  CREATE INDEX "applications_rels_deposits_id_idx" ON "applications_rels" USING btree ("deposits_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "deposits_application_idx" ON "deposits" USING btree ("application_id");
  CREATE INDEX "deposits_puppy_idx" ON "deposits" USING btree ("puppy_id");
  CREATE INDEX "deposits_updated_at_idx" ON "deposits" USING btree ("updated_at");
  CREATE INDEX "deposits_created_at_idx" ON "deposits" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_dogs_id_idx" ON "payload_locked_documents_rels" USING btree ("dogs_id");
  CREATE INDEX "payload_locked_documents_rels_litters_id_idx" ON "payload_locked_documents_rels" USING btree ("litters_id");
  CREATE INDEX "payload_locked_documents_rels_puppies_id_idx" ON "payload_locked_documents_rels" USING btree ("puppies_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_deposits_id_idx" ON "payload_locked_documents_rels" USING btree ("deposits_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "dogs_health_testing" CASCADE;
  DROP TABLE "dogs_gallery" CASCADE;
  DROP TABLE "dogs" CASCADE;
  DROP TABLE "litters" CASCADE;
  DROP TABLE "puppies_photos" CASCADE;
  DROP TABLE "puppies" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "applications_rels" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "deposits" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum_dogs_role";
  DROP TYPE "public"."enum_dogs_sex";
  DROP TYPE "public"."enum_litters_status";
  DROP TYPE "public"."enum_puppies_sex";
  DROP TYPE "public"."enum_puppies_status";
  DROP TYPE "public"."enum_applications_housing_type";
  DROP TYPE "public"."enum_applications_yard_fence";
  DROP TYPE "public"."enum_applications_sex_preference";
  DROP TYPE "public"."enum_applications_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_deposits_status";
  DROP TYPE "public"."enum_site_settings_address_visibility";`)
}
