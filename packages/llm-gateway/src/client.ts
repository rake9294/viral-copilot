import type {
  LLMProviderConfig,
  ChatMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
  GenerateOptions,
  LLMResult,
} from "./types.js";
import { LLMError } from "./types.js";

/**
 * OpenAI-compatible LLM client.
 */
export class LLMClient {
  private config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  /**
   * Send a chat completion and return the generated content.
   */
  async generate(
    messages: ChatMessage[],
    options: GenerateOptions = {},
  ): Promise<LLMResult> {
    const body: ChatCompletionRequest = {
      model: this.config.model,
      messages,
      max_tokens: options.maxTokens ?? this.config.maxTokens,
      temperature: options.temperature ?? this.config.temperature,
    };

    if (options.responseFormat) {
      body.response_format = { type: options.responseFormat };
    }

    const url = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new LLMError(
        `Network error: ${err instanceof Error ? err.message : String(err)}`,
        undefined,
        this.config.model,
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "unknown error");
      throw new LLMError(
        `API error ${response.status}: ${errorText}`,
        response.status,
        this.config.model,
      );
    }

    let data: ChatCompletionResponse;
    try {
      data = (await response.json()) as ChatCompletionResponse;
    } catch (err) {
      throw new LLMError(
        `Failed to parse response: ${err instanceof Error ? err.message : String(err)}`,
        response.status,
        this.config.model,
      );
    }

    const choice = data.choices[0];
    if (!choice?.message?.content) {
      throw new LLMError(
        `No content in response (finish_reason: ${choice?.finish_reason ?? "unknown"})`,
        response.status,
        this.config.model,
      );
    }

    return {
      content: choice.message.content,
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : null,
    };
  }

  /**
   * Generate JSON by requesting the model to output JSON.
   */
  async generateJSON<T>(
    systemPrompt: string,
    userPrompt: string,
    options: GenerateOptions = {},
  ): Promise<T> {
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const result = await this.generate(messages, {
      ...options,
      responseFormat: "json_object",
    });

    try {
      return JSON.parse(result.content) as T;
    } catch (err) {
      throw new LLMError(
        `Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`,
        undefined,
        this.config.model,
      );
    }
  }

  /**
   * Create a new client with a different config.
   */
  withConfig(config: Partial<LLMProviderConfig>): LLMClient {
    return new LLMClient({ ...this.config, ...config });
  }
}