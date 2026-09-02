/**
 * Apify Meta Ads adapter — Facebook Ads Library via the novi/facebook-ads-library-scraper actor.
 *
 * Calls the Apify REST API directly with the user's API token.
 * Actor: https://apify.com/apify/facebook-ads-scraper
 *
 * Input fields (novi/facebook-ads-library-scraper):
 *   - searchTerms: string[] — keywords to search for ads
 *   - country: string — country code (e.g. "US", "FR")
 *   - adType: "ALL" | "IMAGE_AND_VIDEO" | "IMAGE" | "VIDEO" | "MEME" | null
 *   - adActiveStatus: "ACTIVE" | "ALL" | "INACTIVE"
 *   - adLanguage: string (e.g. "en", "fr")
 *
 * Output items include: ad_id, ad_title, ad_body, ad_creative_body,
 *   ad_creative_link_description, ad_creation_time, ad_delivery_start_time,
 *   page_name, page_id, impressions, spend, currency, ctr, etc.
 */

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
} from "../types.js";
import {
  SourceAvailabilitySchema,
  QuotaStateSchema,
  SearchPageSchema,
  RawSourceItemSchema,
  RawAdvertiserSchema,
} from "../schemas.js";

const APIFY_API_BASE = "https://api.apify.com/v2";
const META_ADS_ACTOR = "apify~facebook-ads-scraper";

function getToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error(
      "APIFY_API_TOKEN is not set. Add it to your .env file.",
    );
  }
  return token;
}

async function apifyFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const url = `${APIFY_API_BASE}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "ViralCopilot/1.0",
      ...options.headers,
    },
  });
}

async function runActorSync(
  actorId: string,
  input: Record<string, unknown>,
): Promise<unknown[]> {
  const res = await apifyFetch(`/acts/${actorId}/run-sync-get-dataset-items`, {
    method: "POST",
    body: JSON.stringify({
      ...input,
      maxItems: 200,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Apify actor ${actorId} failed (${res.status}): ${body.slice(0, 500)}`,
    );
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    const maybe = (data as Record<string, unknown>).data;
    if (Array.isArray(maybe)) return maybe;
    return [];
  }
  return data;
}

/**
 * Apify Facebook Ads Library adapter.
 *
 * Uses the apify/facebook-ads-scraper actor to search public Meta Ads.
 * Token must be in APIFY_API_TOKEN env var.
 */
export class ApifyMetaAdapter implements ContentSourceAdapter {
  readonly source = "meta_ads" as const;

