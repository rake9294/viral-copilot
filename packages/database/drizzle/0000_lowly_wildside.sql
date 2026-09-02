CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "agent_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_run_id" uuid NOT NULL,
	"agent_name" text NOT NULL,
	"agent_version" text NOT NULL,
	"model_provider" text,
	"model_name" text,
	"prompt_version" text,
	"input_reference" text,
	"output_reference" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"latency_ms" integer,
	"token_usage_json" jsonb,
	"cost_amount" real,
	"error_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "brand_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"niche_profile_id" uuid,
	"rule_type" text NOT NULL,
	"rule_text" text NOT NULL,
	"source_feedback_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_item_id" uuid NOT NULL,
	"extractor_version" text NOT NULL,
	"hook_text" text,
	"hook_type" text,
	"format" text,
	"angle" text,
	"emotion" text,
	"proof_type" text,
	"cta_type" text,
	"visual_style_json" jsonb,
	"structure_json" jsonb,
	"transcript_reference" text,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creative_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"brand_memory_version" integer,
	"generator_version" text NOT NULL,
	"hooks_json" jsonb NOT NULL,
	"scripts_json" jsonb NOT NULL,
	"storyboard_json" jsonb NOT NULL,
	"production_brief_json" jsonb NOT NULL,
	"risk_notes_json" jsonb,
	"similarity_report_json" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_refs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_item_id" uuid NOT NULL,
	"metric_snapshot_id" uuid,
	"content_feature_id" uuid,
	"evidence_type" text NOT NULL,
	"excerpt" text,
	"source_url" text NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "human_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"decision" text NOT NULL,
	"reason_code" text,
	"comment" text,
	"edited_payload_json" jsonb,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_item_id" uuid NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"views" bigint,
	"likes" bigint,
	"comments" bigint,
	"shares" bigint,
	"saves" bigint,
	"followers" bigint,
	"reach_estimate" bigint,
	"days_running" integer,
	"active_status" text,
	"countries_json" jsonb,
	"metric_provenance_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "niche_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"language_code" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"input_json" jsonb NOT NULL,
	"niche_map_json" jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"niche_profile_id" uuid NOT NULL,
	"pattern_cluster_id" uuid,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"why_now" text,
	"transferable_mechanics_json" jsonb,
	"do_not_copy_json" jsonb,
	"saturation_band" text,
	"action_window_band" text,
	"confidence_band" text,
	"status" text DEFAULT 'identified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_evidence" (
	"opportunity_id" uuid NOT NULL,
	"evidence_ref_id" uuid NOT NULL,
	"claim_key" text NOT NULL,
	CONSTRAINT "opportunity_evidence_opportunity_id_evidence_ref_id_pk" PRIMARY KEY("opportunity_id","evidence_ref_id")
);
--> statement-breakpoint
CREATE TABLE "pattern_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_profile_id" uuid NOT NULL,
	"cluster_version" text NOT NULL,
	"label" text NOT NULL,
	"centroid_embedding" vector(1536),
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"independent_author_count" integer,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pattern_members" (
	"pattern_cluster_id" uuid NOT NULL,
	"source_item_id" uuid NOT NULL,
	"similarity" real,
	CONSTRAINT "pattern_members_pattern_cluster_id_source_item_id_pk" PRIMARY KEY("pattern_cluster_id","source_item_id")
);
--> statement-breakpoint
CREATE TABLE "published_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creative_draft_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"external_post_id" text,
	"published_at" timestamp with time zone,
	"metrics_json" jsonb,
	"business_outcomes_json" jsonb,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_item_id" uuid NOT NULL,
	"niche_profile_id" uuid NOT NULL,
	"scoring_version" text NOT NULL,
	"cohort_definition_json" jsonb NOT NULL,
	"dimensions_json" jsonb NOT NULL,
	"composite_band" text NOT NULL,
	"confidence_band" text NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"source_type" text NOT NULL,
	"credential_reference" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"rights_policy_json" jsonb,
	"last_checked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"external_id" text NOT NULL,
	"canonical_url" text NOT NULL,
	"author_external_id" text,
	"advertiser_external_id" text,
	"published_at" timestamp with time zone,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload_reference" text,
	"content_fingerprint" text,
	"rights_class" text,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "source_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_profile_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"query_text" text NOT NULL,
	"filters_json" jsonb,
	"query_hash" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflow_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"niche_profile_id" uuid NOT NULL,
	"workflow_version" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"input_hash" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"cost_json" jsonb,
	"coverage_json" jsonb,
	"error_summary_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mode" text DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "agent_steps" ADD CONSTRAINT "agent_steps_workflow_run_id_workflow_runs_id_fk" FOREIGN KEY ("workflow_run_id") REFERENCES "public"."workflow_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_rules" ADD CONSTRAINT "brand_rules_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_rules" ADD CONSTRAINT "brand_rules_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_features" ADD CONSTRAINT "content_features_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_drafts" ADD CONSTRAINT "creative_drafts_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_refs" ADD CONSTRAINT "evidence_refs_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_refs" ADD CONSTRAINT "evidence_refs_metric_snapshot_id_metric_snapshots_id_fk" FOREIGN KEY ("metric_snapshot_id") REFERENCES "public"."metric_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_refs" ADD CONSTRAINT "evidence_refs_content_feature_id_content_features_id_fk" FOREIGN KEY ("content_feature_id") REFERENCES "public"."content_features"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "human_feedback" ADD CONSTRAINT "human_feedback_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "niche_profiles" ADD CONSTRAINT "niche_profiles_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_pattern_cluster_id_pattern_clusters_id_fk" FOREIGN KEY ("pattern_cluster_id") REFERENCES "public"."pattern_clusters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_evidence" ADD CONSTRAINT "opportunity_evidence_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_evidence" ADD CONSTRAINT "opportunity_evidence_evidence_ref_id_evidence_refs_id_fk" FOREIGN KEY ("evidence_ref_id") REFERENCES "public"."evidence_refs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_clusters" ADD CONSTRAINT "pattern_clusters_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_members" ADD CONSTRAINT "pattern_members_pattern_cluster_id_pattern_clusters_id_fk" FOREIGN KEY ("pattern_cluster_id") REFERENCES "public"."pattern_clusters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_members" ADD CONSTRAINT "pattern_members_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "published_outcomes" ADD CONSTRAINT "published_outcomes_creative_draft_id_creative_drafts_id_fk" FOREIGN KEY ("creative_draft_id") REFERENCES "public"."creative_drafts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_connections" ADD CONSTRAINT "source_connections_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_items" ADD CONSTRAINT "source_items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_queries" ADD CONSTRAINT "source_queries_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_niche_profile_id_niche_profiles_id_fk" FOREIGN KEY ("niche_profile_id") REFERENCES "public"."niche_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agent_steps_workflow" ON "agent_steps" USING btree ("workflow_run_id");--> statement-breakpoint
