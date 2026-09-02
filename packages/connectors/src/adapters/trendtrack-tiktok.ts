import { MCPClient, MCPClientError } from "@viral-copilot/mcp-client";
import {
  ContentSourceAdapter,
  SourceAvailability,
  QuotaState,
  SearchRequest,
  SearchPage,
  RawSourceItem,
  GetItemRequest,
} from "../types.js";
import {
  SourceAvailabilitySchema,
  QuotaStateSchema,
  SearchPageSchema,
  RawSourceItemSchema,
} from "../schemas.js";

/**
 * TrendTrack TikTok adapter — organic content and ad library search.
 *
 * Wraps the TrendTrack MCP tools:
 * - search_tiktok_library(type='organic') — trending organic content
 * - search_tiktok_library(type='ad') — ad library
 */
export class TrendTrackTikTokAdapter implements ContentSourceAdapter {
  readonly source = "tiktok_organic" as const;
  private readonly client: MCPClient;
  private readonly defaultCountry: string;

  constructor(client: MCPClient, defaultCountry = "US") {
    this.client = client;
    this.defaultCountry = defaultCountry;
  }

  async checkAvailability(): Promise<SourceAvailability> {
    try {
      const tools = await this.client.listTools();
      const hasTool = tools.some((t) => t.name === "search_tiktok_library");
      return SourceAvailabilitySchema.parse({
        status: hasTool ? "available" : "unavailable",
        message: hasTool
          ? "TrendTrack TikTok tools available"
          : "search_tiktok_library tool not found",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return SourceAvailabilitySchema.parse({
        status: "error",
        message: "Failed to reach TrendTrack TikTok source",
        error: msg,
      });
    }
  }

  async checkQuota(): Promise<QuotaState> {
    try {
      await this.client.callTool("search_tiktok_library", {
        type: "organic",
        count: 1,
        country: this.defaultCountry,
        keywords: [],
      });
      return QuotaStateSchema.parse({
        remaining: 1000,
        limit: 1000,
        resetsAt: new Date(Date.now() + 86_400_000).toISOString(),
      });
    } catch (err) {
      if (err instanceof MCPClientError && err.code === 429) {
        return QuotaStateSchema.parse({ remaining: 0, limit: 1000 });
      }
      return QuotaStateSchema.parse({ remaining: 0, limit: 1000 });
    }
  }

  async search(request: SearchRequest): Promise<SearchPage> {
    const isAd = request.filters?.adType === "ad";
    const params: Record<string, unknown> = {
      type: isAd ? "ad" : "organic",
      sort_by: "views",
      country: request.filters?.country ?? this.defaultCountry,
      keywords: request.query
        ? request.query.split(/\s+/).filter(Boolean)
        : [],
    };

    if (request.limit) {
      params.count = request.limit;
    }
    if (request.cursor) {
      params.cursor = request.cursor;
    }

    const result = await this.client.callTool("search_tiktok_library", params);

    const payload = this.extractJsonPayload(result);
    const items = this.normalizeItems(payload.items);

    return SearchPageSchema.parse({
      items,
      nextCursor: payload.nextCursor ?? payload.cursor,
      total: payload.total,
    });
  }

  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
    const result = await this.client.callTool("search_tiktok_library", {
      type: "organic",
      count: 1,
      keywords: [],
      videoId: request.externalId,
    });

    const payload = this.extractJsonPayload(result);
    const items = this.normalizeItems(payload.items);
    if (items.length === 0) {
      throw new MCPClientError(
        404,
        `TikTok item not found: ${request.externalId}`,
      );
    }
    return RawSourceItemSchema.parse(items[0]!);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private extractJsonPayload(result: {
    content: Array<{ text?: string }>;
  }): Record<string, unknown> {
    for (const c of result.content) {
      if (c.text) {
        try {
          return JSON.parse(c.text) as Record<string, unknown>;
        } catch {
          // try next content item
        }
      }
    }
    return {};
  }

  private normalizeItems(raw: unknown): RawSourceItem[] {
    if (!Array.isArray(raw)) return [];
    return (raw as Record<string, unknown>[]).map((obj) => {
      const url = String(obj.url ?? obj.share_url ?? "");
      const authorUrl = String(obj.authorUrl ?? obj.author_url ?? "");
      return {
        externalId: String(obj.id ?? obj.video_id ?? ""),
        ...(url ? { url } : {}),
        author: String(obj.author ?? obj.creator ?? ""),
        ...(authorUrl ? { authorUrl } : {}),
        publishedAt: String(obj.publishedAt ?? obj.create_time ?? ""),
        text: String(obj.text ?? obj.desc ?? obj.title ?? ""),
        type: "video",
        metrics: {
          views: Number(obj.views ?? obj.play_count ?? 0) || undefined,
          likes: Number(obj.likes ?? obj.digg_count ?? 0) || undefined,
          comments:
            Number(obj.comments ?? obj.comment_count ?? 0) || undefined,
          shares: Number(obj.shares ?? obj.share_count ?? 0) || undefined,
        },
        media: [
          {
            type: "video" as const,
            url: String(obj.videoUrl ?? obj.video_url ?? ""),
            thumbnailUrl: String(
              obj.thumbnailUrl ?? obj.cover_url ?? obj.cover ?? "",
            ),
            durationMs:
              Number(obj.duration ?? obj.duration_ms ?? 0) || undefined,
          },
        ],
      };
    });
  }
}