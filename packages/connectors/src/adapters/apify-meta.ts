1|/**
2| * Apify Meta Ads adapter — Facebook Ads Library via the novi/facebook-ads-library-scraper actor.
3| *
4| * Calls the Apify REST API directly with the user's API token.
5| * Actor: https://apify.com/apify/facebook-ads-scraper
6| *
7| * Input fields (novi/facebook-ads-library-scraper):
8| *   - searchTerms: string[] — keywords to search for ads
9| *   - country: string — country code (e.g. "US", "FR")
10| *   - adType: "ALL" | "IMAGE_AND_VIDEO" | "IMAGE" | "VIDEO" | "MEME" | null
11| *   - adActiveStatus: "ACTIVE" | "ALL" | "INACTIVE"
12| *   - adLanguage: string (e.g. "en", "fr")
13| *
14| * Output items include: ad_id, ad_title, ad_body, ad_creative_body,
15| *   ad_creative_link_description, ad_creation_time, ad_delivery_start_time,
16| *   page_name, page_id, impressions, spend, currency, ctr, etc.
17| */
18|
19|import {
20|  ContentSourceAdapter,
21|  SourceAvailability,
22|  QuotaState,
23|  SearchRequest,
24|  SearchPage,
25|  RawSourceItem,
26|  GetItemRequest,
27|  RawAdvertiser,
28|  GetAdvertiserRequest,
29|} from "../types.js";
30|import {
31|  SourceAvailabilitySchema,
32|  QuotaStateSchema,
33|  SearchPageSchema,
34|  RawSourceItemSchema,
35|  RawAdvertiserSchema,
36|} from "../schemas.js";
37|
38|const APIFY_API_BASE = "https://api.apify.com/v2";
39|const META_ADS_ACTOR = "apify~facebook-ads-scraper";
40|
41|function getToken(): string {
42|  const token = process.env.APIFY_API_TOKEN;
43|  if (!token) {
44|    throw new Error(
45|      "APIFY_API_TOKEN is not set. Add it to your .env file.",
46|    );
47|  }
48|  return token;
49|}
50|
51|async function apifyFetch(
52|  path: string,
53|  options: RequestInit = {},
54|): Promise<Response> {
55|  const token = getToken();
56|  const url = `${APIFY_API_BASE}${path}`;
57|  return fetch(url, {
58|    ...options,
59|    headers: {
60|      "Content-Type": "application/json",
61|      Accept: "application/json",
62|      Authorization: *** ${token}`,
63|      "User-Agent": "ViralCopilot/1.0",
64|      ...options.headers,
65|    },
66|  });
67|}
68|
69|async function runActorSync(
70|  actorId: string,
71|  input: Record<string, unknown>,
72|): Promise<unknown[]> {
73|  const res = await apifyFetch(`/acts/${actorId}/run-sync-get-dataset-items`, {
74|    method: "POST",
75|    body: JSON.stringify({
76|      ...input,
77|      maxItems: 200,
78|    }),
79|  });
80|
81|  if (!res.ok) {
82|    const body = await res.text().catch(() => "");
83|    throw new Error(
84|      `Apify actor ${actorId} failed (${res.status}): ${body.slice(0, 500)}`,
85|    );
86|  }
87|
88|  const data = await res.json();
89|  if (!Array.isArray(data)) {
90|    const maybe = (data as Record<string, unknown>).data;
91|    if (Array.isArray(maybe)) return maybe;
92|    return [];
93|  }
94|  return data;
95|}
96|
97|/**
98| * Apify Facebook Ads Library adapter.
99| *
100| * Uses the apify/facebook-ads-scraper actor to search public Meta Ads.
101| * Token must be in APIFY_API_TOKEN env var.
102| */
103|export class ApifyMetaAdapter implements ContentSourceAdapter {
104|  readonly source = "meta_ads" as const;
105|
106|  async checkAvailability(): Promise<SourceAvailability> {
107|    try {
108|      const token = process.env.APIFY_API_TOKEN;
109|      if (!token) {
110|        return SourceAvailabilitySchema.parse({
111|          status: "unavailable",
112|          message: "APIFY_API_TOKEN not configured",
113|        });
114|      }
115|      const res = await apifyFetch(`/acts/${META_ADS_ACTOR}`);
116|      if (!res.ok) {
117|        return SourceAvailabilitySchema.parse({
118|          status: "error",
119|          message: `Apify API returned ${res.status}`,
120|          error: await res.text().catch(() => ""),
121|        });
122|      }
123|      return SourceAvailabilitySchema.parse({
124|        status: "available",
125|        message: "Apify Meta Ads Library available",
126|      });
127|    } catch (err) {
128|      const msg = err instanceof Error ? err.message : String(err);
129|      return SourceAvailabilitySchema.parse({
130|        status: "error",
131|        message: "Failed to reach Apify Meta Ads source",
132|        error: msg,
133|      });
134|    }
135|  }
136|
137|  async checkQuota(): Promise<QuotaState> {
138|    try {
139|      await apifyFetch(`/acts/${META_ADS_ACTOR}`);
140|      return QuotaStateSchema.parse({
141|        remaining: 1000,
142|        limit: 1000,
143|        resetsAt: new Date(Date.now() + 86_400_000).toISOString(),
144|      });
145|    } catch {
146|      return QuotaStateSchema.parse({ remaining: 0, limit: 100 });
147|    }
148|  }
149|
150|  async search(request: SearchRequest): Promise<SearchPage> {
151|    const searchTerms = request.query
152|      ? request.query.split(/,\s*/).filter(Boolean)
153|      : [];
154|
155|    // Apify facebook-ads-scraper uses startUrls with Ad Library URLs
156|    const country = (request.filters?.country as string) ?? "US";
157|    const status = (request.filters?.status as string) ?? "ACTIVE";
158|    const query = encodeURIComponent(searchTerms.join(" "));
159|
160|    const adLibUrl = `https://www.facebook.com/ads/library/?active_status=${status}&ad_type=all&country=${country}&q=${query}&sort_data=relevance`;
161|
162|    const input: Record<string, unknown> = {
163|      startUrls: [{ url: adLibUrl }],
164|      resultsLimit: Math.min(request.limit ?? 20, 100),
165|    };
166|
167|    // Pagination
168|    if (request.cursor) {
169|      input.offset = Number(request.cursor);
170|    }
171|
172|    const raw = await runActorSync(META_ADS_ACTOR, input);
173|    const items = this.normalizeAds(raw, request.limit ?? 20);
174|
175|    return SearchPageSchema.parse({
176|      items,
177|      total: items.length,
178|    });
179|  }
180|
181|  async getItem(request: GetItemRequest): Promise<RawSourceItem> {
182|    const input: Record<string, unknown> = {
183|      startUrls: [{ url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=FR&q=&sort_data=relevance` }],
184|      resultsLimit: 100,
185|    };
186|
187|    const raw = await runActorSync(META_ADS_ACTOR, input);
188|    const items = this.normalizeAds(raw, 100);
189|    const match = items.find(
190|      (i) => i.externalId === request.externalId,
191|    );
192|
193|    if (!match) {
194|      throw new Error(`Meta ad not found: ${request.externalId}`);
195|    }
196|    return RawSourceItemSchema.parse(match);
197|  }
198|
199|  async getAdvertiser(
200|    request: GetAdvertiserRequest,
201|  ): Promise<RawAdvertiser> {
202|    // Search for ads by this advertiser and aggregate
203|    const input: Record<string, unknown> = {
204|      startUrls: [{ url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=FR&q=${encodeURIComponent(request.externalId)}&sort_data=relevance` }],
205|      resultsLimit: 50,
206|    };
207|
208|    const raw = await runActorSync(META_ADS_ACTOR, input);
209|    const ads = this.normalizeAds(raw, 50);
210|
211|    // Aggregate totals
212|    let totalViews = 0;
213|    let totalLikes = 0;
214|    let totalComments = 0;
215|    let totalShares = 0;
216|    const advertiserNames = new Set<string>();
217|
218|    for (const ad of ads) {
219|      totalViews += ad.metrics?.views ?? 0;
220|      totalLikes += ad.metrics?.likes ?? 0;
221|      totalComments += ad.metrics?.comments ?? 0;
222|      totalShares += ad.metrics?.shares ?? 0;
223|      if (ad.author) advertiserNames.add(ad.author);
224|    }
225|
226|    return RawAdvertiserSchema.parse({
227|      externalId: request.externalId,
228|      name: [...advertiserNames].join(", ") || undefined,
229|      relevanceScore: ads.length > 0 ? Math.min(ads.length / 20, 1) : undefined,
230|      metrics: {
231|        views: totalViews || undefined,
232|        likes: totalLikes || undefined,
233|        comments: totalComments || undefined,
234|        shares: totalShares || undefined,
235|      },
236|    });
237|  }
238|
239|  // ---------------------------------------------------------------------------
240|  // Private helpers
241|  // ---------------------------------------------------------------------------
242|
243|  private normalizeAds(raw: unknown[], _limit: number): RawSourceItem[] {
244|    if (!Array.isArray(raw)) return [];
245|    return raw.slice(0, _limit).map((item) => {
246|      const obj = item as Record<string, unknown>;
247|      const id = String(
248|        obj.ad_id ?? obj.id ?? obj.collation_id ?? "",
249|      );
250|      const url = String(obj.url ?? obj.ad_url ?? "");
251|      const pageUrl = String(obj.page_url ?? obj.pageUrl ?? "");
252|
253|      // Combine title, body, and description into one text blob
254|      const title = String(obj.ad_title ?? obj.title ?? "");
255|      const body = String(obj.ad_body ?? obj.body ?? obj.ad_creative_body ?? "");
256|      const linkDesc = String(
257|        obj.ad_creative_link_description ?? obj.link_description ?? "",
258|      );
259|      const text = [title, body, linkDesc].filter(Boolean).join(" | ");
260|
261|      return {
262|        externalId: id,
263|        ...(url ? { url } : {}),
264|        author: String(
265|          obj.page_name ?? obj.advertiser_name ?? obj.pageName ?? "",
266|        ),
267|        ...(pageUrl ? { authorUrl: pageUrl } : {}),
268|        publishedAt: String(
269|          obj.ad_creation_time ??
270|            obj.ad_delivery_start_time ??
271|            obj.created_at ??
272|            "",
273|        ),
274|        text,
275|        type: "ad",
276|        metrics: {
277|          views: this.toNum(
278|            obj.impressions ?? obj.impressions_lower ?? obj.views,
279|          ),
280|          likes: this.toNum(
281|            obj.likes ?? obj.reactions ?? obj.ad_reactions,
282|          ),
283|          comments: this.toNum(obj.comments ?? obj.ad_comments),
284|          shares: this.toNum(obj.shares ?? obj.ad_shares),
285|          reachDelta7d: this.toNum(
286|            obj.reach_delta ?? obj.reachDelta7d ?? obj.ctr,
287|          ),
288|        },
289|        media: this.extractMedia(obj),
290|      };
291|    });
292|  }
293|
294|  private extractMedia(obj: Record<string, unknown>): Array<{
295|    type: "video" | "image" | "carousel";
296|    url?: string;
297|    thumbnailUrl?: string;
298|    width?: number;
299|    height?: number;
300|  }> {
301|    const media: Array<{
302|      type: "video" | "image" | "carousel";
303|      url?: string;
304|      thumbnailUrl?: string;
305|      width?: number;
306|      height?: number;
307|    }> = [];
308|
309|    if (obj.video_url ?? obj.videoUrl ?? obj.creative_video_url) {
310|      media.push({
311|        type: "video",
312|        url: String(
313|          obj.video_url ?? obj.videoUrl ?? obj.creative_video_url ?? "",
314|        ),
315|        thumbnailUrl: String(
316|          obj.thumbnail_url ?? obj.cover_url ?? "",
317|        ),
318|      });
319|    }
320|
321|    if (obj.image_url ?? obj.imageUrl ?? obj.creative_image_url) {
322|      media.push({
323|        type: "image",
324|        url: String(
325|          obj.image_url ?? obj.imageUrl ?? obj.creative_image_url ?? "",
326|        ),
327|        width: this.toNum(obj.image_width),
328|        height: this.toNum(obj.image_height),
329|      });
330|    }
331|
332|    const carouselCards = obj.carousel_cards ?? obj.carouselCards;
333|    if (Array.isArray(carouselCards)) {
334|      for (const card of carouselCards) {
335|        const c = card as Record<string, unknown>;
336|        media.push({
337|          type: "carousel",
338|          url: String(c.url ?? c.image_url ?? ""),
339|          thumbnailUrl: String(c.thumbnail_url ?? c.thumbnail ?? ""),
340|        });
341|      }
342|    }
343|
344|    return media;
345|  }
346|
347|  private toNum(val: unknown): number | undefined {
348|    const n = Number(val);
349|    return Number.isFinite(n) && n > 0 ? n : undefined;
350|  }
351|}