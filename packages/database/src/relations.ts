import { relations } from "drizzle-orm";
import {
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

// ── Workspaces ──────────────────────────────────────────────────────────────────
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  nicheProfiles: many(nicheProfiles),
  sourceConnections: many(sourceConnections),
  sourceItems: many(sourceItems),
  opportunities: many(opportunities),
  workflowRuns: many(workflowRuns),
  feedback: many(humanFeedback),
  brandRules: many(brandRules),
}));

// ── Users ───────────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(workspaceMembers),
}));

// ── Workspace Members ───────────────────────────────────────────────────────────
export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

// ── Niche Profiles ──────────────────────────────────────────────────────────────
export const nicheProfilesRelations = relations(nicheProfiles, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [nicheProfiles.workspaceId],
    references: [workspaces.id],
  }),
  queries: many(sourceQueries),
  scoreSnapshots: many(scoreSnapshots),
  patternClusters: many(patternClusters),
  opportunities: many(opportunities),
  workflowRuns: many(workflowRuns),
  brandRules: many(brandRules),
}));

// ── Source Connections ──────────────────────────────────────────────────────────
export const sourceConnectionsRelations = relations(sourceConnections, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [sourceConnections.workspaceId],
    references: [workspaces.id],
  }),
}));

// ── Source Queries ──────────────────────────────────────────────────────────────
export const sourceQueriesRelations = relations(sourceQueries, ({ one }) => ({
  nicheProfile: one(nicheProfiles, {
    fields: [sourceQueries.nicheProfileId],
    references: [nicheProfiles.id],
  }),
}));

// ── Source Items ────────────────────────────────────────────────────────────────
export const sourceItemsRelations = relations(sourceItems, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [sourceItems.workspaceId],
    references: [workspaces.id],
  }),
  metricSnapshots: many(metricSnapshots),
  contentFeatures: many(contentFeatures),
  scoreSnapshots: many(scoreSnapshots),
  patternMemberships: many(patternMembers),
  evidenceRefs: many(evidenceRefs),
}));

// ── Metric Snapshots ────────────────────────────────────────────────────────────
export const metricSnapshotsRelations = relations(metricSnapshots, ({ one, many }) => ({
  sourceItem: one(sourceItems, {
    fields: [metricSnapshots.sourceItemId],
    references: [sourceItems.id],
  }),
  evidenceRefs: many(evidenceRefs),
}));

// ── Content Features ────────────────────────────────────────────────────────────
export const contentFeaturesRelations = relations(contentFeatures, ({ one, many }) => ({
  sourceItem: one(sourceItems, {
    fields: [contentFeatures.sourceItemId],
    references: [sourceItems.id],
  }),
  evidenceRefs: many(evidenceRefs),
}));

// ── Score Snapshots ─────────────────────────────────────────────────────────────
export const scoreSnapshotsRelations = relations(scoreSnapshots, ({ one }) => ({
  sourceItem: one(sourceItems, {
    fields: [scoreSnapshots.sourceItemId],
    references: [sourceItems.id],
  }),
  nicheProfile: one(nicheProfiles, {
    fields: [scoreSnapshots.nicheProfileId],
    references: [nicheProfiles.id],
  }),
}));

// ── Pattern Clusters ────────────────────────────────────────────────────────────
export const patternClustersRelations = relations(patternClusters, ({ one, many }) => ({
  nicheProfile: one(nicheProfiles, {
    fields: [patternClusters.nicheProfileId],
    references: [nicheProfiles.id],
  }),
  members: many(patternMembers),
  opportunities: many(opportunities),
}));

// ── Pattern Members ─────────────────────────────────────────────────────────────
export const patternMembersRelations = relations(patternMembers, ({ one }) => ({
  patternCluster: one(patternClusters, {
    fields: [patternMembers.patternClusterId],
    references: [patternClusters.id],
  }),
  sourceItem: one(sourceItems, {
    fields: [patternMembers.sourceItemId],
    references: [sourceItems.id],
  }),
}));

// ── Evidence Refs ───────────────────────────────────────────────────────────────
export const evidenceRefsRelations = relations(evidenceRefs, ({ one, many }) => ({
  sourceItem: one(sourceItems, {
    fields: [evidenceRefs.sourceItemId],
    references: [sourceItems.id],
  }),
  metricSnapshot: one(metricSnapshots, {
    fields: [evidenceRefs.metricSnapshotId],
    references: [metricSnapshots.id],
  }),
  contentFeature: one(contentFeatures, {
    fields: [evidenceRefs.contentFeatureId],
    references: [contentFeatures.id],
  }),
  opportunityLinks: many(opportunityEvidence),
}));

// ── Opportunities ───────────────────────────────────────────────────────────────
export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [opportunities.workspaceId],
    references: [workspaces.id],
  }),
  nicheProfile: one(nicheProfiles, {
    fields: [opportunities.nicheProfileId],
    references: [nicheProfiles.id],
  }),
  patternCluster: one(patternClusters, {
    fields: [opportunities.patternClusterId],
    references: [patternClusters.id],
  }),
  evidenceLinks: many(opportunityEvidence),
  creativeDrafts: many(creativeDrafts),
}));

// ── Opportunity Evidence ────────────────────────────────────────────────────────
export const opportunityEvidenceRelations = relations(opportunityEvidence, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [opportunityEvidence.opportunityId],
    references: [opportunities.id],
  }),
  evidenceRef: one(evidenceRefs, {
    fields: [opportunityEvidence.evidenceRefId],
    references: [evidenceRefs.id],
  }),
}));

// ── Creative Drafts ─────────────────────────────────────────────────────────────
export const creativeDraftsRelations = relations(creativeDrafts, ({ one, many }) => ({
  opportunity: one(opportunities, {
    fields: [creativeDrafts.opportunityId],
    references: [opportunities.id],
  }),
  publishedOutcomes: many(publishedOutcomes),
}));

// ── Workflow Runs ───────────────────────────────────────────────────────────────
export const workflowRunsRelations = relations(workflowRuns, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [workflowRuns.workspaceId],
    references: [workspaces.id],
  }),
  nicheProfile: one(nicheProfiles, {
    fields: [workflowRuns.nicheProfileId],
    references: [nicheProfiles.id],
  }),
  agentSteps: many(agentSteps),
}));

// ── Agent Steps ─────────────────────────────────────────────────────────────────
export const agentStepsRelations = relations(agentSteps, ({ one }) => ({
  workflowRun: one(workflowRuns, {
    fields: [agentSteps.workflowRunId],
    references: [workflowRuns.id],
  }),
}));

// ── Human Feedback ──────────────────────────────────────────────────────────────
export const humanFeedbackRelations = relations(humanFeedback, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [humanFeedback.workspaceId],
    references: [workspaces.id],
  }),
}));

// ── Brand Rules ─────────────────────────────────────────────────────────────────
export const brandRulesRelations = relations(brandRules, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [brandRules.workspaceId],
    references: [workspaces.id],
  }),
  nicheProfile: one(nicheProfiles, {
    fields: [brandRules.nicheProfileId],
    references: [nicheProfiles.id],
  }),
}));

// ── Published Outcomes ──────────────────────────────────────────────────────────
export const publishedOutcomesRelations = relations(publishedOutcomes, ({ one }) => ({
  creativeDraft: one(creativeDrafts, {
    fields: [publishedOutcomes.creativeDraftId],
    references: [creativeDrafts.id],
  }),
}));