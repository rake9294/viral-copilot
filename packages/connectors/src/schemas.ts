import { z } from "zod";

// ---------------------------------------------------------------------------
// SourceAvailability
// ---------------------------------------------------------------------------

export const SourceAvailabilitySchema = z.object({
  status: z.enum(["available", "unavailable", "error"]),
  message: z.string(),
  error: z.string().optional(),
});

// ---------------------------------------------------------------------------
// QuotaState
// ---------------------------------------------------------------------------

export const QuotaStateSchema = z.object({
  remaining: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  resetsAt: z.string().optional(),
});

// ---------------------------------------------------------------------------
// SearchRequest
// ---------------------------------------------------------------------------

export const SearchRequestSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
  limit: z.number().int().positive().max(200).optional(),
  cursor: z.string().optional(),
});

// ---------------------------------------------------------------------------
// SourceMetrics
// ---------------------------------------------------------------------------

export const SourceMetricsSchema = z.object({
  views: z.number().int().nonnegative().optional(),
  likes: z.number().int().nonnegative().optional(),
  comments: z.number().int().nonnegative().optional(),
  shares: z.number().int().nonnegative().optional(),
  reachDelta7d: z.number().int().optional(),
});

// ---------------------------------------------------------------------------
// SourceMediaItem
// ---------------------------------------------------------------------------

export const SourceMediaItemSchema = z.object({
  type: z.enum(["video", "image", "carousel"]),
  url: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  width: z.number().int().nonnegative().optional(),
  height: z.number().int().nonnegative().optional(),
});

// ---------------------------------------------------------------------------
// RawSourceItem
// ---------------------------------------------------------------------------

export const RawSourceItemSchema = z.object({
  externalId: z.string().min(1),
  url: z.string().url().optional(),
  author: z.string().optional(),
  authorUrl: z.string().url().optional(),
  publishedAt: z.string().optional(),
  metrics: SourceMetricsSchema.optional(),
  media: z.array(SourceMediaItemSchema).optional(),
  text: z.string().optional(),
  type: z.string().optional(),
});

// ---------------------------------------------------------------------------
// SearchPage
// ---------------------------------------------------------------------------

export const SearchPageSchema = z.object({
  items: z.array(RawSourceItemSchema),
  nextCursor: z.string().optional(),
  total: z.number().int().nonnegative().optional(),
});

// ---------------------------------------------------------------------------
// GetItemRequest
// ---------------------------------------------------------------------------

export const GetItemRequestSchema = z.object({
  externalId: z.string().min(1),
});

// ---------------------------------------------------------------------------
// RawAdvertiser
// ---------------------------------------------------------------------------

export const RawAdvertiserSchema = z.object({
  externalId: z.string().min(1),
  name: z.string().optional(),
  url: z.string().url().optional(),
  shopUrl: z.string().url().optional(),
  relevanceScore: z.number().min(0).max(1).optional(),
  metrics: SourceMetricsSchema.optional(),
});

// ---------------------------------------------------------------------------
// GetAdvertiserRequest
// ---------------------------------------------------------------------------

export const GetAdvertiserRequestSchema = z.object({
  externalId: z.string().min(1),
});