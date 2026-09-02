import { z } from "zod";

/**
 * Provider configuration for an OpenAI-compatible API.
 */
export interface LLMProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * A generic message in chat format.
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Request to the LLM API.
 */
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  response_format?: {
    type: "json_object" | "text";
  };
}

/**
 * Response from the LLM API.
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: "assistant";
      content: string | null;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * LLM generation options.
 */
export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  responseFormat?: "json_object" | "text";
}

/**
 * LLM call result.
 */
export interface LLMResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null;
}

/**
 * Error from the LLM gateway.
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly provider?: string,
  ) {
    super(message);
    this.name = "LLMError";
  }
}