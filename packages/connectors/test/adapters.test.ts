import { describe, it, expect, vi, beforeEach } from "vitest";
import { MCPClient } from "@viral-copilot/mcp-client";
import { TrendTrackTikTokAdapter } from "../src/adapters/trendtrack-tiktok.js";
import { TrendTrackMetaAdapter } from "../src/adapters/trendtrack-meta.js";
import { createAdapter } from "../src/index.js";
import type { ContentSourceAdapter, SearchPage } from "../src/types.js";
import { TIKTOK_FIXTURES, META_FIXTURES } from "./fixtures/responses.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockClient(toolResponses: Record<string, unknown>[]): MCPClient {
  const client = new MCPClient({
    serverUrl: "http://localhost:9999/mcp",
    retryMaxAttempts: 1,
    timeoutMs: 5000,
  });

  // Pre-seed the callTool mock so the adapter can use it
  const callToolMock = vi.fn();
  let idx = 0;
  callToolMock.mockImplementation(() => {
    if (idx >= toolResponses.length) {
      return Promise.reject(new Error("No more responses stubbed"));
    }
    return Promise.resolve(toolResponses[idx++]!);
  });

  (client as any).callTool = callToolMock;
  (client as any).listTools = vi.fn().mockResolvedValue([]);

  return client;
}

/**
 * Helper: unwrap an MCP result into parsed payload for adapter testing.
 * The adapter calls client.callTool() which returns an MCP tool result
 * shaped like { content: [{ type: "text", text: "..." }] }.
 * Our mock returns the fixture directly as the "result" field.
 */
function makeCallResult(fixture: {
  content: Array<{ type: string; text: string }>;
}) {
  return fixture;
}

// ---------------------------------------------------------------------------
// TrendTrackTikTokAdapter
// ---------------------------------------------------------------------------

describe("TrendTrackTikTokAdapter", () => {
  let adapter: TrendTrackTikTokAdapter;

  describe("checkAvailability", () => {
    it("returns available when search_tiktok_library tool is present", async () => {
      const client = mockClient([]);
      (client as any).listTools = vi.fn().mockResolvedValue([
        { name: "search_tiktok_library" },
      ]);
      adapter = new TrendTrackTikTokAdapter(client);

      const result = await adapter.checkAvailability();
      expect(result.status).toBe("available");
    });

    it("returns unavailable when tool is missing", async () => {
      const client = mockClient([]);
      (client as any).listTools = vi.fn().mockResolvedValue([
        { name: "search_ads" },
      ]);
      adapter = new TrendTrackTikTokAdapter(client);

      const result = await adapter.checkAvailability();
      expect(result.status).toBe("unavailable");
    });

    it("returns error on network failure", async () => {
      const client = mockClient([]);
      (client as any).listTools = vi
        .fn()
        .mockRejectedValue(new Error("Connection refused"));
      adapter = new TrendTrackTikTokAdapter(client);

      const result = await adapter.checkAvailability();
      expect(result.status).toBe("error");
      expect(result.error).toContain("Connection refused");
    });
  });

  describe("search", () => {
    it("returns normalized items for organic search", async () => {
      const client = mockClient([makeCallResult(TIKTOK_FIXTURES.organicSearchResult)]);
      adapter = new TrendTrackTikTokAdapter(client);

      const page = await adapter.search({ query: "viral trend" });

      expect(page.items).toHaveLength(2);
      expect(page.nextCursor).toBe("page_2_cursor");
      expect(page.total).toBe(85);
      // First item details
      const item0 = page.items[0]!;
      expect(item0.externalId).toBe("7411111111111111111");
      expect(item0.author).toBe("creator_alpha");
      expect(item0.type).toBe("video");
      expect(item0.metrics?.views).toBe(500000);
      expect(item0.metrics?.likes).toBe(45000);
      expect(item0.metrics?.comments).toBe(3200);
      expect(item0.metrics?.shares).toBe(12000);
      expect(item0.text).toBe("Viral TikTok trend video");
      expect(item0.media).toHaveLength(1);
      expect(item0.media![0]!.type).toBe("video");
      expect(item0.media![0]!.durationMs).toBe(42000);
    });

    it("returns empty items array when no results", async () => {
      const client = mockClient([makeCallResult(TIKTOK_FIXTURES.emptyResponse)]);
      adapter = new TrendTrackTikTokAdapter(client);

      const page = await adapter.search({ query: "nonexistent" });
      expect(page.items).toHaveLength(0);
      expect(page.nextCursor).toBeUndefined();
    });
  });

  describe("getItem", () => {
    it("fetches and returns a single item", async () => {
      const client = mockClient([makeCallResult(TIKTOK_FIXTURES.organicSearchResult)]);
      adapter = new TrendTrackTikTokAdapter(client);

      const item = await adapter.getItem({
        externalId: "7411111111111111111",
      });
      expect(item.externalId).toBe("7411111111111111111");
      expect(item.author).toBe("creator_alpha");
    });

    it("throws if item not found", async () => {
      const client = mockClient([makeCallResult(TIKTOK_FIXTURES.notFoundItem)]);
      adapter = new TrendTrackTikTokAdapter(client);

      await expect(
        adapter.getItem({ externalId: "nonexistent" }),
      ).rejects.toThrow("not found");
    });
  });

  describe("factory", () => {
    it("createAdapter returns TikTok adapter", () => {
      const client = mockClient([]);
      const adapter = createAdapter("tiktok_organic", { client });
      expect(adapter.source).toBe("tiktok_organic");
      expect(adapter).toBeInstanceOf(TrendTrackTikTokAdapter);
    });
  });
});

