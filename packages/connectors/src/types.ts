/**
 * Internal contract types for content source adapters.
 * No business code touches a raw MCP response — everything
 * goes through these typed interfaces.
 */

/** Availability status of a content source. */
export interface SourceAvailability {
  /** Source is reachable and responding. */
  status: "available" | "unavailable" | "error";
  /** Human-readable summary. */
  message: string;
  /** Any error details if status is "error". */
  error?: string;
}

/** Quota state for a content source API. */
export interface QuotaState {
  /** Remaining request count, if known. */
  remaining: number;
  /** Total allowed requests in the current window. */
  limit: number;
  /** ISO-8601 timestamp of reset, if known. */
  resetsAt?: string;
}

/** A request to search within a content source. */
export interface SearchRequest {
  /** Free-text query keywords. */
  query?: string;
  /** Key-value filter pairs (source-specific key names). */
  filters?: Record<string, unknown>;
  /** Max results per page. */
  limit?: number;
  /** Pagination cursor from a previous response. */
  cursor?: string;
}

/** A single item returned by a content source. */
export interface RawSourceItem {
  /** Source-unique identifier. */
  externalId: string;
  /** Direct URL to the item. */
  url?: string;
  /** Author/creator display name. */
  author?: string;
  /** Author profile URL. */
  authorUrl?: string;
  /** ISO-8601 publication timestamp. */
  publishedAt?: string;
  /** Engagement metrics. */
  metrics?: SourceMetrics;
  /** Media attachments. */
  media?: SourceMediaItem[];
  /** Primary text content (caption, description, etc.). */
  text?: string;
  /** Content type (video, image, carousel, text). */
  type?: string;
}

/** Engagement metrics for a source item. */
export interface SourceMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  /** Meta-specific: daily active reach delta (7d). */
  reachDelta7d?: number;
}

/** A media item within a source item. */
export interface SourceMediaItem {
  type: "video" | "image" | "carousel";
  url?: string;
  thumbnailUrl?: string;
  durationMs?: number;
  width?: number;
  height?: number;
}

/** Paginated search response. */
export interface SearchPage {
  items: RawSourceItem[];
  /** Cursor for the next page. Undefined when exhausted. */
  nextCursor?: string;
  /** Estimated total results (may be absent). */
  total?: number;
}

/** Request to fetch a single item by ID. */
export interface GetItemRequest {
  externalId: string;
}

/** Advertiser / brand information. */
export interface RawAdvertiser {
  externalId: string;
  name?: string;
  url?: string;
  /** Shop / store URL for e-commerce brands. */
  shopUrl?: string;
  /** Confidence that this is a relevant advertiser. */
  relevanceScore?: number;
  /** Engagement metrics on the advertiser's ads. */
  metrics?: SourceMetrics;
}

/** Named filter presets for common TrendTrack queries. */
export type TrendTrackFilter =
  | { type: "tiktok_organic"; country?: string; keywords?: string[] }
  | { type: "tiktok_ads"; }
  | { type: "meta_ads"; minReach?: number; status?: "active" | "paused" | "all" };

/**
 * Content source adapter interface.
 *
 * Every TrendTrack data source (TikTok organic, TikTok ads, Meta Ads)
 * implements this contract.
 */
export interface ContentSourceAdapter {
  /** Source identifier used in factories and routing. */
  readonly source: "tiktok_organic" | "meta_ads";

  /** Check whether the source is reachable and the API key is valid. */
  checkAvailability(): Promise<SourceAvailability>;

  /** Check current API quota usage. */
  checkQuota(): Promise<QuotaState>;

  /** Search the content source. */
  search(request: SearchRequest): Promise<SearchPage>;

  /** Fetch a single item by external ID. */
  getItem(request: GetItemRequest): Promise<RawSourceItem>;

  /** Fetch advertiser / brand information (Meta Ads only). */
  getAdvertiser?(request: GetAdvertiserRequest): Promise<RawAdvertiser>;
}

/** Request to fetch advertiser info. */
export interface GetAdvertiserRequest {
  externalId: string;
}