/**
 * Agent Bridge - Integration with WAAgriContextAgent for wiki-grounded content
 * 
 * This module provides a bridge to invoke the WAAgriContextAgent defined in
 * .github/agents/WAAgriContextAgent.md for wiki corpus queries.
 * 
 * The agent returns structured results with:
 * - Direct answer to the query
 * - Source file references from wa_wiki/
 * - Traceability for provenance tracking
 */

import type { RetrievalResult } from "./types.ts";

export interface AgentResult {
  answer: string;
  sources: Array<{
    file: string;
    title: string;
    excerpt: string;
  }>;
  query: string;
}

/**
 * Query the WAAgriContextAgent for wiki-grounded information.
 * 
 * This is a placeholder implementation that simulates agent invocation.
 * In production, this would integrate with VS Code's agent API or
 * GitHub Copilot's workspace chat.
 * 
 * @param query - Natural language query about WA agriculture
 * @returns Structured result with answer and wiki sources
 */
export async function queryWAAgriContext(query: string): Promise<AgentResult> {
  // TODO: Integrate with actual agent invocation
  // For now, return a structured placeholder that signals the need for agent integration
  
  console.log(`[Agent Bridge] Query: "${query}"`);
  console.log("[Agent Bridge] Note: WAAgriContextAgent invocation requires VS Code extension context");
  console.log("[Agent Bridge] Falling back to direct wiki retrieval");
  
  // Return empty result to signal fallback to direct retrieval
  return {
    answer: "",
    sources: [],
    query
  };
}

/**
 * Convert agent result to retrieval results format for synthesis pipeline.
 * 
 * @param agentResult - Result from WAAgriContextAgent
 * @returns Array of retrieval results compatible with synthesis
 */
export function agentResultToRetrievalResults(agentResult: AgentResult): RetrievalResult[] {
  return agentResult.sources.map((source, index) => ({
    slug: source.file.replace(/\.md$/, "").replace(/^.*\//, ""),
    title: source.title,
    path: `data/wa_wiki/${source.file}`,
    heading: "Agent Retrieved",
    excerpt: source.excerpt,
    score: 100 - index // Higher score for earlier results
  }));
}

/**
 * Check if agent integration is available.
 * 
 * @returns true if agent can be invoked, false if fallback needed
 */
export function isAgentAvailable(): boolean {
  // In a VS Code extension context, this would check:
  // - VS Code API availability
  // - Agent registration
  // - Workspace configuration
  
  // For CLI usage, agent is not directly available
  return false;
}

/**
 * Query with automatic fallback to direct retrieval if agent unavailable.
 * 
 * @param query - Natural language query
 * @param fallbackFn - Function to call if agent unavailable
 * @returns Agent result or fallback result
 */
export async function queryWithFallback<T>(
  query: string,
  fallbackFn: (query: string) => Promise<T>
): Promise<AgentResult | T> {
  if (!isAgentAvailable()) {
    console.log("[Agent Bridge] Agent unavailable, using fallback");
    return fallbackFn(query);
  }
  
  try {
    const result = await queryWAAgriContext(query);
    if (result.sources.length > 0) {
      return result;
    }
    // Empty result, use fallback
    console.log("[Agent Bridge] Agent returned empty, using fallback");
    return fallbackFn(query);
  } catch (error) {
    console.error("[Agent Bridge] Agent invocation failed:", error);
    return fallbackFn(query);
  }
}
