import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  bigint,
  real,
  uniqueIndex,
  index,
  primaryKey,
  customType,
} from "drizzle-orm/pg-core";

// ── pgvector custom type ──────────────────────────────────────────────────────
export const vector = customType<{
  data: Array<number>;
  driverData: string;
  config: { dimensions: number };
}>(
  {
    dataType(config) {
      return `vector(${config?.dimensions ?? 1536})`;
    },
    fromDriver(value: string): Array<number> {
      return JSON.parse(value.replace(/^\[|\]$/g, "["))
        .slice(1, -1)
        .split(",")
        .map(Number);
    },
    toDriver(value: Array<number>): string {
      return `[${value.join(",")}]`;
    },
  },
);

// ── Workspaces ────────────────────────────────────────────────────────────────
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  mode: text("mode", { enum: ["internal", "customer"] }).notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Workspace Members ─────────────────────────────────────────────────────────
export const workspaceMembers = pgTable("workspace_members", {
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
}, (table) => [
  primaryKey({ columns: [table.workspaceId, table.userId] }),
]);

// ── Niche Profiles ────────────────────────────────────────────────────────────
export const nicheProfiles = pgTable("niche_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  countryCode: text("country_code").notNull(),
  languageCode: text("language_code").notNull(),
  status: text("status").notNull().default("draft"),
  inputJson: jsonb("input_json").notNull(),
  nicheMapJson: jsonb("niche_map_json"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Source Connections ────────────────────────────────────────────────────────
export const sourceConnections = pgTable("source_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  sourceType: text("source_type").notNull(),
  credentialReference: text("credential_reference"),
  status: text("status").notNull().default("pending"),
  rightsPolicyJson: jsonb("rights_policy_json"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Source Queries ────────────────────────────────────────────────────────────
export const sourceQueries = pgTable("source_queries", {
  id: uuid("id").primaryKey().defaultRandom(),
  nicheProfileId: uuid("niche_profile_id")
    .notNull()
    .references(() => nicheProfiles.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(),
  queryText: text("query_text").notNull(),
  filtersJson: jsonb("filters_json"),
  queryHash: text("query_hash").notNull(),
  status: text("status").notNull().default("active"),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Source Items ──────────────────────────────────────────────────────────────
export const sourceItems = pgTable("source_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(),
  externalId: text("external_id").notNull(),
  canonicalUrl: text("canonical_url").notNull(),
  authorExternalId: text("author_external_id"),
  advertiserExternalId: text("advertiser_external_id"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  rawPayloadReference: text("raw_payload_reference"),
  contentFingerprint: text("content_fingerprint"),
  rightsClass: text("rights_class"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("uq_source_items_type_external").on(table.sourceType, table.externalId),
  index("idx_source_items_type").on(table.sourceType),
]);

// ── Metric Snapshots ─────────────────────────────────────────────────────────
export const metricSnapshots = pgTable("metric_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceItemId: uuid("source_item_id")
    .notNull()
    .references(() => sourceItems.id, { onDelete: "cascade" }),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
  views: bigint("views", { mode: "number" }),
  likes: bigint("likes", { mode: "number" }),
  comments: bigint("comments", { mode: "number" }),
  shares: bigint("shares", { mode: "number" }),
  saves: bigint("saves", { mode: "number" }),
  followers: bigint("followers", { mode: "number" }),
  reachEstimate: bigint("reach_estimate", { mode: "number" }),
  daysRunning: integer("days_running"),
  activeStatus: text("active_status"),
  countriesJson: jsonb("countries_json"),
  metricProvenanceJson: jsonb("metric_provenance_json").notNull(),
}, (table) => [
  index("idx_metric_snapshots_captured_at").on(table.capturedAt),
  index("idx_metric_snapshots_item").on(table.sourceItemId),
]);

// ── Content Features ──────────────────────────────────────────────────────────
export const contentFeatures = pgTable("content_features", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceItemId: uuid("source_item_id")
    .notNull()
    .references(() => sourceItems.id, { onDelete: "cascade" }),
  extractorVersion: text("extractor_version").notNull(),
  hookText: text("hook_text"),
  hookType: text("hook_type"),
  format: text("format"),
  angle: text("angle"),
  emotion: text("emotion"),
  proofType: text("proof_type"),
  ctaType: text("cta_type"),
  visualStyleJson: jsonb("visual_style_json"),
  structureJson: jsonb("structure_json"),
  transcriptReference: text("transcript_reference"),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_content_features_item").on(table.sourceItemId),
]);

// ── Score Snapshots ───────────────────────────────────────────────────────────
export const scoreSnapshots = pgTable("score_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceItemId: uuid("source_item_id")
    .notNull()
    .references(() => sourceItems.id, { onDelete: "cascade" }),
  nicheProfileId: uuid("niche_profile_id")
    .notNull()
    .references(() => nicheProfiles.id, { onDelete: "cascade" }),
  scoringVersion: text("scoring_version").notNull(),
  cohortDefinitionJson: jsonb("cohort_definition_json").notNull(),
  dimensionsJson: jsonb("dimensions_json").notNull(),
  compositeBand: text("composite_band").notNull(),
  confidenceBand: text("confidence_band").notNull(),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_score_snapshots_item").on(table.sourceItemId),
  index("idx_score_snapshots_niche").on(table.nicheProfileId),
]);

// ── Pattern Clusters ──────────────────────────────────────────────────────────
export const patternClusters = pgTable("pattern_clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  nicheProfileId: uuid("niche_profile_id")
    .notNull()
    .references(() => nicheProfiles.id, { onDelete: "cascade" }),
  clusterVersion: text("cluster_version").notNull(),
  label: text("label").notNull(),
  centroidEmbedding: vector("centroid_embedding", { dimensions: 1536 }),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  memberCount: integer("member_count").notNull().default(0),
  independentAuthorCount: integer("independent_author_count"),
  status: text("status").notNull().default("active"),
}, (table) => [
  index("idx_pattern_clusters_niche").on(table.nicheProfileId),
]);

// ── Pattern Members ───────────────────────────────────────────────────────────
export const patternMembers = pgTable("pattern_members", {
  patternClusterId: uuid("pattern_cluster_id")
    .notNull()
    .references(() => patternClusters.id, { onDelete: "cascade" }),
  sourceItemId: uuid("source_item_id")
    .notNull()
    .references(() => sourceItems.id, { onDelete: "cascade" }),
  similarity: real("similarity"),
}, (table) => [
  primaryKey({ columns: [table.patternClusterId, table.sourceItemId] }),
  index("idx_pattern_members_cluster").on(table.patternClusterId),
  index("idx_pattern_members_source_item").on(table.sourceItemId),
]);

// ── Evidence Refs ─────────────────────────────────────────────────────────────
export const evidenceRefs = pgTable("evidence_refs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceItemId: uuid("source_item_id")
    .notNull()
    .references(() => sourceItems.id, { onDelete: "cascade" }),
  metricSnapshotId: uuid("metric_snapshot_id")
    .references(() => metricSnapshots.id, { onDelete: "set null" }),
  contentFeatureId: uuid("content_feature_id")
    .references(() => contentFeatures.id, { onDelete: "set null" }),
  evidenceType: text("evidence_type").notNull(),
  excerpt: text("excerpt"),
  sourceUrl: text("source_url").notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Opportunities ─────────────────────────────────────────────────────────────
export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  nicheProfileId: uuid("niche_profile_id")
    .notNull()
    .references(() => nicheProfiles.id, { onDelete: "cascade" }),
  patternClusterId: uuid("pattern_cluster_id")
    .references(() => patternClusters.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  whyNow: text("why_now"),
  transferableMechanicsJson: jsonb("transferable_mechanics_json"),
  doNotCopyJson: jsonb("do_not_copy_json"),
  saturationBand: text("saturation_band"),
  actionWindowBand: text("action_window_band"),
  confidenceBand: text("confidence_band"),
  status: text("status").notNull().default("identified"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_opportunities_workspace").on(table.workspaceId),
  index("idx_opportunities_niche").on(table.nicheProfileId),
]);

// ── Opportunity Evidence ──────────────────────────────────────────────────────
export const opportunityEvidence = pgTable("opportunity_evidence", {
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  evidenceRefId: uuid("evidence_ref_id")
    .notNull()
    .references(() => evidenceRefs.id, { onDelete: "cascade" }),
  claimKey: text("claim_key").notNull(),
}, (table) => [
  primaryKey({ columns: [table.opportunityId, table.evidenceRefId] }),
  index("idx_opportunity_evidence_opp").on(table.opportunityId),
]);

// ── Creative Drafts ───────────────────────────────────────────────────────────
export const creativeDrafts = pgTable("creative_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  brandMemoryVersion: integer("brand_memory_version"),
  generatorVersion: text("generator_version").notNull(),
  hooksJson: jsonb("hooks_json").notNull(),
  scriptsJson: jsonb("scripts_json").notNull(),
  storyboardJson: jsonb("storyboard_json").notNull(),
  productionBriefJson: jsonb("production_brief_json").notNull(),
  riskNotesJson: jsonb("risk_notes_json"),
  similarityReportJson: jsonb("similarity_report_json"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Workflow Runs ─────────────────────────────────────────────────────────────
export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  nicheProfileId: uuid("niche_profile_id")
    .notNull()
    .references(() => nicheProfiles.id, { onDelete: "cascade" }),
  workflowVersion: text("workflow_version").notNull(),
  status: text("status").notNull().default("pending"),
  inputHash: text("input_hash"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  costJson: jsonb("cost_json"),
  coverageJson: jsonb("coverage_json"),
  errorSummaryJson: jsonb("error_summary_json"),
}, (table) => [
  index("idx_workflow_runs_workspace_status").on(table.workspaceId, table.status),
  index("idx_workflow_runs_niche").on(table.nicheProfileId),
]);

// ── Agent Steps ───────────────────────────────────────────────────────────────
export const agentSteps = pgTable("agent_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowRunId: uuid("workflow_run_id")
    .notNull()
    .references(() => workflowRuns.id, { onDelete: "cascade" }),
  agentName: text("agent_name").notNull(),
  agentVersion: text("agent_version").notNull(),
  modelProvider: text("model_provider"),
  modelName: text("model_name"),
  promptVersion: text("prompt_version"),
  inputReference: text("input_reference"),
  outputReference: text("output_reference"),
  status: text("status").notNull().default("pending"),
  latencyMs: integer("latency_ms"),
  tokenUsageJson: jsonb("token_usage_json"),
  costAmount: real("cost_amount"),
  errorJson: jsonb("error_json"),
}, (table) => [
  index("idx_agent_steps_workflow").on(table.workflowRunId),
]);

// ── Human Feedback ────────────────────────────────────────────────────────────
export const humanFeedback = pgTable("human_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  decision: text("decision").notNull(),
  reasonCode: text("reason_code"),
  comment: text("comment"),
  editedPayloadJson: jsonb("edited_payload_json"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_human_feedback_workspace").on(table.workspaceId),
  index("idx_human_feedback_entity").on(table.entityType, table.entityId),
]);

// ── Brand Rules ───────────────────────────────────────────────────────────────
export const brandRules = pgTable("brand_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  nicheProfileId: uuid("niche_profile_id")
    .references(() => nicheProfiles.id, { onDelete: "set null" }),
  ruleType: text("rule_type").notNull(),
  ruleText: text("rule_text").notNull(),
  sourceFeedbackId: text("source_feedback_id"),
  status: text("status").notNull().default("active"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_brand_rules_workspace").on(table.workspaceId),
]);

// ── Published Outcomes ────────────────────────────────────────────────────────
export const publishedOutcomes = pgTable("published_outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  creativeDraftId: uuid("creative_draft_id")
    .notNull()
    .references(() => creativeDrafts.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  externalPostId: text("external_post_id"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  metricsJson: jsonb("metrics_json"),
  businessOutcomesJson: jsonb("business_outcomes_json"),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_published_outcomes_draft").on(table.creativeDraftId),
  index("idx_published_outcomes_platform").on(table.platform),
]);