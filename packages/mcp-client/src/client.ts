import {
  MCPClientConfig,
  MCPClientError,
  JSONRPCRequest,
  JSONRPCResponse,
  ToolDef,
  ToolDefSchema,
  ToolResult,
  ToolResultSchema,
} from "./types.js";

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_MAX = 3;
const DEFAULT_RETRY_BASE_DELAY_MS = 500;

/**
 * A generic MCP client that connects to an MCP server via Streamable HTTP.
 *
 * Implements the Model Context Protocol for tool discovery and invocation.
 * Handles JSON-RPC 2.0 envelopes, retries with exponential backoff, and
 * timeouts.
 */
export class MCPClient {
  private readonly serverUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly retryMaxAttempts: number;
  private readonly retryBaseDelayMs: number;
  private readonly headers: Record<string, string>;
  private abortController: AbortController | null = null;

  constructor(config: MCPClientConfig) {
    this.serverUrl = config.serverUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.retryMaxAttempts = config.retryMaxAttempts ?? DEFAULT_RETRY_MAX;
    this.retryBaseDelayMs = config.retryBaseDelayMs ?? DEFAULT_RETRY_BASE_DELAY_MS;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
    };
  }

  /**
   * List available tools from the MCP server.
   */
  async listTools(): Promise<ToolDef[]> {
    return this.sendRequest<ToolDef[]>("tools/list", undefined, (raw) => {
      const tools = raw as unknown[];
      return tools.map((t) => ToolDefSchema.parse(t));
    });
  }

  /**
   * Call a tool on the MCP server.
   */
  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<ToolResult> {
    return this.sendRequest<ToolResult>(
      "tools/call",
      { name, arguments: args },
      (raw) => ToolResultSchema.parse(raw),
    );
  }

  /**
   * Close the client and abort any in-flight requests.
   */
  async close(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private generateId(): string {
    return `mcp-${crypto.randomUUID()}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async sendRequest<T>(
    method: string,
    params: Record<string, unknown> | undefined,
    parse: (raw: unknown) => T,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryMaxAttempts; attempt++) {
      try {
        return await this.attemptRequest<T>(method, params, parse);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        // Don't retry client-side abort or non-retryable HTTP codes
        if (err instanceof MCPClientError) {
          if (err.code === -32700 || err.code === -32600 || err.code === -32601) {
            throw err;
          }
          if (err.code >= 400 && err.code < 500 && err.code !== 429) {
            throw err;
          }
        }

        if (err instanceof DOMException && err.name === "AbortError") {
          throw err;
        }

        if (attempt < this.retryMaxAttempts - 1) {
          const delay = this.retryBaseDelayMs * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError ?? new Error(`Request failed after ${this.retryMaxAttempts} attempts`);
  }

  private async attemptRequest<T>(
    method: string,
    params: Record<string, unknown> | undefined,
    parse: (raw: unknown) => T,
  ): Promise<T> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const timeoutHandle = setTimeout(() => this.abortController?.abort(), this.timeoutMs);

    try {
      const body: JSONRPCRequest = {
        jsonrpc: "2.0",
        id: this.generateId(),
        method,
        ...(params ? { params } : {}),
      };

      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "unknown error");
        throw new MCPClientError(
          response.status,
          `HTTP ${response.status}: ${errorBody}`,
        );
      }

      const json = (await response.json()) as JSONRPCResponse<unknown>;

      if (json.error) {
        throw new MCPClientError(json.error.code, json.error.message, json.error.data);
      }

      if (json.result === undefined) {
        throw new MCPClientError(-32000, "Empty response: no result and no error");
      }

      return parse(json.result);
    } finally {
      clearTimeout(timeoutHandle);
      this.abortController = null;
    }
  }
}