// ---------------------------------------------------------------------------
// TrendTrackMetaAdapter
// ---------------------------------------------------------------------------

describe("TrendTrackMetaAdapter", () => {
  let adapter: TrendTrackMetaAdapter;

  describe("checkAvailability", () => {
    it("returns available when search_ads tool is present", async () => {
      const client = mockClient([]);
      (client as any).listTools = vi.fn().mockResolvedValue([
        { name: "search_ads" },
      ]);
      adapter = new TrendTrackMetaAdapter(client);

      const result = await adapter.checkAvailability();
      expect(result.status).toBe("available");
    });
  });

  describe("search", () => {
    it("returns normalized ads with video and image variants", async () => {
      const client = mockClient([makeCallResult(META_FIXTURES.searchResult)]);
      adapter = new TrendTrackMetaAdapter(client);

      const page = await adapter.search({
        query: "summer sale fashion",
        filters: { status: "active", minReach: 100000 },
      });

      expect(page.items).toHaveLength(2);

      // Ad with video
      const ad0 = page.items[0]!;
      expect(ad0.externalId).toBe("meta_ad_100");
      expect(ad0.author).toBe("Fashion Brand X");
      expect(ad0.type).toBe("ad");
      expect(ad0.text).toContain("Summer sale");
      expect(ad0.metrics?.views).toBe(890000);
      expect(ad0.metrics?.reachDelta7d).toBe(210000);
      expect(ad0.media).toHaveLength(1);
      expect(ad0.media![0]!.type).toBe("video");

      // Ad with image
      const ad1 = page.items[1]!;
      expect(ad1.externalId).toBe("meta_ad_101");
      expect(ad1.media).toHaveLength(1);
      expect(ad1.media![0]!.type).toBe("image");
      expect(ad1.media![0]!.width).toBe(1080);
      expect(ad1.media![0]!.height).toBe(1350);
    });

    it("returns empty items when no ads match", async () => {
      const client = mockClient([
        { content: [{ type: "text", text: JSON.stringify({ items: [] }) }] },
      ]);
      adapter = new TrendTrackMetaAdapter(client);

      const page = await adapter.search({ query: "zzz" });
      expect(page.items).toHaveLength(0);
    });
  });

  describe("getItem", () => {
    it("fetches a single ad via scan_ad", async () => {
      const client = mockClient([makeCallResult(META_FIXTURES.scanAdResult)]);
      adapter = new TrendTrackMetaAdapter(client);

      const item = await adapter.getItem({ externalId: "meta_ad_100" });
      expect(item.externalId).toBe("meta_ad_100");
      expect(item.author).toBe("Fashion Brand X");
      expect(item.text).toContain("Summer sale");
      expect(item.metrics?.reachDelta7d).toBe(210000);
    });
  });

  describe("getAdvertiser", () => {
    it("fetches advertiser info via brief_competitor and find_similar_shops", async () => {
      const client = mockClient([
        makeCallResult(META_FIXTURES.briefCompetitorResult),
        makeCallResult(META_FIXTURES.findSimilarShopsResult),
      ]);
      adapter = new TrendTrackMetaAdapter(client);

      const advertiser = await adapter.getAdvertiser({
        externalId: "fashion_brand_x",
      });
      expect(advertiser.externalId).toBe("fashion_brand_x");
      expect(advertiser.name).toBe("Fashion Brand X");
      expect(advertiser.shopUrl).toBe("https://fashionbrandx.com");
      expect(advertiser.relevanceScore).toBe(0.92);
      expect(advertiser.metrics?.views).toBe(15000000);
    });
  });

  describe("factory", () => {
    it("createAdapter returns Meta adapter", () => {
      const client = mockClient([]);
      const adapter = createAdapter("meta_ads", { client });
      expect(adapter.source).toBe("meta_ads");
      expect(adapter).toBeInstanceOf(TrendTrackMetaAdapter);
    });
  });
});

// ---------------------------------------------------------------------------
// Zod schema validation tests
// ---------------------------------------------------------------------------

describe("schemas", () => {
  it("SearchPageSchema validates a full page", async () => {
    const { SearchPageSchema } = await import("../src/schemas.js");

    const page: SearchPage = {
      items: [
        {
          externalId: "test_1",
          url: "https://example.com/1",
          author: "Test",
          text: "Hello",
          type: "video",
          metrics: { views: 100, likes: 10 },
          media: [{ type: "video", url: "https://example.com/v.mp4" }],
        },
      ],
      nextCursor: "next_page",
      total: 42,
    };

    const parsed = SearchPageSchema.parse(page);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.nextCursor).toBe("next_page");
    expect(parsed.total).toBe(42);
  });

  it("SourceAvailabilitySchema validates all statuses", async () => {
    const { SourceAvailabilitySchema } = await import("../src/schemas.js");

    expect(
      SourceAvailabilitySchema.parse({ status: "available", message: "ok" })
        .status,
    ).toBe("available");
    expect(
      SourceAvailabilitySchema.parse({
        status: "unavailable",
        message: "down",
      }).status,
    ).toBe("unavailable");
    expect(
      SourceAvailabilitySchema.parse({
        status: "error",
        message: "err",
        error: "timeout",
      }).error,
    ).toBe("timeout");
  });

  it("RawAdvertiserSchema validates correctly", async () => {
    const { RawAdvertiserSchema } = await import("../src/schemas.js");

    const adv = RawAdvertiserSchema.parse({
      externalId: "adv_1",
      name: "Brand",
      shopUrl: "https://shop.com",
      relevanceScore: 0.75,
    });
    expect(adv.name).toBe("Brand");
    expect(adv.relevanceScore).toBe(0.75);
  });
});