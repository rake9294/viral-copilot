/**
 * Fixtures for MCP client tests.
 */

/** A minimal tool list response from a TrendTrack server. */
export const TRENDTRACK_TOOLS_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-1",
  result: [
    {
      name: "search_tiktok_library",
      description: "Search TikTok content library (organic or ads)",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["organic", "ad"] },
          keywords: { type: "array", items: { type: "string" } },
          country: { type: "string" },
        },
      },
    },
    {
      name: "search_ads",
      description: "Search Meta Ads library",
      inputSchema: {
        type: "object",
        properties: {
          sort_by: { type: "string" },
          keywords: { type: "array", items: { type: "string" } },
          status: { type: "string" },
        },
      },
    },
  ],
};

/** A TikTok organic search response. */
export const TIKTOK_ORGANIC_SEARCH_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-2",
  result: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          items: [
            {
              id: "7412345678901234567",
              url: "https://www.tiktok.com/@user/video/7412345678901234567",
              author: "test_creator",
              author_url: "https://www.tiktok.com/@test_creator",
              desc: "Check out this amazing video!",
              create_time: "2025-01-15T10:00:00Z",
              play_count: 150000,
              digg_count: 12000,
              comment_count: 800,
              share_count: 4500,
              video_url: "https://example.com/video.mp4",
              cover_url: "https://example.com/cover.jpg",
              duration: 35000,
            },
          ],
          nextCursor: "cursor_abc123",
          total: 42,
        }),
      },
    ],
  },
};

/** A Meta Ads search response. */
export const META_ADS_SEARCH_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-3",
  result: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          items: [
            {
              id: "meta_ad_001",
              ad_url: "https://www.facebook.com/ads/ad_001",
              advertiser_name: "Brand Co",
              advertiser_url: "https://www.facebook.com/brandco",
              body: "Shop now and get 50% off!",
              start_time: "2025-02-01T00:00:00Z",
              views: 250000,
              likes: 8500,
              comments: 1200,
              shares: 3400,
              reach_delta: 75000,
              video_url: "https://example.com/ad_video.mp4",
              thumbnail_url: "https://example.com/ad_thumb.jpg",
            },
          ],
          nextCursor: "meta_cursor_xyz",
          total: 10,
        }),
      },
    ],
  },
};

/** A scan_ad deep-dive response. */
export const META_SCAN_AD_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-4",
  result: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: "meta_ad_001",
          advertiser_name: "Brand Co",
          body: "Shop now and get 50% off!",
          start_time: "2025-02-01T00:00:00Z",
          views: 250000,
          likes: 8500,
          comments: 1200,
          shares: 3400,
          reach_delta: 75000,
          video_url: "https://example.com/ad_video.mp4",
          thumbnail_url: "https://example.com/ad_thumb.jpg",
        }),
      },
    ],
  },
};

/** A brief_competitor response. */
export const META_BRIEF_COMPETITOR_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-5",
  result: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: "brand_co_001",
          advertiser_id: "brand_co_001",
          name: "Brand Co",
          advertiser_name: "Brand Co",
          advertiser_url: "https://www.facebook.com/brandco",
          shop_url: "https://brandco.com",
          score: 0.85,
          total_views: 5000000,
          total_likes: 150000,
          total_comments: 25000,
          total_shares: 80000,
        }),
      },
    ],
  },
};

/** An error response. */
export const ERROR_RESPONSE = {
  jsonrpc: "2.0",
  id: "test-error",
  error: {
    code: -32600,
    message: "Invalid params: type must be 'organic' or 'ad'",
  },
};