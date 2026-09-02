import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MCPClient } from "../src/client.js";
import { MCPClientError } from "../src/types.js";
import {
  TRENDTRACK_TOOLS_RESPONSE,
  TIKTOK_ORGANIC_SEARCH_RESPONSE,
  ERROR_RESPONSE,
} from "./fixtures/responses.js";

/** Helper: create a mock fetch with a given JSON response. */
function mockFetch(
  response: Record<string, unknown>,
  status = 200,
): void {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () =>
      Promise.resolve(
        status >= 200 && status < 300 ? "ok" : JSON.stringify(response),
      ),
  } as Response);
}

describe("MCPClient", () => {
  let client: MCPClient;

  beforeEach(() => {
    client = new MCPClient({
      serverUrl: "https://trendtrack.example.com/mcp",
      apiKey: "test-key-123",
      retryMaxAttempts: 2,
      retryBaseDelayMs: 5, // very short for test speed
      timeoutMs: 5000,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("listTools", () => {
    it("fetches and returns tool definitions", async () => {
      mockFetch(TRENDTRACK_TOOLS_RESPONSE);

      const tools = await client.listTools();

      expect(tools).toHaveLength(2);
      expect(tools[0]!.name).toBe("search_tiktok_library");
      expect(tools[1]!.name).toBe("search_ads");
    });

    it("throws MCPClientError on HTTP error", async () => {
      mockFetch(ERROR_RESPONSE, 400);

      await expect(client.listTools()).rejects.toThrow(MCPClientError);
      await expect(client.listTools()).rejects.toThrow("HTTP 400");
    });

    it("throws MCPClientError on JSON-RPC error", async () => {
      mockFetch({
        jsonrpc: "2.0",
        id: "test-error",
        error: { code: -32600, message: "Invalid params" },
      });

      await expect(client.listTools()).rejects.toThrow(MCPClientError);
      await expect(client.listTools()).rejects.toThrow("Invalid params");
    });

    it("retries on transient errors", async () => {
      const fetchSpy = vi.fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(TRENDTRACK_TOOLS_RESPONSE),
          text: () => Promise.resolve("ok"),
        } as Response);

      globalThis.fetch = fetchSpy;

      const tools = await client.listTools();
      expect(tools).toHaveLength(2);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    }, 10_000);

    it("does not retry when all attempts exhausted", async () => {
      const fetchSpy = vi.fn().mockRejectedValue(new Error("Network error"));
      globalThis.fetch = fetchSpy;

      await expect(client.listTools()).rejects.toThrow("Network error");
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    }, 10_000);
  });

  describe("callTool", () => {
    it("invokes a tool and returns the parsed result", async () => {
      mockFetch(TIKTOK_ORGANIC_SEARCH_RESPONSE);

      const result = await client.callTool("search_tiktok_library", {
        type: "organic",
        keywords: ["trending"],
      });

      expect(result.content).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);
    });

    it("throws on unknown method (no retry for -32601)", async () => {
      mockFetch({
        jsonrpc: "2.0",
        id: "test-error",
        error: { code: -32601, message: "Method not found" },
      });

      await expect(
        client.callTool("nonexistent", {}),
      ).rejects.toThrow("Method not found");
    });
  });

  describe("close", () => {
    it("aborts in-flight requests", async () => {
      const abortSpy = vi.fn();

      globalThis.fetch = vi.fn().mockImplementation(
        (_url: string, opts: RequestInit) => {
          return new Promise<Response>((_resolve, reject) => {
            const signal = opts.signal as AbortSignal;
            if (signal) {
              signal.addEventListener("abort", () => {
                abortSpy();
                // Defer the rejection so expect().rejects can attach first
                queueMicrotask(() =>
                  reject(new DOMException("Aborted", "AbortError")),
                );
              });
            }
          });
        },
      );

      const callPromise = client.listTools();
      // Attach a noop catch to suppress the unhandled rejection warning.
      // Node emits unhandledRejection before expect().rejects can catch it.
      callPromise.catch(() => {});
      await new Promise((r) => setTimeout(r, 5));
      await client.close();
      await new Promise((r) => setTimeout(r, 10));

      expect(abortSpy).toHaveBeenCalled();
      await expect(callPromise).rejects.toThrow("Aborted");
    });
  });

  describe("error handling", () => {
    it("does not retry client errors (4xx non-429)", async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({
            jsonrpc: "2.0",
            id: "err",
            error: { code: -32000, message: "Forbidden" },
          }),
        text: () => Promise.resolve("Forbidden"),
      } as Response);

      globalThis.fetch = fetchSpy;

      await expect(client.listTools()).rejects.toThrow("HTTP 403");
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("handles empty result (no result, no error)", async () => {
      mockFetch({ jsonrpc: "2.0", id: "empty" });

      await expect(client.listTools()).rejects.toThrow("Empty response");
    });
  });
});