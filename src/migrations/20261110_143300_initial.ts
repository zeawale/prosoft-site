import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`phone\` text NOT NULL,
  	\`company\` text,
  	\`comment\` text,
  	\`details\` text,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`page\` text,
  	\`consent_at\` text,
  	\`consent_ip\` text,
  	\`consent_version\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`cases_changes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`what\` text NOT NULL,
  	\`before\` text NOT NULL,
  	\`after\` text NOT NULL,
  	\`numeric\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_changes_order_idx\` ON \`cases_changes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_changes_parent_id_idx\` ON \`cases_changes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_results_order_idx\` ON \`cases_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_results_parent_id_idx\` ON \`cases_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_tags_order_idx\` ON \`cases_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_tags_parent_id_idx\` ON \`cases_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`metric\` text NOT NULL,
  	\`before\` text NOT NULL,
  	\`after\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`task\` text NOT NULL,
  	\`done\` text NOT NULL,
  	\`page_title\` text NOT NULL,
  	\`breadcrumb\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`industry\` text NOT NULL,
  	\`configuration\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`story_task\` text NOT NULL,
  	\`story_solution\` text NOT NULL,
  	\`tags_in_head\` integer DEFAULT false,
  	\`next_summary\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`show_on_home\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`catalog_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`cases_slug_idx\` ON \`cases\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`cases_updated_at_idx\` ON \`cases\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cases_created_at_idx\` ON \`cases\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`publications_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`marker\` text,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`publications_list_order_idx\` ON \`publications_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`publications_list_parent_id_idx\` ON \`publications_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`publications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'article' NOT NULL,
  	\`title\` text NOT NULL,
  	\`source\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`cover_id\` integer,
  	\`duration\` text,
  	\`caption\` text,
  	\`detail_source\` text NOT NULL,
  	\`meta\` text NOT NULL,
  	\`lead\` text NOT NULL,
  	\`list_title\` text,
  	\`list_kind\` text DEFAULT 'text',
  	\`cta_label\` text NOT NULL,
  	\`url\` text,
  	\`show_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`publications_cover_idx\` ON \`publications\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`publications_updated_at_idx\` ON \`publications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`publications_created_at_idx\` ON \`publications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text NOT NULL,
  	\`role\` text,
  	\`text\` text NOT NULL,
  	\`excerpt\` text,
  	\`show_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`team_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_links_order_idx\` ON \`team_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`team_links_parent_id_idx\` ON \`team_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`team\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`photo_id\` integer NOT NULL,
  	\`quote\` text,
  	\`is_founder\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_photo_idx\` ON \`team\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`team_updated_at_idx\` ON \`team\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`team_created_at_idx\` ON \`team\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_paragraphs_order_idx\` ON \`legal_pages_sections_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_paragraphs_parent_id_idx\` ON \`legal_pages_sections_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_list_order_idx\` ON \`legal_pages_sections_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_list_parent_id_idx\` ON \`legal_pages_sections_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`list_type\` text DEFAULT 'unordered',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_order_idx\` ON \`legal_pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_parent_id_idx\` ON \`legal_pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`lead\` text,
  	\`effective_date\` text NOT NULL,
  	\`version\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`legal_pages_slug_idx\` ON \`legal_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_updated_at_idx\` ON \`legal_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_created_at_idx\` ON \`legal_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`leads_id\` integer,
  	\`cases_id\` integer,
  	\`publications_id\` integer,
  	\`reviews_id\` integer,
  	\`team_id\` integer,
  	\`legal_pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`publications_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legal_pages_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cases_id_idx\` ON \`payload_locked_documents_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_publications_id_idx\` ON \`payload_locked_documents_rels\` (\`publications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_legal_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_pages_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_hero_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_hero_facts_order_idx\` ON \`home_hero_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_hero_facts_parent_id_idx\` ON \`home_hero_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_date_strip_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_date_strip_rows_order_idx\` ON \`home_date_strip_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_date_strip_rows_parent_id_idx\` ON \`home_date_strip_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_date_strip_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`starts_on\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_date_strip_timeline_order_idx\` ON \`home_date_strip_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_date_strip_timeline_parent_id_idx\` ON \`home_date_strip_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_diagnostics_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_diagnostics_deliverables_order_idx\` ON \`home_diagnostics_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_diagnostics_deliverables_parent_id_idx\` ON \`home_diagnostics_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_pain_check_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`statement\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_pain_check_items_order_idx\` ON \`home_pain_check_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_pain_check_items_parent_id_idx\` ON \`home_pain_check_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_services_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`deliverable\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`route\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_services_items_order_idx\` ON \`home_services_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_services_items_parent_id_idx\` ON \`home_services_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_services_processes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_services_processes_order_idx\` ON \`home_services_processes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_services_processes_parent_id_idx\` ON \`home_services_processes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_stages_table_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`pay\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_stages_table_steps_order_idx\` ON \`home_stages_table_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_stages_table_steps_parent_id_idx\` ON \`home_stages_table_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_faq_items_order_idx\` ON \`home_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_faq_items_parent_id_idx\` ON \`home_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_primary_label\` text NOT NULL,
  	\`hero_secondary_label\` text,
  	\`hero_secondary_route\` text,
  	\`date_strip_label\` text NOT NULL,
  	\`date_strip_main_date\` text NOT NULL,
  	\`date_strip_main_title\` text NOT NULL,
  	\`date_strip_source\` text,
  	\`date_strip_link_label\` text,
  	\`date_strip_link_route\` text,
  	\`date_strip_today_label\` text DEFAULT 'Сегодня',
  	\`diagnostics_caption\` text,
  	\`diagnostics_title\` text NOT NULL,
  	\`diagnostics_lead\` text,
  	\`diagnostics_checks_title\` text,
  	\`diagnostics_button_label\` text NOT NULL,
  	\`diagnostics_checks_text\` text,
  	\`diagnostics_note\` text,
  	\`pain_check_title\` text NOT NULL,
  	\`pain_check_lead\` text,
  	\`pain_check_answer_label\` text NOT NULL,
  	\`pain_check_summary\` text NOT NULL,
  	\`pain_check_button_label\` text NOT NULL,
  	\`services_title\` text NOT NULL,
  	\`services_lead\` text,
  	\`services_processes_title\` text NOT NULL,
  	\`stages_title\` text NOT NULL,
  	\`stages_lead\` text,
  	\`stages_table_stage_label\` text NOT NULL,
  	\`stages_table_term_label\` text NOT NULL,
  	\`stages_table_result_label\` text NOT NULL,
  	\`stages_table_pay_label\` text NOT NULL,
  	\`cases_title\` text NOT NULL,
  	\`cases_lead\` text,
  	\`cases_all_label\` text NOT NULL,
  	\`cases_labels_before\` text NOT NULL,
  	\`cases_labels_after\` text NOT NULL,
  	\`cases_labels_task\` text NOT NULL,
  	\`cases_labels_done\` text NOT NULL,
  	\`cases_labels_read\` text NOT NULL,
  	\`team_title\` text NOT NULL,
  	\`team_lead\` text,
  	\`reviews_title\` text NOT NULL,
  	\`reviews_lead\` text,
  	\`reviews_all_label\` text NOT NULL,
  	\`reviews_collapse_label\` text NOT NULL,
  	\`reviews_more_label\` text NOT NULL,
  	\`reviews_less_label\` text NOT NULL,
  	\`publications_title\` text NOT NULL,
  	\`publications_lead\` text,
  	\`publications_talks_title\` text NOT NULL,
  	\`publications_articles_title\` text NOT NULL,
  	\`publications_close_label\` text NOT NULL,
  	\`faq_title\` text NOT NULL,
  	\`faq_lead\` text,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`upp_date_strip_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_date_strip_rows_order_idx\` ON \`upp_date_strip_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_date_strip_rows_parent_id_idx\` ON \`upp_date_strip_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_date_strip_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`starts_on\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_date_strip_timeline_order_idx\` ON \`upp_date_strip_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_date_strip_timeline_parent_id_idx\` ON \`upp_date_strip_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_scenarios_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`fit\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`budget\` text NOT NULL,
  	\`licenses\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_scenarios_items_order_idx\` ON \`upp_scenarios_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_scenarios_items_parent_id_idx\` ON \`upp_scenarios_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_erp_or_ka_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`decisive\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_erp_or_ka_questions_order_idx\` ON \`upp_erp_or_ka_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_erp_or_ka_questions_parent_id_idx\` ON \`upp_erp_or_ka_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_erp_or_ka_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`ka\` text NOT NULL,
  	\`erp\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_erp_or_ka_rows_order_idx\` ON \`upp_erp_or_ka_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_erp_or_ka_rows_parent_id_idx\` ON \`upp_erp_or_ka_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_transition_table_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group\` text,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`pay\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_transition_table_steps_order_idx\` ON \`upp_transition_table_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_transition_table_steps_parent_id_idx\` ON \`upp_transition_table_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_proof_timecodes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`time\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_proof_timecodes_order_idx\` ON \`upp_proof_timecodes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_proof_timecodes_parent_id_idx\` ON \`upp_proof_timecodes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_faq_items_order_idx\` ON \`upp_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`upp_faq_items_parent_id_idx\` ON \`upp_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`upp\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_cta_label\` text NOT NULL,
  	\`hero_cta_comment\` text,
  	\`date_strip_label\` text NOT NULL,
  	\`date_strip_main_date\` text NOT NULL,
  	\`date_strip_main_title\` text NOT NULL,
  	\`date_strip_source\` text,
  	\`date_strip_link_label\` text,
  	\`date_strip_link_route\` text,
  	\`date_strip_today_label\` text DEFAULT 'Сегодня',
  	\`scenarios_title\` text NOT NULL,
  	\`scenarios_lead\` text,
  	\`scenarios_fit_label\` text NOT NULL,
  	\`scenarios_term_label\` text NOT NULL,
  	\`scenarios_budget_label\` text NOT NULL,
  	\`scenarios_licenses_label\` text NOT NULL,
  	\`erp_or_ka_title\` text NOT NULL,
  	\`erp_or_ka_lead\` text,
  	\`erp_or_ka_questions_title\` text NOT NULL,
  	\`erp_or_ka_no_label\` text NOT NULL,
  	\`erp_or_ka_yes_label\` text NOT NULL,
  	\`erp_or_ka_hint\` text NOT NULL,
  	\`erp_or_ka_match_label\` text NOT NULL,
  	\`erp_or_ka_button_label\` text NOT NULL,
  	\`erp_or_ka_ka_title\` text NOT NULL,
  	\`erp_or_ka_ka_text\` text NOT NULL,
  	\`erp_or_ka_ka_verdict_title\` text NOT NULL,
  	\`erp_or_ka_ka_verdict_text\` text NOT NULL,
  	\`erp_or_ka_erp_title\` text NOT NULL,
  	\`erp_or_ka_erp_text\` text NOT NULL,
  	\`erp_or_ka_erp_verdict_title\` text NOT NULL,
  	\`erp_or_ka_erp_verdict_text\` text NOT NULL,
  	\`transition_title\` text NOT NULL,
  	\`transition_lead\` text,
  	\`transition_table_stage_label\` text NOT NULL,
  	\`transition_table_term_label\` text NOT NULL,
  	\`transition_table_result_label\` text NOT NULL,
  	\`transition_table_pay_label\` text NOT NULL,
  	\`proof_title\` text NOT NULL,
  	\`proof_all_label\` text NOT NULL,
  	\`proof_tag\` text,
  	\`proof_labels_before\` text NOT NULL,
  	\`proof_labels_after\` text NOT NULL,
  	\`proof_labels_task\` text NOT NULL,
  	\`proof_labels_done\` text NOT NULL,
  	\`proof_labels_read\` text NOT NULL,
  	\`proof_webinar_id\` integer,
  	\`proof_webinar_cover_id\` integer,
  	\`proof_webinar_intro\` text NOT NULL,
  	\`proof_webinar_close_label\` text DEFAULT 'Закрыть' NOT NULL,
  	\`faq_title\` text NOT NULL,
  	\`faq_lead\` text,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`proof_webinar_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`proof_webinar_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_proof_proof_webinar_idx\` ON \`upp\` (\`proof_webinar_id\`);`)
  await db.run(sql`CREATE INDEX \`upp_proof_proof_webinar_cover_idx\` ON \`upp\` (\`proof_webinar_cover_id\`);`)
  await db.run(sql`CREATE TABLE \`upp_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cases_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`upp\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`upp_rels_order_idx\` ON \`upp_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`upp_rels_parent_idx\` ON \`upp_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`upp_rels_path_idx\` ON \`upp_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`upp_rels_cases_id_idx\` ON \`upp_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_erp_or_ka_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`decisive\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_erp_or_ka_questions_order_idx\` ON \`erp_erp_or_ka_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_erp_or_ka_questions_parent_id_idx\` ON \`erp_erp_or_ka_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_erp_or_ka_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`ka\` text NOT NULL,
  	\`erp\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_erp_or_ka_rows_order_idx\` ON \`erp_erp_or_ka_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_erp_or_ka_rows_parent_id_idx\` ON \`erp_erp_or_ka_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_map_integrations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_map_integrations_order_idx\` ON \`erp_map_integrations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_map_integrations_parent_id_idx\` ON \`erp_map_integrations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_map_nodes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`subsystem\` text NOT NULL,
  	\`benefit\` text NOT NULL,
  	\`related_case_id\` integer,
  	\`case_link\` text,
  	\`open_by_default\` integer DEFAULT false,
  	FOREIGN KEY (\`related_case_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_map_nodes_order_idx\` ON \`erp_map_nodes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_map_nodes_parent_id_idx\` ON \`erp_map_nodes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`erp_map_nodes_related_case_idx\` ON \`erp_map_nodes\` (\`related_case_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_stages_table_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`price\` text,
  	\`pay\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_stages_table_steps_order_idx\` ON \`erp_stages_table_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_stages_table_steps_parent_id_idx\` ON \`erp_stages_table_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`erp_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_faq_items_order_idx\` ON \`erp_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`erp_faq_items_parent_id_idx\` ON \`erp_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`erp\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_cta_label\` text NOT NULL,
  	\`hero_cta_comment\` text,
  	\`erp_or_ka_title\` text NOT NULL,
  	\`erp_or_ka_lead\` text,
  	\`erp_or_ka_questions_title\` text NOT NULL,
  	\`erp_or_ka_no_label\` text NOT NULL,
  	\`erp_or_ka_yes_label\` text NOT NULL,
  	\`erp_or_ka_hint\` text NOT NULL,
  	\`erp_or_ka_match_label\` text NOT NULL,
  	\`erp_or_ka_button_label\` text NOT NULL,
  	\`erp_or_ka_ka_title\` text NOT NULL,
  	\`erp_or_ka_ka_text\` text NOT NULL,
  	\`erp_or_ka_ka_verdict_title\` text NOT NULL,
  	\`erp_or_ka_ka_verdict_text\` text NOT NULL,
  	\`erp_or_ka_erp_title\` text NOT NULL,
  	\`erp_or_ka_erp_text\` text NOT NULL,
  	\`erp_or_ka_erp_verdict_title\` text NOT NULL,
  	\`erp_or_ka_erp_verdict_text\` text NOT NULL,
  	\`map_title\` text NOT NULL,
  	\`map_lead\` text,
  	\`map_integrations_title\` text NOT NULL,
  	\`map_node_prefix\` text NOT NULL,
  	\`map_subsystem_label\` text NOT NULL,
  	\`map_benefit_label\` text NOT NULL,
  	\`map_case_label\` text NOT NULL,
  	\`stages_title\` text NOT NULL,
  	\`stages_lead\` text,
  	\`stages_table_stage_label\` text NOT NULL,
  	\`stages_table_term_label\` text NOT NULL,
  	\`stages_table_result_label\` text NOT NULL,
  	\`stages_table_price_label\` text NOT NULL,
  	\`stages_table_pay_label\` text NOT NULL,
  	\`proof_title\` text NOT NULL,
  	\`proof_all_label\` text NOT NULL,
  	\`proof_labels_before\` text NOT NULL,
  	\`proof_labels_after\` text NOT NULL,
  	\`proof_labels_task\` text NOT NULL,
  	\`proof_labels_done\` text NOT NULL,
  	\`proof_labels_read\` text NOT NULL,
  	\`faq_title\` text NOT NULL,
  	\`faq_lead\` text,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`erp_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cases_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`erp\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`erp_rels_order_idx\` ON \`erp_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`erp_rels_parent_idx\` ON \`erp_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`erp_rels_path_idx\` ON \`erp_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`erp_rels_cases_id_idx\` ON \`erp_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_work_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_work_items_order_idx\` ON \`dorabotka_work_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_work_items_parent_id_idx\` ON \`dorabotka_work_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_integrations_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`systems\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`result\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_integrations_items_order_idx\` ON \`dorabotka_integrations_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_integrations_items_parent_id_idx\` ON \`dorabotka_integrations_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_checks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_checks_order_idx\` ON \`dorabotka_audit_checks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_checks_parent_id_idx\` ON \`dorabotka_audit_checks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_title_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_tab_items_order_idx\` ON \`dorabotka_audit_sample_title_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_tab_items_parent_id_idx\` ON \`dorabotka_audit_sample_title_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_title_page_spec\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_spec_order_idx\` ON \`dorabotka_audit_sample_title_page_spec\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_spec_parent_id_idx\` ON \`dorabotka_audit_sample_title_page_spec\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_title_page_totals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_totals_order_idx\` ON \`dorabotka_audit_sample_title_page_totals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_title_page_totals_parent_id_idx\` ON \`dorabotka_audit_sample_title_page_totals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_findings_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_findings_page_tab_items_order_idx\` ON \`dorabotka_audit_sample_findings_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_findings_page_tab_items_parent_id_idx\` ON \`dorabotka_audit_sample_findings_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_findings_page_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`area\` text NOT NULL,
  	\`finding\` text NOT NULL,
  	\`hours\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_findings_page_rows_order_idx\` ON \`dorabotka_audit_sample_findings_page_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_findings_page_rows_parent_id_idx\` ON \`dorabotka_audit_sample_findings_page_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_plan_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_tab_items_order_idx\` ON \`dorabotka_audit_sample_plan_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_tab_items_parent_id_idx\` ON \`dorabotka_audit_sample_plan_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_plan_page_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_stages_order_idx\` ON \`dorabotka_audit_sample_plan_page_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_stages_parent_id_idx\` ON \`dorabotka_audit_sample_plan_page_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_audit_sample_plan_page_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`stage\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`accept\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_rows_order_idx\` ON \`dorabotka_audit_sample_plan_page_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_audit_sample_plan_page_rows_parent_id_idx\` ON \`dorabotka_audit_sample_plan_page_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_format_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_format_principles_order_idx\` ON \`dorabotka_format_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_format_principles_parent_id_idx\` ON \`dorabotka_format_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_format_table_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`pay\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_format_table_steps_order_idx\` ON \`dorabotka_format_table_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_format_table_steps_parent_id_idx\` ON \`dorabotka_format_table_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_cta_label\` text NOT NULL,
  	\`hero_cta_comment\` text,
  	\`work_title\` text NOT NULL,
  	\`work_lead\` text,
  	\`integrations_title\` text NOT NULL,
  	\`integrations_lead\` text,
  	\`audit_title\` text NOT NULL,
  	\`audit_lead\` text,
  	\`audit_sample_brand\` text NOT NULL,
  	\`audit_sample_document\` text NOT NULL,
  	\`audit_sample_note\` text NOT NULL,
  	\`audit_sample_start_page\` text DEFAULT 'title' NOT NULL,
  	\`audit_sample_title_page_tab_title\` text NOT NULL,
  	\`audit_sample_title_page_tab_lead\` text NOT NULL,
  	\`audit_sample_title_page_kicker\` text NOT NULL,
  	\`audit_sample_title_page_heading\` text NOT NULL,
  	\`audit_sample_findings_page_tab_title\` text NOT NULL,
  	\`audit_sample_findings_page_tab_lead\` text NOT NULL,
  	\`audit_sample_findings_page_heading\` text NOT NULL,
  	\`audit_sample_findings_page_area_label\` text NOT NULL,
  	\`audit_sample_findings_page_finding_label\` text NOT NULL,
  	\`audit_sample_findings_page_hours_label\` text NOT NULL,
  	\`audit_sample_findings_page_total_label\` text NOT NULL,
  	\`audit_sample_findings_page_total_note\` text NOT NULL,
  	\`audit_sample_findings_page_total_hours\` text NOT NULL,
  	\`audit_sample_plan_page_tab_title\` text NOT NULL,
  	\`audit_sample_plan_page_tab_lead\` text NOT NULL,
  	\`audit_sample_plan_page_heading\` text NOT NULL,
  	\`audit_sample_plan_page_stage_label\` text NOT NULL,
  	\`audit_sample_plan_page_result_label\` text NOT NULL,
  	\`audit_sample_plan_page_accept_label\` text NOT NULL,
  	\`audit_sample_plan_page_note\` text NOT NULL,
  	\`audit_button_label\` text NOT NULL,
  	\`format_title\` text NOT NULL,
  	\`format_lead\` text,
  	\`format_table_stage_label\` text NOT NULL,
  	\`format_table_term_label\` text NOT NULL,
  	\`format_table_result_label\` text NOT NULL,
  	\`format_table_pay_label\` text NOT NULL,
  	\`proof_title\` text NOT NULL,
  	\`proof_all_label\` text NOT NULL,
  	\`proof_review_id\` integer,
  	\`proof_publication_id\` integer,
  	\`proof_close_label\` text NOT NULL,
  	\`proof_labels_before\` text NOT NULL,
  	\`proof_labels_after\` text NOT NULL,
  	\`proof_labels_task\` text NOT NULL,
  	\`proof_labels_done\` text NOT NULL,
  	\`proof_labels_read\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`proof_review_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`proof_publication_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_proof_proof_review_idx\` ON \`dorabotka\` (\`proof_review_id\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_proof_proof_publication_idx\` ON \`dorabotka\` (\`proof_publication_id\`);`)
  await db.run(sql`CREATE TABLE \`dorabotka_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cases_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`dorabotka\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`dorabotka_rels_order_idx\` ON \`dorabotka_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_rels_parent_idx\` ON \`dorabotka_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_rels_path_idx\` ON \`dorabotka_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`dorabotka_rels_cases_id_idx\` ON \`dorabotka_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE TABLE \`support_included_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_included_items_order_idx\` ON \`support_included_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_included_items_parent_id_idx\` ON \`support_included_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_sla_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`request\` text NOT NULL,
  	\`reaction\` text NOT NULL,
  	\`solution\` text NOT NULL,
  	\`hours\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_sla_rows_order_idx\` ON \`support_sla_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_sla_rows_parent_id_idx\` ON \`support_sla_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support_handover_table_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`pay\` text NOT NULL,
  	\`accent\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`support\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`support_handover_table_steps_order_idx\` ON \`support_handover_table_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`support_handover_table_steps_parent_id_idx\` ON \`support_handover_table_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`support\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_cta_label\` text NOT NULL,
  	\`hero_cta_comment\` text,
  	\`included_title\` text NOT NULL,
  	\`included_lead\` text,
  	\`sla_title\` text NOT NULL,
  	\`sla_lead\` text,
  	\`sla_request_label\` text NOT NULL,
  	\`sla_reaction_label\` text NOT NULL,
  	\`sla_solution_label\` text NOT NULL,
  	\`sla_hours_label\` text NOT NULL,
  	\`sla_price\` text NOT NULL,
  	\`sla_price_caption\` text NOT NULL,
  	\`sla_price_note\` text NOT NULL,
  	\`handover_title\` text NOT NULL,
  	\`handover_lead\` text,
  	\`handover_table_stage_label\` text NOT NULL,
  	\`handover_table_term_label\` text NOT NULL,
  	\`handover_table_result_label\` text NOT NULL,
  	\`handover_table_pay_label\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`diagnostics_checks_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_checks_items_order_idx\` ON \`diagnostics_checks_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_checks_items_parent_id_idx\` ON \`diagnostics_checks_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_title_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_tab_items_order_idx\` ON \`diagnostics_report_sample_title_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_tab_items_parent_id_idx\` ON \`diagnostics_report_sample_title_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_title_page_spec\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_spec_order_idx\` ON \`diagnostics_report_sample_title_page_spec\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_spec_parent_id_idx\` ON \`diagnostics_report_sample_title_page_spec\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_title_page_totals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_totals_order_idx\` ON \`diagnostics_report_sample_title_page_totals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_title_page_totals_parent_id_idx\` ON \`diagnostics_report_sample_title_page_totals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_findings_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_findings_page_tab_items_order_idx\` ON \`diagnostics_report_sample_findings_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_findings_page_tab_items_parent_id_idx\` ON \`diagnostics_report_sample_findings_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_findings_page_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`area\` text NOT NULL,
  	\`finding\` text NOT NULL,
  	\`hours\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_findings_page_rows_order_idx\` ON \`diagnostics_report_sample_findings_page_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_findings_page_rows_parent_id_idx\` ON \`diagnostics_report_sample_findings_page_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_plan_page_tab_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_tab_items_order_idx\` ON \`diagnostics_report_sample_plan_page_tab_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_tab_items_parent_id_idx\` ON \`diagnostics_report_sample_plan_page_tab_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_plan_page_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`term\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_stages_order_idx\` ON \`diagnostics_report_sample_plan_page_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_stages_parent_id_idx\` ON \`diagnostics_report_sample_plan_page_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_report_sample_plan_page_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`stage\` text NOT NULL,
  	\`result\` text NOT NULL,
  	\`accept\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_rows_order_idx\` ON \`diagnostics_report_sample_plan_page_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_report_sample_plan_page_rows_parent_id_idx\` ON \`diagnostics_report_sample_plan_page_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_quiz_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`caption\` text,
  	\`scenario\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics_quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_quiz_questions_options_order_idx\` ON \`diagnostics_quiz_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_quiz_questions_options_parent_id_idx\` ON \`diagnostics_quiz_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics_quiz_questions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`hint\` text,
  	\`multiple\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`diagnostics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`diagnostics_quiz_questions_order_idx\` ON \`diagnostics_quiz_questions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`diagnostics_quiz_questions_parent_id_idx\` ON \`diagnostics_quiz_questions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`diagnostics\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`hero_cta_label\` text NOT NULL,
  	\`checks_title\` text NOT NULL,
  	\`checks_lead\` text,
  	\`report_title\` text NOT NULL,
  	\`report_lead\` text,
  	\`report_sample_brand\` text NOT NULL,
  	\`report_sample_document\` text NOT NULL,
  	\`report_sample_note\` text NOT NULL,
  	\`report_sample_start_page\` text DEFAULT 'title' NOT NULL,
  	\`report_sample_title_page_tab_title\` text NOT NULL,
  	\`report_sample_title_page_tab_lead\` text NOT NULL,
  	\`report_sample_title_page_kicker\` text NOT NULL,
  	\`report_sample_title_page_heading\` text NOT NULL,
  	\`report_sample_findings_page_tab_title\` text NOT NULL,
  	\`report_sample_findings_page_tab_lead\` text NOT NULL,
  	\`report_sample_findings_page_heading\` text NOT NULL,
  	\`report_sample_findings_page_area_label\` text NOT NULL,
  	\`report_sample_findings_page_finding_label\` text NOT NULL,
  	\`report_sample_findings_page_hours_label\` text NOT NULL,
  	\`report_sample_findings_page_total_label\` text NOT NULL,
  	\`report_sample_findings_page_total_note\` text NOT NULL,
  	\`report_sample_findings_page_total_hours\` text NOT NULL,
  	\`report_sample_plan_page_tab_title\` text NOT NULL,
  	\`report_sample_plan_page_tab_lead\` text NOT NULL,
  	\`report_sample_plan_page_heading\` text NOT NULL,
  	\`report_sample_plan_page_stage_label\` text NOT NULL,
  	\`report_sample_plan_page_result_label\` text NOT NULL,
  	\`report_sample_plan_page_accept_label\` text NOT NULL,
  	\`report_sample_plan_page_note\` text NOT NULL,
  	\`report_button_label\` text NOT NULL,
  	\`quiz_title\` text NOT NULL,
  	\`quiz_lead\` text,
  	\`quiz_step_label\` text NOT NULL,
  	\`quiz_back_label\` text NOT NULL,
  	\`quiz_next_label\` text NOT NULL,
  	\`quiz_finish_label\` text NOT NULL,
  	\`quiz_default_scenario\` text DEFAULT 'update' NOT NULL,
  	\`quiz_result_caption\` text NOT NULL,
  	\`quiz_result_term_label\` text NOT NULL,
  	\`quiz_result_next_label\` text NOT NULL,
  	\`quiz_result_disclaimer\` text NOT NULL,
  	\`quiz_transition_title\` text NOT NULL,
  	\`quiz_transition_term\` text NOT NULL,
  	\`quiz_transition_next\` text NOT NULL,
  	\`quiz_update_title\` text NOT NULL,
  	\`quiz_update_term\` text NOT NULL,
  	\`quiz_update_next\` text NOT NULL,
  	\`quiz_form_title\` text NOT NULL,
  	\`quiz_form_lead\` text NOT NULL,
  	\`quiz_form_submit_label\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`cases_page_filters_groups_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases_page_filters_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_page_filters_groups_options_order_idx\` ON \`cases_page_filters_groups_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_page_filters_groups_options_parent_id_idx\` ON \`cases_page_filters_groups_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_page_filters_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`key\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cases_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_page_filters_groups_order_idx\` ON \`cases_page_filters_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cases_page_filters_groups_parent_id_idx\` ON \`cases_page_filters_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cases_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`filters_enabled\` integer DEFAULT false,
  	\`filters_all_label\` text NOT NULL,
  	\`results_count_label\` text NOT NULL,
  	\`results_count_one_label\` text NOT NULL,
  	\`results_empty_count_label\` text NOT NULL,
  	\`results_reset_label\` text NOT NULL,
  	\`results_empty_title\` text NOT NULL,
  	\`results_empty_text\` text NOT NULL,
  	\`card_labels_before\` text NOT NULL,
  	\`card_labels_after\` text NOT NULL,
  	\`card_labels_task\` text NOT NULL,
  	\`card_labels_done\` text NOT NULL,
  	\`card_labels_read\` text NOT NULL,
  	\`case_page_company_label\` text NOT NULL,
  	\`case_page_industry_label\` text NOT NULL,
  	\`case_page_configuration_label\` text NOT NULL,
  	\`case_page_term_label\` text NOT NULL,
  	\`case_page_table_label\` text NOT NULL,
  	\`case_page_before_label\` text NOT NULL,
  	\`case_page_after_label\` text NOT NULL,
  	\`case_page_task_title\` text NOT NULL,
  	\`case_page_solution_title\` text NOT NULL,
  	\`case_page_result_title\` text NOT NULL,
  	\`case_page_tags_label\` text NOT NULL,
  	\`case_page_all_label\` text NOT NULL,
  	\`case_page_next_caption\` text NOT NULL,
  	\`case_page_next_button\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`cases_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`cases_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`cases_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cases_id\`) REFERENCES \`cases\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cases_page_rels_order_idx\` ON \`cases_page_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`cases_page_rels_parent_idx\` ON \`cases_page_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cases_page_rels_path_idx\` ON \`cases_page_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`cases_page_rels_cases_id_idx\` ON \`cases_page_rels\` (\`cases_id\`);`)
  await db.run(sql`CREATE TABLE \`about_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_stats_order_idx\` ON \`about_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_stats_parent_id_idx\` ON \`about_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_status_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_status_items_order_idx\` ON \`about_status_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_status_items_parent_id_idx\` ON \`about_status_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_contacts_requisites\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_contacts_requisites_order_idx\` ON \`about_contacts_requisites\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_contacts_requisites_parent_id_idx\` ON \`about_contacts_requisites\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_breadcrumb\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_lead\` text,
  	\`team_title\` text NOT NULL,
  	\`team_lead\` text,
  	\`status_title\` text NOT NULL,
  	\`reviews_title\` text NOT NULL,
  	\`reviews_lead\` text,
  	\`contacts_title\` text NOT NULL,
  	\`contacts_phone_label\` text NOT NULL,
  	\`contacts_email_label\` text NOT NULL,
  	\`contacts_address_label\` text NOT NULL,
  	\`contacts_hours_label\` text NOT NULL,
  	\`contacts_hours_value\` text NOT NULL,
  	\`contacts_hours_caption\` text,
  	\`contacts_map_title\` text NOT NULL,
  	\`contacts_map_link_label\` text NOT NULL,
  	\`contacts_map_url\` text NOT NULL,
  	\`contacts_map_widget_url\` text NOT NULL,
  	\`contacts_map_note\` text NOT NULL,
  	\`contacts_map_button_label\` text NOT NULL,
  	\`contacts_requisites_title\` text NOT NULL,
  	\`contacts_legal_name_label\` text NOT NULL,
  	\`contacts_inn_label\` text NOT NULL,
  	\`contacts_ogrn_label\` text NOT NULL,
  	\`seo_meta_title\` text NOT NULL,
  	\`seo_meta_description\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`phone\` text DEFAULT '+7 831 413-06-67' NOT NULL,
  	\`phone_raw\` text,
  	\`email\` text DEFAULT 'info@pm52.ru' NOT NULL,
  	\`max_url\` text,
  	\`telegram_url\` text,
  	\`address\` text DEFAULT 'г. Нижний Новгород, Казанское ш., 12, этаж 3, кабинет 311' NOT NULL,
  	\`footer_tagline\` text DEFAULT 'ПРО-СОФТ: внедрение 1С, Нижний Новгород' NOT NULL,
  	\`legal_name\` text DEFAULT 'ООО «ПРО-СОФТ»' NOT NULL,
  	\`inn\` text DEFAULT '5260480157' NOT NULL,
  	\`ogrn\` text DEFAULT '1215200037128' NOT NULL,
  	\`accreditation\` text DEFAULT 'Аккредитованная ИТ-компания, реестр Минцифры России' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`lead_forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`diagnostics_title\` text DEFAULT 'Получить диагностику за 2 дня' NOT NULL,
  	\`diagnostics_lead\` text DEFAULT 'Перезвоним и договоримся о времени диагностики. Бесплатно, отчёт на руки.' NOT NULL,
  	\`diagnostics_comment\` text DEFAULT 'Хочу записаться на бесплатную диагностику 1С за 2 дня.',
  	\`diagnostics_success_text\` text DEFAULT 'Перезвоним в течение рабочего дня и договоримся о времени диагностики.' NOT NULL,
  	\`request_title\` text DEFAULT 'Оставить заявку' NOT NULL,
  	\`request_lead\` text DEFAULT 'Перезвоним в течение рабочего дня и ответим на вопросы.' NOT NULL,
  	\`request_comment\` text DEFAULT '',
  	\`request_success_text\` text DEFAULT 'Перезвоним в течение рабочего дня и ответим на вопросы.' NOT NULL,
  	\`submit_label\` text DEFAULT 'Отправить заявку' NOT NULL,
  	\`max_label\` text DEFAULT 'Отправить сообщение в MAX' NOT NULL,
  	\`telegram_label\` text DEFAULT 'Отправить сообщение в Telegram' NOT NULL,
  	\`message_intro\` text DEFAULT 'Здравствуйте! Пишу с сайта про-софт.рф.' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`cookie_banner\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version\` text DEFAULT '2026-11-06' NOT NULL,
  	\`text\` text DEFAULT 'Используем cookie для работы сайта, обезличенной аналитики и карты. Подробнее в' NOT NULL,
  	\`policy_label\` text DEFAULT 'политике обработки персональных данных' NOT NULL,
  	\`necessary_only_label\` text DEFAULT 'Только необходимые' NOT NULL,
  	\`accept_all_label\` text DEFAULT 'Принять все' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`cases_changes\`;`)
  await db.run(sql`DROP TABLE \`cases_results\`;`)
  await db.run(sql`DROP TABLE \`cases_tags\`;`)
  await db.run(sql`DROP TABLE \`cases\`;`)
  await db.run(sql`DROP TABLE \`publications_list\`;`)
  await db.run(sql`DROP TABLE \`publications\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`team_links\`;`)
  await db.run(sql`DROP TABLE \`team\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_list\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections\`;`)
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`home_hero_facts\`;`)
  await db.run(sql`DROP TABLE \`home_date_strip_rows\`;`)
  await db.run(sql`DROP TABLE \`home_date_strip_timeline\`;`)
  await db.run(sql`DROP TABLE \`home_diagnostics_deliverables\`;`)
  await db.run(sql`DROP TABLE \`home_pain_check_items\`;`)
  await db.run(sql`DROP TABLE \`home_services_items\`;`)
  await db.run(sql`DROP TABLE \`home_services_processes\`;`)
  await db.run(sql`DROP TABLE \`home_stages_table_steps\`;`)
  await db.run(sql`DROP TABLE \`home_faq_items\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`upp_date_strip_rows\`;`)
  await db.run(sql`DROP TABLE \`upp_date_strip_timeline\`;`)
  await db.run(sql`DROP TABLE \`upp_scenarios_items\`;`)
  await db.run(sql`DROP TABLE \`upp_erp_or_ka_questions\`;`)
  await db.run(sql`DROP TABLE \`upp_erp_or_ka_rows\`;`)
  await db.run(sql`DROP TABLE \`upp_transition_table_steps\`;`)
  await db.run(sql`DROP TABLE \`upp_proof_timecodes\`;`)
  await db.run(sql`DROP TABLE \`upp_faq_items\`;`)
  await db.run(sql`DROP TABLE \`upp\`;`)
  await db.run(sql`DROP TABLE \`upp_rels\`;`)
  await db.run(sql`DROP TABLE \`erp_erp_or_ka_questions\`;`)
  await db.run(sql`DROP TABLE \`erp_erp_or_ka_rows\`;`)
  await db.run(sql`DROP TABLE \`erp_map_integrations\`;`)
  await db.run(sql`DROP TABLE \`erp_map_nodes\`;`)
  await db.run(sql`DROP TABLE \`erp_stages_table_steps\`;`)
  await db.run(sql`DROP TABLE \`erp_faq_items\`;`)
  await db.run(sql`DROP TABLE \`erp\`;`)
  await db.run(sql`DROP TABLE \`erp_rels\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_work_items\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_integrations_items\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_checks\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_title_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_title_page_spec\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_title_page_totals\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_findings_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_findings_page_rows\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_plan_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_plan_page_stages\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_audit_sample_plan_page_rows\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_format_principles\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_format_table_steps\`;`)
  await db.run(sql`DROP TABLE \`dorabotka\`;`)
  await db.run(sql`DROP TABLE \`dorabotka_rels\`;`)
  await db.run(sql`DROP TABLE \`support_included_items\`;`)
  await db.run(sql`DROP TABLE \`support_sla_rows\`;`)
  await db.run(sql`DROP TABLE \`support_handover_table_steps\`;`)
  await db.run(sql`DROP TABLE \`support\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_checks_items\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_title_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_title_page_spec\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_title_page_totals\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_findings_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_findings_page_rows\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_plan_page_tab_items\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_plan_page_stages\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_report_sample_plan_page_rows\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_quiz_questions_options\`;`)
  await db.run(sql`DROP TABLE \`diagnostics_quiz_questions\`;`)
  await db.run(sql`DROP TABLE \`diagnostics\`;`)
  await db.run(sql`DROP TABLE \`cases_page_filters_groups_options\`;`)
  await db.run(sql`DROP TABLE \`cases_page_filters_groups\`;`)
  await db.run(sql`DROP TABLE \`cases_page\`;`)
  await db.run(sql`DROP TABLE \`cases_page_rels\`;`)
  await db.run(sql`DROP TABLE \`about_stats\`;`)
  await db.run(sql`DROP TABLE \`about_status_items\`;`)
  await db.run(sql`DROP TABLE \`about_contacts_requisites\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`lead_forms\`;`)
  await db.run(sql`DROP TABLE \`cookie_banner\`;`)
}
