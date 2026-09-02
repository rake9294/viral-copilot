import { MCPClient, MCPClientError } from "@viral-copilot/mcp-client";
import {
  ContentSourceAdapter,
  SourceAvailability,
  QuotaState,
  SearchRequest,
  SearchPage,
  RawSourceItem,
  GetItemRequest,
  RawAdvertiser,
  GetAdvertiserRequest,
  SourceMediaItem,
} from "../types.js";
import {
  SourceAvailabilitySchema,
  QuotaStateSchema,
  SearchPageSchema,
  RawSourceItemSchema,
  RawAdvertiserSchema,
} from "../schemas.js";

/**
 * TrendTrack Meta Ads adapter.
 *
 * Wraps TrendTrack MCP tools:
 * - search_ads(sort_by, min_reach, keywords, status)
 * - scan_ad(collationId)
 * - brief_competitor(sections)
 * - find_similar_shops
 */
export class TrendTrackMetaAdapter implements ContentSourceAdapter {
  readonly source = "meta_ads" as const;
  private readonly client: MCPClient;

  constructor(client: MCPClient) {
    this.client = client;
  }

  async checkAvailability(): Promise<SourceAvailability> {
    try {
      const tools = await this.client.listTools();
      const hasSearch = tools.some((t) => t.name === "search_ads");
      return SourceAvailabilitySchema.parse({
        status: hasSearch ? "available" : "unavailable",
        message: hasSearch
          ? "TrendTrack Meta Ads tools available"
          : "search_ads tool not found",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return SourceAvailabilitySchema.parse({
        status: "error",
        message: "Failed to reach TrendTrack Meta Ads source",
        error: msg,
      });
    }
  }

  async checkQuota(): Promise<QuotaState> {
    try {
      await this.client.callTool("search_ads", {
        count: 1,
        keywords: [],
        status: "active",
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
    const params: Record<string, unknown> = {
      sort_by: "reachDelta7d",
      status: request.filters?.status ?? "active",
      keywords: request.query
        ? request.query.split(/\s+/).filter(Boolean)
        : [],
    };

    if (request.filters?.minReach != null) {
      params.min_reach = request.filters.minReach;
    }
    if (request.limit) {
      params.count = request.limit;
    }
    if (request.cursor) {
      params.cursor = request.cursor;
    }

    const result = await this.client.callTool("search_ads", params);
    const payload = this.extractJsonPayload(result);
    const items = this.normalizeAds(payload.items);

    return SearchPageSchema.parse({
      items,
      nextCursor: payload.nextCursor ?? payload.cursor,
      total: payload.total,
    });
  }

  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
    const result = await this.client.callTool("scan_ad", {
      collationId: request.externalId,
    });

    const payload = this.extractJsonPayload(result);
    const ad = payload.ad as Record<string, unknown> | undefined ?? payload;
    if (!ad || !ad.id) {
      throw new MCPClientError(
        404,
        `Meta ad not found: ${request.externalId}`,
      );
    }

    return RawSourceItemSchema.parse({
      externalId: String(ad.id),
      ...(ad.url ?? ad.ad_url ? { url: String(ad.url ?? ad.ad_url) } : {}),
      author: String(ad.advertiser_name ?? ad.advertiser ?? ""),
      text: String(ad.text ?? ad.body ?? ad.primary_text ?? ""),
      type: "ad",
      publishedAt: String(ad.publishedAt ?? ad.start_time ?? ""),
      metrics: {
        views: Number(ad.views ?? 0) || undefined,
        likes: Number(ad.likes ?? 0) || undefined,
        comments: Number(ad.comments ?? 0) || undefined,
        shares: Number(ad.shares ?? 0) || undefined,
        reachDelta7d:
          Number(ad.reachDelta7d ?? ad.reach_delta ?? 0) || undefined,
      },
      media: this.extractMedia(ad),
    });
  }

  /**
   * Fetch advertiser / brand profile — Meta Ads only.
   */
  async getAdvertiser(request: GetAdvertiserRequest): Promise<RawAdvertiser> {
    const [briefResult, similarResult] = await Promise.all([
      this.client.callTool("brief_competitor", {
        sections: ["products", "ads"],
        advertiserId: request.externalId,
      }),
      this.client
        .callTool("find_similar_shops", {
          advertiserId: request.externalId,
        })
        .catch(() => null),
    ]);

    const brief = this.extractJsonPayload(briefResult);
    const _similar = similarResult
      ? this.extractJsonPayload(similarResult)
      : undefined;

    return RawAdvertiserSchema.parse({
      externalId: String(
        brief.id ?? brief.advertiser_id ?? request.externalId,
      ),
      name: String(brief.name ?? brief.advertiser_name ?? ""),
      ...(brief.url ?? brief.advertiser_url
        ? { url: String(brief.url ?? brief.advertiser_url) }
        : {}),
      ...(brief.shop_url ?? brief.store_url
        ? { shopUrl: String(brief.shop_url ?? brief.store_url) }
        : {}),
      relevanceScore: typeof brief.score === "number" ? brief.score : undefined,
      metrics: {
        views: Number(brief.total_views ?? brief.views ?? 0) || undefined,
        likes: Number(brief.total_likes ?? brief.likes ?? 0) || undefined,
        comments:
          Number(brief.total_comments ?? brief.comments ?? 0) || undefined,
        shares:
          Number(brief.total_shares ?? brief.shares ?? 0) || undefined,
      },
    });
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

  private normalizeAds(raw: unknown): RawSourceItem[] {
    if (!Array.isArray(raw)) return [];
    return (raw as Record<string, unknown>[]).map((obj) => {
      const url = String(obj.url ?? obj.ad_url ?? "");
      const authorUrl = String(obj.advertiser_url ?? "");
      return {
        externalId: String(
          obj.id ?? obj.ad_id ?? obj.collation_id ?? "",
        ),
        ...(url ? { url } : {}),
        author: String(obj.advertiser_name ?? obj.advertiser ?? ""),
        ...(authorUrl ? { authorUrl } : {}),
        text: String(
          obj.text ?? obj.body ?? obj.primary_text ?? obj.headline ?? "",
        ),
        type: "ad",
        publishedAt: String(
          obj.publishedAt ?? obj.start_time ?? obj.created_at ?? "",
        ),
        metrics: {
          views: Number(obj.views ?? 0) || undefined,
          likes: Number(obj.likes ?? 0) || undefined,
          comments: Number(obj.comments ?? 0) || undefined,
          shares: Number(obj.shares ?? 0) || undefined,
          reachDelta7d:
            Number(obj.reachDelta7d ?? obj.reach_delta ?? 0) || undefined,
        },
        media: this.extractMedia(obj),
      };
    });
  }

  private extractMedia(obj: Record<string, unknown>): SourceMediaItem[] {
    const media: SourceMediaItem[] = [];
    if (obj.videoUrl ?? obj.video_url ?? obj.video_id) {
      media.push({
        type: "video",
        url: String(obj.videoUrl ?? obj.video_url ?? ""),
        thumbnailUrl: String(
          obj.thumbnailUrl ?? obj.thumbnail_url ?? obj.cover_url ?? "",
        ),
        durationMs:
          Number(obj.duration ?? obj.video_duration_ms ?? 0) || undefined,
      });
    }
    if (obj.imageUrl ?? obj.image_url ?? obj.image) {
      media.push({
        type: "image",
        url: String(obj.imageUrl ?? obj.image_url ?? obj.image ?? ""),
        width: Number(obj.image_width ?? 0) || undefined,
        height: Number(obj.image_height ?? 0) || undefined,
      });
    }
    if (obj.carouselCards ?? obj.carousel_items) {
      const cards = (obj.carouselCards ?? obj.carousel_items ?? []) as Array<
        Record<string, unknown>
      >;
      for (const card of cards) {
        media.push({
          type: "carousel",
          url: String(card.url ?? card.image_url ?? ""),
          thumbnailUrl: String(card.thumbnailUrl ?? card.thumbnail_url ?? ""),
        });
      }
    }
    return media;
  }
}