// ── Schema (tables + types) ──────────────────────────────────────────────────
export {
  vector,
  workspaces,
  users,
  workspaceMembers,
  nicheProfiles,
  sourceConnections,
  sourceQueries,
  sourceItems,
  metricSnapshots,
  contentFeatures,
  scoreSnapshots,
  patternClusters,
  patternMembers,
  evidenceRefs,
  opportunities,
  opportunityEvidence,
  creativeDrafts,
  workflowRuns,
  agentSteps,
  humanFeedback,
  brandRules,
  publishedOutcomes,
} from "./schema.js";

export type {
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";

// ── Relations ─────────────────────────────────────────────────────────────────
export {
  workspacesRelations,
  usersRelations,
  workspaceMembersRelations,
  nicheProfilesRelations,
  sourceConnectionsRelations,
  sourceQueriesRelations,
  sourceItemsRelations,
  metricSnapshotsRelations,
  contentFeaturesRelations,
  scoreSnapshotsRelations,
  patternClustersRelations,
  patternMembersRelations,
  evidenceRefsRelations,
  opportunitiesRelations,
  opportunityEvidenceRelations,
  creativeDraftsRelations,
  workflowRunsRelations,
  agentStepsRelations,
  humanFeedbackRelations,
  brandRulesRelations,
  publishedOutcomesRelations,
} from "./relations.js";

// ── DB Client ─────────────────────────────────────────────────────────────────
export { createDbClient, getDbClient, type DbClient } from "./db.js";