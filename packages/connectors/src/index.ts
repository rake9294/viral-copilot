import { MCPClient } from "@viral-copilot/mcp-client";
import { ContentSourceAdapter } from "./types.js";
import { TrendTrackTikTokAdapter } from "./adapters/trendtrack-tiktok.js";
import { TrendTrackMetaAdapter } from "./adapters/trendtrack-meta.js";
import { ApifyTikTokAdapter } from "./adapters/apify-tiktok.js";
import { ApifyMetaAdapter } from "./adapters/apify-meta.js";

/**
 * Which backend to use for content sources.
 * - "trendtrack": uses TrendTrack MCP (requires MCPClient)
 * - "apify": uses Apify Actors (requires APIFY_API_TOKEN env var)
 */
export type SourceBackend = "trendtrack" | "apify";

/**
 * Create a content source adapter for the given source type.
 *
 * @param source  Source identifier.
 * @param options  Options including backend and optional MCP client or default country.
 */
export function createAdapter(
  source: ContentSourceAdapter["source"],
  options: {
    backend?: SourceBackend;
    client?: MCPClient;
    defaultCountry?: string;
  } = {},
): ContentSourceAdapter {
  const backend = options.backend ?? "apify"; // default to Apify
  const country = options.defaultCountry ?? "US";

  if (backend === "trendtrack") {
    if (!options.client) {
      throw new Error("MCPClient is required for trendtrack backend");
    }
    switch (source) {
      case "tiktok_organic":
        return new TrendTrackTikTokAdapter(options.client, country);
      case "meta_ads":
        return new TrendTrackMetaAdapter(options.client);
    }
  }

  // Apify backend (default)
  switch (source) {
    case "tiktok_organic":
      return new ApifyTikTokAdapter(country);
    case "meta_ads":
      return new ApifyMetaAdapter();
    default: {
      const _exhaustive: never = source;
      throw new Error(`Unknown source: ${String(_exhaustive)}`);
    }
  }
}

export {
  TrendTrackTikTokAdapter,
  TrendTrackMetaAdapter,
  ApifyTikTokAdapter,
  ApifyMetaAdapter,
};
export type { ContentSourceAdapter } from "./types.js";
export type { RawSourceItem } from "./types.js";