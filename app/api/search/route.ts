import { groq } from "@ai-sdk/groq";
import { generateText, stepCountIs } from "ai";

import { groundHits } from "@/lib/search/ground";
import { createSearchMcpClient, fetchInitialContext } from "@/lib/search/mcp";
import { buildSystemPrompt } from "@/lib/search/system-prompt";
import {
  ModelOutputSchema,
  SearchRequestSchema,
  type ModelOutput,
  type SearchResponse,
} from "@/lib/search/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_STEPS = 6;
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const RUN_RETRIES = 1;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text.trim();
}

/**
 * Runs the tool loop once. The model occasionally misbehaves (hallucinated
 * tool calls, malformed JSON) — the caller retries this whole run rather
 * than trying to patch a broken response.
 */
async function runSearchOnce(query: string): Promise<ModelOutput> {
  const [mcpClient, initialContext] = await Promise.all([
    createSearchMcpClient(),
    fetchInitialContext(),
  ]);

  try {
    const allMcpTools = await mcpClient.tools();
    const { initial_context: _initialContextTool, ...mcpTools } = allMcpTools;

    const systemPrompt = buildSystemPrompt(initialContext);
    const modelId = process.env.GROQ_SEARCH_MODEL || DEFAULT_MODEL;

    // Groq's API rejects combining tool calling with JSON/schema mode in one
    // request, so the model is instructed (system-prompt.ts) to end its own
    // tool loop with a plain-text JSON object matching ModelOutputSchema,
    // which is parsed and validated here instead of using `output`/`generateObject`.
    const toolLoopResult = await generateText({
      model: groq(modelId),
      system: systemPrompt,
      prompt: query,
      tools: mcpTools,
      stopWhen: stepCountIs(MAX_STEPS),
    });

    const rawOutput: unknown = JSON.parse(extractJson(toolLoopResult.text));
    const parsedOutput = ModelOutputSchema.parse(rawOutput);
    return parsedOutput;
  } finally {
    await mcpClient.close();
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedRequest = SearchRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return Response.json({ error: "Invalid search request" }, { status: 400 });
  }
  const { query, sort } = parsedRequest.data;

  if (!process.env.SANITY_CONTEXT_MCP_URL) {
    return Response.json({ error: "Search is not configured" }, { status: 500 });
  }
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "Search is not configured" }, { status: 500 });
  }

  let modelOutput: ModelOutput | null = null;
  let lastError: unknown;

  for (let attempt = 0; attempt <= RUN_RETRIES; attempt++) {
    try {
      modelOutput = await runSearchOnce(query);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!modelOutput) {
    console.error("[search] request failed", lastError);
    return Response.json({ error: "Search failed" }, { status: 502 });
  }

  try {
    const results = await groundHits(modelOutput.hits, sort);
    const courseCount = new Set(results.map((item) => item.courseSlug)).size;

    const response: SearchResponse = {
      query,
      sort,
      count: results.length,
      courseCount,
      reply: modelOutput.reply,
      results,
    };

    return Response.json(response);
  } catch (error) {
    console.error("[search] grounding failed", error);
    return Response.json({ error: "Search failed" }, { status: 502 });
  }
}
