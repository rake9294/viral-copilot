/**
 * Apify TikTok adapter — organic content via the clockworks/tiktok-scraper actor.
 * Actor: https://apify.com/clockworks/tiktok-scraper
 * Pricing: $0.0037 per result (PAY_PER_EVENT)
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
const TIKTOK_ACTOR = "clockworks~tiktok-scraper";

function getToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not set");
  return token;
}

async function runActorSync(actorId: string, input: Record<string, unknown>): Promise<unknown[]> {
  const token = getToken();
  const res = await fetch(`${APIFY_API_BASE}/acts/${actorId}/run-sync-get-dataset-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}`, "User-Agent": "ViralCopilot/1.0" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify actor ${actorId} failed (${res.status})`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  const maybe = (data as Record<string, unknown>).data;
  return Array.isArray(maybe) ? maybe : [];
}

export class ApifyTikTokAdapter implements ContentSourceAdapter {
  readonly source = "tiktok_organic" as const;
  private readonly defaultCountry: string;
  constructor(defaultCountry = "US") { this.defaultCountry = defaultCountry; }

  async checkAvailability(): Promise<SourceAvailability> {
    try {
      if (!process.env.APIFY_API_TOKEN) return SourceAvailabilitySchema.parse({ status: "unavailable", message: "APIFY_API_TOKEN not configured" });
      const res = await fetch(`${APIFY_API_BASE}/acts/${TIKTOK_ACTOR}`, { headers: { Authorization: `Bearer ${getToken()}`, "User-Agent": "ViralCopilot/1.0" } });
      return SourceAvailabilitySchema.parse({ status: res.ok ? "available" : "error", message: res.ok ? "Apify TikTok scraper (clockworks) available" : `Apify API returned ${res.status}` });
    } catch (err) {
      return SourceAvailabilitySchema.parse({ status: "error", message: `Failed to reach Apify: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  async checkQuota(): Promise<QuotaState> {
    try {
      await fetch(`${APIFY_API_BASE}/acts/${TIKTOK_ACTOR}`, { headers: { Authorization: `Bearer ${getToken()}`, "User-Agent": "ViralCopilot/1.0" } });
      return QuotaStateSchema.parse({ remaining: 500, limit: 500, resetsAt: new Date(Date.now() + 86_400_000).toISOString() });
    } catch { return QuotaStateSchema.parse({ remaining: 0, limit: 100 }); }
  }

  async search(request: SearchRequest): Promise<SearchPage> {
    const input: Record<string, unknown> = {
      searchQueries: request.query ? request.query.split(/,\s*/).filter(Boolean) : [],
      resultsPerPage: Math.min(request.limit ?? 20, 100),
      searchSection: "video", videoSearchSorting: "most_relevant", scrapeRelatedVideos: false,
    };
    const raw = await runActorSync(TIKTOK_ACTOR, input);
    return SearchPageSchema.parse({ items: this.normalizeItems(raw), total: raw.length });
  }

  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
    const raw = await runActorSync(TIKTOK_ACTOR, { postURLs: [`https://www.tiktok.com/@/video/${request.externalId}`], resultsPerPage: 1 });
    const items = this.normalizeItems(raw);
    if (items.length === 0) throw new Error(`TikTok item not found: ${request.externalId}`);
    return RawSourceItemSchema.parse(items[0]!);
  }

  private normalizeItems(raw: unknown[]): RawSourceItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      const obj = item as Record<string, unknown>;
      const am = obj.authorMeta as Record<string, unknown> | undefined;
      const sm = obj.shareMeta as Record<string, unknown> | undefined;
      const vid = obj.video as Record<string, unknown> | undefined;
      const vm = obj.videoMeta as Record<string, unknown> | undefined;
      return {
        externalId: String(obj.id ?? obj.video_id ?? sm?.id ?? ""),
        url: String(obj.url ?? obj.share_url ?? obj.video_url ?? sm?.url ?? ""),
        author: String(obj.author ?? am?.name ?? obj.creator ?? ""),
        authorUrl: am?.url ? String(am.url) : undefined,
        publishedAt: String(obj.publishedAt ?? obj.create_time ?? obj.timestamp ?? ""),
        text: String(obj.text ?? obj.desc ?? obj.description ?? obj.caption ?? sm?.title ?? ""),
        type: "video",
        metrics: {
          views: this.toNum(obj.views ?? obj.play_count ?? obj.playCount),
          likes: this.toNum(obj.likes ?? obj.digg_count ?? obj.diggCount),
          comments: this.toNum(obj.comments ?? obj.comment_count ?? obj.commentCount),
          shares: this.toNum(obj.shares ?? obj.share_count ?? obj.shareCount),
        },
        media: [{
          type: "video" as const,
          url: String(obj.videoUrl ?? obj.video_url ?? vid?.url ?? ""),
          thumbnailUrl: String(obj.thumbnailUrl ?? obj.cover_url ?? obj.cover ?? ""),
          durationMs: this.toNum(obj.duration ?? obj.duration_ms ?? am?.duration ?? vm?.duration),
        }],
      };
    });
  }

  private toNum(val: unknown): number | undefined {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
}