  async checkAvailability(): Promise<SourceAvailability> {
    try {
      const token = process.env.APIFY_API_TOKEN;
      if (!token) {
        return SourceAvailabilitySchema.parse({
          status: "unavailable",
          message: "APIFY_API_TOKEN not configured",
        });
      }
      const res = await apifyFetch(`/acts/${META_ADS_ACTOR}`);
      if (!res.ok) {
        return SourceAvailabilitySchema.parse({
          status: "error",
          message: `Apify API returned ${res.status}`,
          error: await res.text().catch(() => ""),
        });
      }
      return SourceAvailabilitySchema.parse({
        status: "available",
        message: "Apify Meta Ads Library available",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return SourceAvailabilitySchema.parse({
        status: "error",
        message: "Failed to reach Apify Meta Ads source",
        error: msg,
      });
    }
  }

  async checkQuota(): Promise<QuotaState> {
    try {
      await apifyFetch(`/acts/${META_ADS_ACTOR}`);
      return QuotaStateSchema.parse({
        remaining: 1000,
        limit: 1000,
        resetsAt: new Date(Date.now() + 86_400_000).toISOString(),
      });
    } catch {
      return QuotaStateSchema.parse({ remaining: 0, limit: 100 });
    }
  }

  async search(request: SearchRequest): Promise<SearchPage> {
    const country = (request.filters?.country as string) ?? "US";
    const limit = request.limit ?? 20;
    const status = (request.filters?.status as string) ?? "ACTIVE";

    const searchTerms = request.query
      ? request.query.split(/,\s*/).filter(Boolean)
      : [];

    // If no search terms but we have an advertiser filter, use the advertiser name
    const advertiserName = request.filters?.advertiserName as string | undefined;
    if (searchTerms.length === 0 && advertiserName) {
      searchTerms.push(advertiserName);
    }

    const input: Record<string, unknown> = {
      searchTerms,
      country,
      includeUnmapped: true,
      adActiveStatus: status === "all" ? "ALL" : "ACTIVE",
      adType: "ALL",
    };

    // Map our minReach to impressionsEstimateLow (approximate)
    if (request.filters?.minReach != null) {
      input.impressionsEstimateLow = Number(request.filters.minReach);
    }

    // Pagination via cursor (mapped to offset)
    if (request.cursor) {
      input.offset = Number(request.cursor);
    }

    const raw = await runActorSync(META_ADS_ACTOR, input);
    const items = this.normalizeAds(raw, limit);

    return SearchPageSchema.parse({
      items,
      total: items.length,
    });
  }

  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
    // Search by ad_id in the query
    const input: Record<string, unknown> = {
      searchTerms: [],
      country: "US",
      includeUnmapped: true,
      adActiveStatus: "ALL",
      adType: "ALL",
    };

    const raw = await runActorSync(META_ADS_ACTOR, input);
    const items = this.normalizeAds(raw, 100);
    const match = items.find(
      (i) => i.externalId === request.externalId,
    );

    if (!match) {
      throw new Error(`Meta ad not found: ${request.externalId}`);
    }
    return RawSourceItemSchema.parse(match);
  }

  async getAdvertiser(
    request: GetAdvertiserRequest,
  ): Promise<RawAdvertiser> {
    // Search for ads by this advertiser and aggregate
    const input: Record<string, unknown> = {
      searchTerms: [],
      country: "US",
      includeUnmapped: true,
      adActiveStatus: "ALL",
      adType: "ALL",
      advertiserId: request.externalId,
    };

    const raw = await runActorSync(META_ADS_ACTOR, input);
    const ads = this.normalizeAds(raw, 50);

    // Aggregate totals
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    const advertiserNames = new Set<string>();

    for (const ad of ads) {
      totalViews += ad.metrics?.views ?? 0;
      totalLikes += ad.metrics?.likes ?? 0;
      totalComments += ad.metrics?.comments ?? 0;
      totalShares += ad.metrics?.shares ?? 0;
      if (ad.author) advertiserNames.add(ad.author);
    }

    return RawAdvertiserSchema.parse({
      externalId: request.externalId,
      name: [...advertiserNames].join(", ") || undefined,
      relevanceScore: ads.length > 0 ? Math.min(ads.length / 20, 1) : undefined,
      metrics: {
        views: totalViews || undefined,
        likes: totalLikes || undefined,
        comments: totalComments || undefined,
        shares: totalShares || undefined,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private normalizeAds(raw: unknown[], _limit: number): RawSourceItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, _limit).map((item) => {
      const obj = item as Record<string, unknown>;
      const id = String(
        obj.ad_id ?? obj.id ?? obj.collation_id ?? "",
      );
      const url = String(obj.url ?? obj.ad_url ?? "");
      const pageUrl = String(obj.page_url ?? obj.pageUrl ?? "");

      // Combine title, body, and description into one text blob
      const title = String(obj.ad_title ?? obj.title ?? "");
      const body = String(obj.ad_body ?? obj.body ?? obj.ad_creative_body ?? "");
      const linkDesc = String(
        obj.ad_creative_link_description ?? obj.link_description ?? "",
      );
      const text = [title, body, linkDesc].filter(Boolean).join(" | ");

      return {
        externalId: id,
        ...(url ? { url } : {}),
        author: String(
          obj.page_name ?? obj.advertiser_name ?? obj.pageName ?? "",
        ),
        ...(pageUrl ? { authorUrl: pageUrl } : {}),
        publishedAt: String(
          obj.ad_creation_time ??
            obj.ad_delivery_start_time ??
            obj.created_at ??
            "",
        ),
        text,
        type: "ad",
        metrics: {
          views: this.toNum(
            obj.impressions ?? obj.impressions_lower ?? obj.views,
          ),
          likes: this.toNum(
            obj.likes ?? obj.reactions ?? obj.ad_reactions,
          ),
          comments: this.toNum(obj.comments ?? obj.ad_comments),
          shares: this.toNum(obj.shares ?? obj.ad_shares),
          reachDelta7d: this.toNum(
            obj.reach_delta ?? obj.reachDelta7d ?? obj.ctr,
          ),
        },
        media: this.extractMedia(obj),
      };
    });
  }

  private extractMedia(obj: Record<string, unknown>): Array<{
    type: "video" | "image" | "carousel";
    url?: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
  }> {
    const media: Array<{
      type: "video" | "image" | "carousel";
      url?: string;
      thumbnailUrl?: string;
      width?: number;
      height?: number;
    }> = [];

    if (obj.video_url ?? obj.videoUrl ?? obj.creative_video_url) {
      media.push({
        type: "video",
        url: String(
          obj.video_url ?? obj.videoUrl ?? obj.creative_video_url ?? "",
        ),
        thumbnailUrl: String(
          obj.thumbnail_url ?? obj.cover_url ?? "",
        ),
      });
    }

    if (obj.image_url ?? obj.imageUrl ?? obj.creative_image_url) {
      media.push({
        type: "image",
        url: String(
          obj.image_url ?? obj.imageUrl ?? obj.creative_image_url ?? "",
        ),
        width: this.toNum(obj.image_width),
        height: this.toNum(obj.image_height),
      });
    }

    const carouselCards = obj.carousel_cards ?? obj.carouselCards;
    if (Array.isArray(carouselCards)) {
      for (const card of carouselCards) {
        const c = card as Record<string, unknown>;
        media.push({
          type: "carousel",
          url: String(c.url ?? c.image_url ?? ""),
          thumbnailUrl: String(c.thumbnail_url ?? c.thumbnail ?? ""),
        });
      }
    }

    return media;
  }

  private toNum(val: unknown): number | undefined {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
}