CREATE INDEX "idx_brand_rules_workspace" ON "brand_rules" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_content_features_item" ON "content_features" USING btree ("source_item_id");--> statement-breakpoint
CREATE INDEX "idx_human_feedback_workspace" ON "human_feedback" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_human_feedback_entity" ON "human_feedback" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_metric_snapshots_captured_at" ON "metric_snapshots" USING btree ("captured_at");--> statement-breakpoint
CREATE INDEX "idx_metric_snapshots_item" ON "metric_snapshots" USING btree ("source_item_id");--> statement-breakpoint
CREATE INDEX "idx_opportunities_workspace" ON "opportunities" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_opportunities_niche" ON "opportunities" USING btree ("niche_profile_id");--> statement-breakpoint
CREATE INDEX "idx_opportunity_evidence_opp" ON "opportunity_evidence" USING btree ("opportunity_id");--> statement-breakpoint
CREATE INDEX "idx_pattern_clusters_niche" ON "pattern_clusters" USING btree ("niche_profile_id");--> statement-breakpoint
CREATE INDEX "idx_pattern_members_cluster" ON "pattern_members" USING btree ("pattern_cluster_id");--> statement-breakpoint
CREATE INDEX "idx_pattern_members_source_item" ON "pattern_members" USING btree ("source_item_id");--> statement-breakpoint
CREATE INDEX "idx_published_outcomes_draft" ON "published_outcomes" USING btree ("creative_draft_id");--> statement-breakpoint
CREATE INDEX "idx_published_outcomes_platform" ON "published_outcomes" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "idx_score_snapshots_item" ON "score_snapshots" USING btree ("source_item_id");--> statement-breakpoint
CREATE INDEX "idx_score_snapshots_niche" ON "score_snapshots" USING btree ("niche_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_source_items_type_external" ON "source_items" USING btree ("source_type","external_id");--> statement-breakpoint
CREATE INDEX "idx_source_items_type" ON "source_items" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "idx_workflow_runs_workspace_status" ON "workflow_runs" USING btree ("workspace_id","status");--> statement-breakpoint
CREATE INDEX "idx_workflow_runs_niche" ON "workflow_runs" USING btree ("niche_profile_id");