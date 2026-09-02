/**
 * Apify TikTok adapter — organic content via the apify/tiktok-scraper actor.
 *
 * Calls the Apify REST API directly with the user's API token.
 * Actor: https://apify.com/apify/tiktok-scraper
 *
 * Input fields (apify/tiktok-scraper):
 *   - searchQueries: string[] — keywords to search
 *   - resultsLimit: number — max results per search
 *   - country: string — country code (e.g. "US", "FR")
 *   - proxyConfig: { useApifyProxy: boolean }
 *
 * Output items include: id, text, url, author, digg_count, comment_count,
 * play_count, share_count, video_url, cover_url, create_time, etc.
 */

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

const APIFY_API_BASE = "https://api.apify.com/v2";
const TIKTOK_ACTOR = "apify~tiktok-scraper";

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

/**
 * Run an Apify actor synchronously and return its dataset items.
 * Uses the /run-sync-get-dataset-items endpoint which blocks until the run finishes.
 */
async function runActorSync(
  actorId: string,
  input: Record<string, unknown>,
  timeoutSec = 120,
): Promise<unknown[]> {
  const res = await apifyFetch(`/acts/${actorId}/run-sync-get-dataset-items`, {
    method: "POST",
    body: JSON.stringify({
      ...input,
      timeout: timeoutSec,
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
    // Sometimes Apify wraps in { data: [...] }
    const maybe = (data as Record<string, unknown>).data;
    if (Array.isArray(maybe)) return maybe;
    return [];
  }
  return data;
}

/**
 * Apify TikTok adapter.
 *
 * Uses the apify/tiktok-scraper actor to search TikTok organic content.
 * Token must be in APIFY_API_TOKEN env var.
 */
export class ApifyTikTokAdapter implements ContentSourceAdapter {
  readonly source = "tiktok_organic" as const;
  private readonly defaultCountry: string;

  constructor(defaultCountry = "US") {
    this.defaultCountry = defaultCountry;
  }

  async checkAvailability(): Promise<SourceAvailability> {
    try {
      const token = process.env.APIFY_API_TOKEN;
      if (!token) {
        return SourceAvailabilitySchema.parse({
          status: "unavailable",
          message: "APIFY_API_TOKEN not configured",
        });
      }
      const res = await apifyFetch(`/acts/${TIKTOK_ACTOR}`);
      if (!res.ok) {
        return SourceAvailabilitySchema.parse({
          status: "error",
          message: `Apify API returned ${res.status}`,
          error: await res.text().catch(() => ""),
        });
      }
      return SourceAvailabilitySchema.parse({
        status: "available",
        message: "Apify TikTok scraper available",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return SourceAvailabilitySchema.parse({
        status: "error",
        message: "Failed to reach Apify TikTok source",
        error: msg,
      });
    }
  }

  async checkQuota(): Promise<QuotaState> {
    try {
      // Check the user's Apify account usage via the acts endpoint
      const res = await apifyFetch(`/acts/${TIKTOK_ACTOR}`);
      if (!res.ok) {
        return QuotaStateSchema.parse({ remaining: 0, limit: 100 });
      }
      // Apify is pay-as-you-go with credits, so we report a generous default
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
    const country = (request.filters?.country as string) ?? this.defaultCountry;
    const limit = request.limit ?? 20;

    const input: Record<string, unknown> = {
      searchQueries: request.query
        ? request.query.split(/,\s*/).filter(Boolean)
        : [],
      resultsLimit: Math.min(limit, 100),
      country,
      proxyConfig: { useApifyProxy: true },
    };

    // Support both organic and ad search
    if (request.filters?.adType === "ad") {
      // For ads, use the ad-specific search
      input.searchType = "ads";
    }

    const raw = await runActorSync(TIKTOK_ACTOR, input);
    const items = this.normalizeItems(raw);

    return SearchPageSchema.parse({
      items,
      total: items.length,
    });
  }

  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
    // For a single item, search with a narrow query
    const input: Record<string, unknown> = {
      searchQueries: [],
      resultsLimit: 1,
      videoId: request.externalId,
      proxyConfig: { useApifyProxy: true },
    };

    const raw = await runActorSync(TIKTOK_ACTOR, input);
    const items = this.normalizeItems(raw);

    if (items.length === 0) {
      throw new Error(`TikTok item not found: ${request.externalId}`);
    }
    return RawSourceItemSchema.parse(items[0]!);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private normalizeItems(raw: unknown[]): RawSourceItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      const obj = item as Record<string, unknown>;
      const id = String(obj.id ?? obj.video_id ?? "");
      const url = String(obj.url ?? obj.share_url ?? "");
      const authorUrl = String(obj.authorUrl ?? obj.author_url ?? "");
      const videoMeta = (obj.videoMeta ?? obj.video ?? {}) as Record<string, unknown>;
      return {
        externalId: id,
        ...(url ? { url } : {}),
        author: String(
          obj.author ??
            (obj.authorMeta as Record<string, unknown> | undefined)?.name ??
            obj.creator ??
            ""
        ),
        ...(authorUrl ? { authorUrl } : {}),
        publishedAt: String(
          obj.publishedAt ?? obj.create_time ?? obj.timestamp ?? "",
        ),
        text: String(
          obj.text ?? obj.desc ?? obj.description ?? obj.caption ?? "",
        ),
        type: "video",
        metrics: {
          views: this.toNum(obj.views ?? obj.play_count ?? obj.playCount),
          likes: this.toNum(obj.likes ?? obj.digg_count ?? obj.diggCount),
          comments: this.toNum(
            obj.comments ?? obj.comment_count ?? obj.commentCount,
          ),
          shares: this.toNum(obj.shares ?? obj.share_count ?? obj.shareCount),
        },
        media: [
          {
            type: "video" as const,
            url: String(
              obj.videoUrl ??
                obj.video_url ??
                String(videoMeta.url ?? ""),
            ),
            thumbnailUrl: String(
              obj.thumbnailUrl ??
                obj.cover_url ??
                obj.cover ??
                obj.thumbnail ??
                String(videoMeta.thumbnail_url ?? videoMeta.cover_url ?? ""),
            ),
            durationMs: this.toNum(
              obj.duration ?? obj.duration_ms ?? videoMeta.duration,
            ),
          },
        ],
      };
    });
  }

  private toNum(val: unknown): number | undefined {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
}