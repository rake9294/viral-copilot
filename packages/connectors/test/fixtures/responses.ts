/**
 * TrendTrack adapter test fixtures.
 * These simulate MCP tool responses that the adapters parse.
 */
export const TIKTOK_FIXTURES = {
  toolsResponse: {
    jsonrpc: "2.0",
    id: "tt-1",
    result: [
      {
        name: "search_tiktok_library",
        description: "Search TikTok content library (organic or ads)",
      },
    ],
  },
  organicSearchResult: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          items: [
            {
              id: "7411111111111111111",
              url: "https://www.tiktok.com/@user1/video/7411111111111111111",
              author: "creator_alpha",
              author_url: "https://www.tiktok.com/@creator_alpha",
              desc: "Viral TikTok trend video",
              create_time: "2025-03-10T14:30:00Z",
              play_count: 500000,
              digg_count: 45000,
              comment_count: 3200,
              share_count: 12000,
              video_url: "https://example.com/tt_video_1.mp4",
              cover_url: "https://example.com/tt_cover_1.jpg",
              duration: 42000,
            },
            {
              id: "7412222222222222222",
              url: "https://www.tiktok.com/@user2/video/7412222222222222222",
              author: "creator_beta",
              author_url: "https://www.tiktok.com/@creator_beta",
              desc: "Another trending video",
              create_time: "2025-03-09T20:15:00Z",
              play_count: 320000,
              digg_count: 28000,
              comment_count: 1900,
              share_count: 8900,
              video_url: "https://example.com/tt_video_2.mp4",
              cover_url: "https://example.com/tt_cover_2.jpg",
              duration: 28000,
            },
          ],
          nextCursor: "page_2_cursor",
          total: 85,
        }),
      },
    ],
  },
  emptyResponse: {
    content: [
      {
        type: "text",
        text: JSON.stringify({ items: [] }),
      },
    ],
  },
  // Response where text is in a later content item
  multiContent: {
    content: [
      { type: "resource", text: "meta" },
      {
        type: "text",
        text: JSON.stringify({
          items: [
            {
              id: "7413333333333333333",
              author: "creator_gamma",
            },
          ],
          total: 1,
        }),
      },
    ],
  },
  notFoundItem: {
    content: [
      {
        type: "text",
        text: JSON.stringify({ items: [] }),
      },
    ],
  },
};

export const META_FIXTURES = {
  toolsResponse: {
    jsonrpc: "2.0",
    id: "ma-1",
    result: [
      { name: "search_ads", description: "Search Meta Ads library" },
      { name: "scan_ad", description: "Deep-dive into an ad collation" },
      {
        name: "brief_competitor",
        description: "Competitor brand analysis",
      },
      {
        name: "find_similar_shops",
        description: "Find e-commerce shops similar to an advertiser",
      },
    ],
  },
  searchResult: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          items: [
            {
              id: "meta_ad_100",
              ad_url: "https://www.facebook.com/ads/100",
              advertiser_name: "Fashion Brand X",
              advertiser_url: "https://www.facebook.com/fashionbrandx",
              body: "Summer sale — up to 70% off!",
              start_time: "2025-04-01T00:00:00Z",
              views: 890000,
              likes: 32000,
              comments: 5400,
              shares: 18000,
              reach_delta: 210000,
              video_url: "https://example.com/meta_vid_100.mp4",
              thumbnail_url: "https://example.com/meta_thumb_100.jpg",
              duration: 15000,
            },
            {
              id: "meta_ad_101",
              ad_url: "https://www.facebook.com/ads/101",
              advertiser_name: "Fashion Brand X",
              advertiser_url: "https://www.facebook.com/fashionbrandx",
              body: "New collection drop!",
              start_time: "2025-03-28T00:00:00Z",
              views: 450000,
              likes: 18000,
              comments: 2100,
              shares: 9500,
              reach_delta: 105000,
              image_url: "https://example.com/meta_img_101.jpg",
              image_width: 1080,
              image_height: 1350,
            },
          ],
          nextCursor: "meta_p2",
          total: 25,
        }),
      },
    ],
  },
  scanAdResult: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: "meta_ad_100",
          advertiser_name: "Fashion Brand X",
          body: "Summer sale — up to 70% off!",
          start_time: "2025-04-01T00:00:00Z",
          views: 890000,
          likes: 32000,
          comments: 5400,
          shares: 18000,
          reach_delta: 210000,
          video_url: "https://example.com/meta_vid_100.mp4",
          thumbnail_url: "https://example.com/meta_thumb_100.jpg",
          duration: 15000,
        }),
      },
    ],
  },
  briefCompetitorResult: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          id: "fashion_brand_x",
          advertiser_id: "fashion_brand_x",
          name: "Fashion Brand X",
          advertiser_name: "Fashion Brand X",
          advertiser_url: "https://www.facebook.com/fashionbrandx",
          shop_url: "https://fashionbrandx.com",
          score: 0.92,
          total_views: 15000000,
          total_likes: 420000,
          total_comments: 85000,
          total_shares: 240000,
        }),
      },
    ],
  },
  findSimilarShopsResult: {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          items: [
            { id: "shop_1", name: "Fashion Brand Y" },
            { id: "shop_2", name: "Style Brand Z" },
          ],
        }),
      },
    ],
  },
  errorResponse: {
    jsonrpc: "2.0",
    id: "ma-error",
    error: { code: -32600, message: "Invalid parameters" },
  },
};