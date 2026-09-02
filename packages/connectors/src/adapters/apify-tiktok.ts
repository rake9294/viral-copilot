1|/**
2| * Apify TikTok adapter — organic content via the clockworks/tiktok-scraper actor.
3| * Actor: https://apify.com/clockworks/tiktok-scraper
4| * Pricing: $0.0037 per result (PAY_PER_EVENT)
5| */
6|
7|import {
8|  ContentSourceAdapter,
9|  SourceAvailability,
10|  QuotaState,
11|  SearchRequest,
12|  SearchPage,
13|  RawSourceItem,
14|  GetItemRequest,
15|} from "../types.js";
16|import {
17|  SourceAvailabilitySchema,
18|  QuotaStateSchema,
19|  SearchPageSchema,
20|  RawSourceItemSchema,
21|} from "../schemas.js";
22|
23|const APIFY_API_BASE = "https://api.apify.com/v2";
24|const TIKTOK_ACTOR = "clockworks~tiktok-scraper";
25|
26|function getToken(): string {
27|  const token = process.env.APIFY_API_TOKEN;
28|  if (!token) throw new Error("APIFY_API_TOKEN is not set");
29|  return token;
30|}
31|
32|async function runActorSync(actorId: string, input: Record<string, unknown>): Promise<unknown[]> {
33|  const token = getToken();
34|  const res = await fetch(`${APIFY_API_BASE}/acts/${actorId}/run-sync-get-dataset-items`, {
35|    method: "POST",
36|    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: *** ${token}`, "User-Agent": "ViralCopilot/1.0" },
37|    body: JSON.stringify(input),
38|  });
39|  if (!res.ok) throw new Error(`Apify actor ${actorId} failed (${res.status})`);
40|  const data = await res.json();
41|  if (Array.isArray(data)) return data;
42|  const maybe = (data as Record<string, unknown>).data;
43|  return Array.isArray(maybe) ? maybe : [];
44|}
45|
46|export class ApifyTikTokAdapter implements ContentSourceAdapter {
47|  readonly source = "tiktok_organic" as const;
48|  private readonly defaultCountry: string;
49|  constructor(defaultCountry = "US") { this.defaultCountry = defaultCountry; }
50|
51|  async checkAvailability(): Promise<SourceAvailability> {
52|    try {
53|      if (!process.env.APIFY_API_TOKEN) return SourceAvailabilitySchema.parse({ status: "unavailable", message: "APIFY_API_TOKEN not configured" });
54|      const res = await fetch(`${APIFY_API_BASE}/acts/${TIKTOK_ACTOR}`, { headers: { Authorization: *** ${getToken()}`, "User-Agent": "ViralCopilot/1.0" } });
55|      return SourceAvailabilitySchema.parse({ status: res.ok ? "available" : "error", message: res.ok ? "Apify TikTok scraper (clockworks) available" : `Apify API returned ${res.status}` });
56|    } catch (err) {
57|      return SourceAvailabilitySchema.parse({ status: "error", message: `Failed to reach Apify: ${err instanceof Error ? err.message : String(err)}` });
58|    }
59|  }
60|
61|  async checkQuota(): Promise<QuotaState> {
62|    try {
63|      await fetch(`${APIFY_API_BASE}/acts/${TIKTOK_ACTOR}`, { headers: { Authorization: *** ${getToken()}`, "User-Agent": "ViralCopilot/1.0" } });
64|      return QuotaStateSchema.parse({ remaining: 500, limit: 500, resetsAt: new Date(Date.now() + 86_400_000).toISOString() });
65|    } catch { return QuotaStateSchema.parse({ remaining: 0, limit: 100 }); }
66|  }
67|
68|  async search(request: SearchRequest): Promise<SearchPage> {
69|    const input: Record<string, unknown> = {
70|      searchQueries: request.query ? request.query.split(/,\s*/).filter(Boolean) : [],
71|      resultsPerPage: Math.min(request.limit ?? 20, 100),
72|      searchSection: "/video", videoSearchSorting: "MOST_RELEVANT", scrapeRelatedVideos: false,
73|    };
74|    const raw = await runActorSync(TIKTOK_ACTOR, input);
75|    return SearchPageSchema.parse({ items: this.normalizeItems(raw), total: raw.length });
76|  }
77|
78|  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
79|    const raw = await runActorSync(TIKTOK_ACTOR, { postURLs: [`https://www.tiktok.com/@/video/${request.externalId}`], resultsPerPage: 1 });
80|    const items = this.normalizeItems(raw);
81|    if (items.length === 0) throw new Error(`TikTok item not found: ${request.externalId}`);
82|    return RawSourceItemSchema.parse(items[0]!);
83|  }
84|
85|  private normalizeItems(raw: unknown[]): RawSourceItem[] {
86|    if (!Array.isArray(raw)) return [];
87|    return raw.map((item) => {
88|      const obj = item as Record<string, unknown>;
89|      const am = obj.authorMeta as Record<string, unknown> | undefined;
90|      const sm = obj.shareMeta as Record<string, unknown> | undefined;
91|      const vid = obj.video as Record<string, unknown> | undefined;
92|      const vm = obj.videoMeta as Record<string, unknown> | undefined;
93|      return {
94|        externalId: String(obj.id ?? obj.video_id ?? sm?.id ?? ""),
95|        url: String(obj.url ?? obj.share_url ?? obj.video_url ?? sm?.url ?? ""),
96|        author: String(obj.author ?? am?.name ?? obj.creator ?? ""),
97|        authorUrl: am?.url ? String(am.url) : undefined,
98|        publishedAt: String(obj.publishedAt ?? obj.create_time ?? obj.timestamp ?? ""),
99|        text: String(obj.text ?? obj.desc ?? obj.description ?? obj.caption ?? sm?.title ?? ""),
100|        type: "video",
101|        metrics: {
102|          views: this.toNum(obj.views ?? obj.play_count ?? obj.playCount),
103|          likes: this.toNum(obj.likes ?? obj.digg_count ?? obj.diggCount),
104|          comments: this.toNum(obj.comments ?? obj.comment_count ?? obj.commentCount),
105|          shares: this.toNum(obj.shares ?? obj.share_count ?? obj.shareCount),
106|        },
107|        media: [{
108|          type: "video" as const,
109|          url: String(obj.videoUrl ?? obj.video_url ?? vid?.url ?? ""),
110|          thumbnailUrl: String(obj.thumbnailUrl ?? obj.cover_url ?? obj.cover ?? ""),
111|          durationMs: this.toNum(obj.duration ?? obj.duration_ms ?? am?.duration ?? vm?.duration),
112|        }],
113|      };
114|    });
115|  }
116|
117|  private toNum(val: unknown): number | undefined {
118|    const n = Number(val);
119|    return Number.isFinite(n) && n > 0 ? n : undefined;
120|  }
121|}