import "server-only";
import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";

function getMcpUrl(): string {
  const url = process.env.SANITY_CONTEXT_MCP_URL;
  if (!url) {
    throw new Error("Missing environment variable: SANITY_CONTEXT_MCP_URL");
  }
  return url;
}

function getReadToken(): string {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_READ_TOKEN");
  }
  return token;
}

const CONNECT_RETRIES = 2;

export async function createSearchMcpClient(): Promise<MCPClient> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= CONNECT_RETRIES; attempt++) {
    try {
      return await createMCPClient({
        transport: {
          type: "http",
          url: getMcpUrl(),
          headers: {
            Authorization: `Bearer ${getReadToken()}`,
          },
        },
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function initialContextUrl(mcpUrl: string): string {
  const url = new URL(mcpUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/initial-context`;
  return url.toString();
}

let cachedInitialContext: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchInitialContext(): Promise<string | null> {
  const isStale = Date.now() - cacheTimestamp > CACHE_TTL_MS;
  if (!isStale && cachedInitialContext) return cachedInitialContext;

  try {
    const response = await fetch(initialContextUrl(getMcpUrl()), {
      headers: { Authorization: `Bearer ${getReadToken()}` },
    });
    if (!response.ok) return cachedInitialContext;

    cachedInitialContext = await response.text();
    cacheTimestamp = Date.now();
  } catch {
    return cachedInitialContext;
  }

  return cachedInitialContext;
}
