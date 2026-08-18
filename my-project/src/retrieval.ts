import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import type { CorpusChunk, CorpusDocument, RetrievalResult } from "./types.ts";
import { queryWAAgriContext, agentResultToRetrievalResults, isAgentAvailable } from "./agent-bridge.ts";

const STOP_WORDS = new Set("a an and are as at be by for from in into is it of on or that the this to with what how when where why about across using use".split(" "));

export async function buildCorpusIndex(corpusDir: string): Promise<CorpusDocument[]> {
  const indexPath = join(corpusDir, "index.md");
  const index = await readFile(indexPath, "utf8");
  const metadata = new Map<string, { title: string; tags: string[] }>();
  for (const line of index.split(/\r?\n/)) {
    const match = /^\| \[([^\]]+)\]\(([^)]+)\) \| ([^|]+) \| ([^|]+) \|/.exec(line);
    if (match) metadata.set(match[2], { title: match[3].trim(), tags: normalizeTerms(match[4]) });
  }
  const files = (await readdir(corpusDir)).filter((file) => file.endsWith(".md") && !["index.md", "log.md"].includes(file)).sort();
  return Promise.all(files.map(async (file) => {
    const text = await readFile(join(corpusDir, file), "utf8");
    const info = metadata.get(file);
    const title = info?.title ?? firstHeading(text) ?? basename(file, ".md").replaceAll("_", " ");
    return { slug: basename(file, ".md"), title, tags: info?.tags ?? [], path: `data/wa_wiki/${file}`, chunks: chunkDocument(text, file) };
  }));
}

export function retrieve(corpus: CorpusDocument[], query: string, topK = 3): RetrievalResult[] {
  const queryTerms = new Set(normalizeTerms(query));
  return corpus.flatMap((document) => document.chunks.map((chunk) => {
    const overlap = chunk.terms.filter((term) => queryTerms.has(term)).length;
    const titleBonus = normalizeTerms(`${document.title} ${document.tags.join(" ")}`).filter((term) => queryTerms.has(term)).length * 2;
    return { slug: document.slug, title: document.title, path: document.path, heading: chunk.heading, excerpt: shorten(chunk.text, 520), score: overlap + titleBonus };
  })).filter((result) => result.score > 0).sort((a, b) => b.score - a.score || a.path.localeCompare(b.path)).slice(0, topK);
}

/**
 * Enhanced retrieval with optional WAAgriContextAgent integration.
 * 
 * If useAgent=true and agent is available, queries the agent first and merges
 * results with direct corpus search for comprehensive coverage.
 * 
 * @param corpus - Wiki corpus index
 * @param query - Search query
 * @param topK - Number of results to return
 * @param useAgent - Whether to try agent-enhanced retrieval
 * @returns Retrieval results (agent + direct, deduplicated)
 */
export async function retrieveEnhanced(
  corpus: CorpusDocument[],
  query: string,
  topK = 3,
  useAgent = true
): Promise<RetrievalResult[]> {
  const directResults = retrieve(corpus, query, topK);
  
  // If agent not requested or unavailable, return direct results
  if (!useAgent || !isAgentAvailable()) {
    return directResults;
  }
  
  try {
    // Query agent for additional context
    const agentResult = await queryWAAgriContext(query);
    const agentResults = agentResultToRetrievalResults(agentResult);
    
    if (agentResults.length === 0) {
      return directResults;
    }
    
    // Merge and deduplicate by slug
    const seen = new Set<string>();
    const merged: RetrievalResult[] = [];
    
    // Prioritize agent results (higher quality)
    for (const result of agentResults) {
      if (!seen.has(result.slug)) {
        merged.push(result);
        seen.add(result.slug);
      }
    }
    
    // Add direct results that weren't already included
    for (const result of directResults) {
      if (!seen.has(result.slug)) {
        merged.push(result);
        seen.add(result.slug);
      }
    }
    
    return merged.slice(0, topK);
  } catch (error) {
    console.error("[Retrieval] Agent query failed, using direct results:", error);
    return directResults;
  }
}

function chunkDocument(text: string, id: string): CorpusChunk[] {
  const parts = text.split(/(?=^#{1,3}\s)/m).filter((part) => part.trim());
  return parts.map((part, index) => {
    const [firstLine, ...body] = part.split(/\r?\n/);
    const heading = firstLine.replace(/^#+\s*/, "").trim() || "Overview";
    const content = body.join(" ").replace(/\s+/g, " ").trim() || part.replace(/\s+/g, " ").trim();
    return { id: `${id}#${index + 1}`, heading, text: content, terms: normalizeTerms(`${heading} ${content}`) };
  });
}

function firstHeading(text: string): string | undefined { return /^#\s+(.+)$/m.exec(text)?.[1]?.trim(); }
function shorten(value: string, max: number): string { return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`; }
export function normalizeTerms(value: string): string[] { return [...new Set(value.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((term) => term.length > 2 && !STOP_WORDS.has(term)))]; }
