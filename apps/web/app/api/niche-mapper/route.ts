import { NextRequest, NextResponse } from "next/server";
import {
  NicheMapSchema,
  NICHE_MAPPER_SYSTEM_PROMPT,
  buildNicheMapperPrompt,
  type NicheMapperInput,
  type NicheMap,
} from "@viral-copilot/agent-contracts";
import { LLMClient } from "@viral-copilot/llm-gateway";

/**
 * POST /api/niche-mapper
 *
 * Calls the LLM (via OpenRouter or any OpenAI-compatible API) to generate
 * a structured niche map from the user's brief.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NicheMapperInput;

    // Validate required fields
    if (!body.marketName || !body.country || !body.language) {
      return NextResponse.json(
        { error: "marketName, country, and language are required" },
        { status: 400 },
      );
    }

    // Configure the LLM client from environment variables
    const baseUrl =
      process.env["LLM_BASE_URL"] ?? "https://openrouter.ai/api/v1";
    const apiKey = process.env["LLM_API_KEY"];
    const model = process.env["LLM_MODEL"] ?? "openai/gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json(
        { error: "LLM_API_KEY environment variable is not configured" },
        { status: 500 },
      );
    }

    const client = new LLMClient({
      baseUrl,
      apiKey,
      model,
      temperature: 0.3,
      maxTokens: 4096,
    });

    // Build the prompt
    const systemPrompt = NICHE_MAPPER_SYSTEM_PROMPT;
    const userPrompt = buildNicheMapperPrompt(body);

    // Call the LLM and parse the response
    const result = await client.generateJSON<NicheMap>(
      systemPrompt,
      userPrompt,
      { temperature: 0.3, responseFormat: "json_object" },
    );

    // Validate with Zod
    const parsed = NicheMapSchema.parse(result);

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error("Niche Mapper error:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unknown error generating niche map" },
      { status: 500 },
    );
  }
}