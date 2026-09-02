import { z } from "zod";

/**
 * A tool definition as returned by the MCP server's listTools endpoint.
 */
export const ToolDefSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  inputSchema: z.record(z.unknown()).optional(),
});
export type ToolDef = z.infer<typeof ToolDefSchema>;

/**
 * The result of a tool invocation.
 * MCP standard returns content as an array of content items.
 */
export const ContentItemSchema = z.object({
  type: z.enum(["text", "image", "resource"]),
  text: z.string().optional(),
  mimeType: z.string().optional(),
  resource: z
    .object({
      uri: z.string(),
      mimeType: z.string().optional(),
      text: z.string().optional(),
    })
    .optional(),
});
export type ContentItem = z.infer<typeof ContentItemSchema>;

export const ToolResultSchema = z.object({
  content: z.array(ContentItemSchema),
  isError: z.boolean().optional(),
});
export type ToolResult = z.infer<typeof ToolResultSchema>;

/**
 * Error payload that the MCP server may return.
 */
export const MCPErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown().optional(),
});
export type MCPError = z.infer<typeof MCPErrorSchema>;

/**
 * JSON-RPC request envelope for the MCP protocol.
 */
export interface JSONRPCRequest {
  jsonrpc: "2.0";
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

/**
 * JSON-RPC response envelope.
 */
export interface JSONRPCResponse<T = unknown> {
  jsonrpc: "2.0";
  id: string;
  result?: T;
  error?: MCPError;
}

/**
 * Configuration for the MCP client.
 */
export interface MCPClientConfig {
  serverUrl: string;
  apiKey?: string;
  timeoutMs?: number;
  retryMaxAttempts?: number;
  retryBaseDelayMs?: number;
}

/**
 * Error thrown when the MCP client encounters a problem.
 */
export class MCPClientError extends Error {
  public code: number;
  public data?: unknown;

  constructor(code: number, message: string, data?: unknown) {
    super(message);
    this.name = "MCPClientError";
    this.code = code;
    this.data = data;
  }
}