import { z } from "zod";

// ── Matched existing item ────────────────────────────────────────────────────

export const SimilarityMatchSchema = z.object({
  url: z.string().optional(),
  externalId: z.string().optional(),
  similarity: z.number().min(0).max(1),
  overlapReason: z.string().min(1),
});

export type SimilarityMatch = z.infer<typeof SimilarityMatchSchema>;

// ── Full similarity report ───────────────────────────────────────────────────

export const SimilarityReportSchema = z.object({
  checked: z.boolean(),
  existingItems: z.array(SimilarityMatchSchema).optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  summary: z.string().optional(),
});

export type SimilarityReport = z.infer<typeof SimilarityReportSchema>;