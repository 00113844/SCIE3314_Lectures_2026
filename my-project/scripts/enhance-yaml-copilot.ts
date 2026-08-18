#!/usr/bin/env node --experimental-strip-types
/**
 * YAML Enhancement Script - Batch add key_concepts, wiki_query, figure_source
 * 
 * This script processes L01-L14 YAML files and adds:
 * 1. key_concepts - extracted from description (3-5 concepts)
 * 2. wiki_query - generated from title + key terms
 * 3. figure_source - set based on existing figure_id
 * 
 * Usage:
 *   node --experimental-strip-types scripts/enhance-yaml-copilot.ts [--dry-run] [--lecture L01]
 * 
 * Options:
 *   --dry-run    Show changes without writing files
 *   --lecture    Process only specified lecture (e.g., L01)
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, basename } from "node:path";

interface EnhancedSubtopic {
  title: string;
  description: string;
  figure_id?: string;
  image_prompt?: string;
  key_concepts?: string[];
  wiki_query?: string;
  figure_source?: "literature" | "manual" | "none";
}

/**
 * Extract key concepts from subtopic description.
 * 
 * Heuristics:
 * - Look for capitalized terms
 * - Extract definitions (X is Y patterns)
 * - Find enumerated items (1., 2., etc.)
 * - Look for "key", "important", "must" phrases
 */
function extractKeyConcepts(title: string, description: string): string[] {
  const concepts: string[] = [];
  
  // Extract from title (always include core topic)
  const titleConcept = title.replace(/^(What is|How to|Understanding|The)\s+/i, "").trim();
  if (titleConcept.length > 5 && titleConcept.length < 60) {
    concepts.push(titleConcept);
  }
  
  // Find definitions (X is Y, X refers to, X means)
  const definitionPattern = /([A-Z][a-zA-Z\s-]{3,40})\s+(is|refers to|means|represents)\s+([^.!?]{10,80})/g;
  let match;
  while ((match = definitionPattern.exec(description)) !== null) {
    const term = match[1].trim();
    if (term.length > 5 && !concepts.includes(term)) {
      concepts.push(term);
    }
  }
  
  // Find capitalized terms (potential concepts)
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g;
  const seenTerms = new Set<string>();
  while ((match = capitalizedPattern.exec(description)) !== null) {
    const term = match[1];
    if (term.length > 8 && term.length < 50 && !seenTerms.has(term)) {
      seenTerms.add(term);
      // Only add if it appears multiple times or is in title
      if (description.split(term).length > 2 || title.includes(term)) {
        if (!concepts.includes(term) && concepts.length < 5) {
          concepts.push(term);
        }
      }
    }
  }
  
  // Ensure we have at least 2 concepts
  if (concepts.length === 0) {
    concepts.push(titleConcept || "Core concept from description");
  }
  if (concepts.length === 1) {
    // Extract first meaningful phrase
    const firstSentence = description.split(/[.!?]/)[0];
    if (firstSentence && firstSentence.length > 10 && firstSentence.length < 70) {
      concepts.push(firstSentence.trim().replace(/^(Open|Introduce|Explain|Discuss|Emphasise)\s+/i, ""));
    }
  }
  
  // Limit to 5 concepts
  return concepts.slice(0, 5);
}

/**
 * Generate wiki query from title and key concepts.
 * 
 * Focuses on WA agriculture context.
 */
function generateWikiQuery(title: string, concepts: string[]): string {
  // Extract key terms from title
  const keyTerms = title
    .toLowerCase()
    .replace(/^(what is|how to|understanding|the|introduction to)\s+/i, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(term => term.length > 3)
    .slice(0, 4);
  
  // Add first concept term if not overlapping
  if (concepts.length > 0) {
    const conceptTerms = concepts[0].toLowerCase().split(/\s+/).filter(t => t.length > 3);
    for (const term of conceptTerms) {
      if (!keyTerms.includes(term) && keyTerms.length < 5) {
        keyTerms.push(term);
      }
    }
  }
  
  return keyTerms.join(" ");
}

/**
 * Determine figure source based on existing figure_id.
 */
function determineFigureSource(figureId?: string, imagePrompt?: string): "literature" | "manual" | "none" {
  if (!figureId && !imagePrompt) return "none";
  
  // Check if prompt suggests diagram or concept (could be Mermaid later)
  if (imagePrompt && (
    imagePrompt.includes("flowchart") ||
    imagePrompt.includes("diagram") ||
    imagePrompt.includes("concept map")
  )) {
    return "manual"; // Placeholder for future Mermaid
  }
  
  // Default: literature-based for actual figures
  return "literature";
}

/**
 * Enhance a single subtopic with new fields.
 */
function enhanceSubtopic(subtopic: any): EnhancedSubtopic {
  const enhanced: EnhancedSubtopic = {
    title: subtopic.title,
    description: subtopic.description
  };
  
  if (subtopic.figure_id) enhanced.figure_id = subtopic.figure_id;
  if (subtopic.image_prompt) enhanced.image_prompt = subtopic.image_prompt;
  
  // Add new fields
  enhanced.key_concepts = extractKeyConcepts(subtopic.title, subtopic.description);
  enhanced.wiki_query = generateWikiQuery(subtopic.title, enhanced.key_concepts);
  enhanced.figure_source = determineFigureSource(subtopic.figure_id, subtopic.image_prompt);
  
  return enhanced;
}

/**
 * Format subtopic as YAML (preserving structure).
 */
function formatSubtopicYAML(subtopic: EnhancedSubtopic, isFirst: boolean): string {
  const lines: string[] = [];
  
  lines.push(`${isFirst ? "" : "\n"}  - title: "${subtopic.title}"`);
  
  // Description as folded scalar
  lines.push("    description: >");
  const descLines = subtopic.description.split("\n").map(l => l.trim()).filter(l => l);
  descLines.forEach(line => {
    lines.push(`      ${line}`);
  });
  
  // Optional existing fields
  if (subtopic.figure_id) {
    lines.push(`    figure_id: "${subtopic.figure_id}"`);
  }
  if (subtopic.image_prompt) {
    lines.push("    image_prompt: >");
    subtopic.image_prompt.split("\n").forEach(line => {
      lines.push(`      ${line.trim()}`);
    });
  }
  
  // NEW: Enhanced fields
  if (subtopic.key_concepts && subtopic.key_concepts.length > 0) {
    lines.push("    key_concepts:");
    subtopic.key_concepts.forEach(concept => {
      lines.push(`      - "${concept}"`);
    });
  }
  
  if (subtopic.wiki_query) {
    lines.push(`    wiki_query: "${subtopic.wiki_query}"`);
  }
  
  if (subtopic.figure_source && subtopic.figure_source !== "none") {
    lines.push(`    figure_source: "${subtopic.figure_source}"`);
  }
  
  return lines.join("\n");
}

/**
 * Process a single lecture YAML file.
 */
async function processLecture(filePath: string, dryRun: boolean): Promise<void> {
  console.log(`\n📝 Processing ${basename(filePath)}...`);
  
  const content = await readFile(filePath, "utf8");
  
  // Parse YAML manually (simple approach for this script)
  const lines = content.split("\n");
  let topic = "";
  let autoFigures = false;
  const subtopics: any[] = [];
  let currentSubtopic: any = null;
  let currentField = "";
  let foldedContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith("topic:")) {
      topic = trimmed.replace(/^topic:\s*["']?/, "").replace(/["']$/, "");
    } else if (trimmed.startsWith("auto_figures:")) {
      autoFigures = trimmed.includes("true");
    } else if (trimmed === "subtopics:") {
      // Start of subtopics
    } else if (/^-\s+title:/.test(trimmed)) {
      // Save previous subtopic
      if (currentSubtopic) {
        if (currentField && foldedContent.length > 0) {
          currentSubtopic[currentField] = foldedContent.join(" ").trim();
        }
        subtopics.push(currentSubtopic);
      }
      // Start new subtopic
      currentSubtopic = { title: trimmed.replace(/^-\s+title:\s*["']?/, "").replace(/["']$/, "") };
      currentField = "";
      foldedContent = [];
    } else if (currentSubtopic && /^\s{4}(title|description|figure_id|image_prompt):/.test(line)) {
      // Save previous field
      if (currentField && foldedContent.length > 0) {
        currentSubtopic[currentField] = foldedContent.join(" ").trim();
      }
      
      const match = /^\s{4}(\w+):\s*(.*)$/.exec(line);
      if (match) {
        currentField = match[1];
        const value = match[2].trim();
        if (value === ">" || value === "|") {
          foldedContent = [];
        } else if (value) {
          currentSubtopic[currentField] = value.replace(/^["']|["']$/g, "");
          currentField = "";
        }
      }
    } else if (currentField && line.trim() && /^\s{6}/.test(line)) {
      // Continuation of folded content
      foldedContent.push(line.trim());
    }
  }
  
  // Save last subtopic
  if (currentSubtopic) {
    if (currentField && foldedContent.length > 0) {
      currentSubtopic[currentField] = foldedContent.join(" ").trim();
    }
    subtopics.push(currentSubtopic);
  }
  
  console.log(`  Found ${subtopics.length} subtopics`);
  
  // Enhance subtopics
  const enhanced = subtopics.map(s => enhanceSubtopic(s));
  
  // Show sample
  console.log(`\n  ✨ Sample enhancement for "${enhanced[0]?.title}":  `);
  console.log(`     - Key concepts: ${enhanced[0]?.key_concepts?.join(", ")}`);
  console.log(`     - Wiki query: "${enhanced[0]?.wiki_query}"`);
  console.log(`     - Figure source: ${enhanced[0]?.figure_source}`);
  
  // Generate new YAML
  const newYAML = [
    `topic: "${topic}"`,
    `auto_figures: ${autoFigures}`,
    "subtopics:",
    "",
    ...enhanced.map((sub, i) => formatSubtopicYAML(sub, i === 0))
  ].join("\n");
  
  if (dryRun) {
    console.log("\n  🔍 DRY RUN - Changes not written");
  } else {
    await writeFile(filePath, newYAML, "utf8");
    console.log(`  ✅ Enhanced YAML written to ${basename(filePath)}`);
  }
}

/**
 * Main execution.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const lectureFilter = args.find(arg => /^L\d{2}$/.test(arg));
  
  console.log("🚀 YAML Enhancement Script - GitHub Copilot Native\n");
  console.log(`Mode: ${dryRun ? "DRY RUN (no files written)" : "WRITE MODE"}`);
  if (lectureFilter) {
    console.log(`Filter: ${lectureFilter} only`);
  }
  
  const yamlDir = join(process.cwd(), "data", "YAML");
  const files = await readdir(yamlDir);
  const lectures = files
    .filter(f => /^L\d{2}_.*\.yaml$/.test(f))
    // Include " - Copy" files (L09, L10 legacy naming)
    .filter(f => !lectureFilter || f.startsWith(lectureFilter));
  
  console.log(`\nFound ${lectures.length} lecture file(s) to process\n`);
  console.log("─".repeat(60));
  
  for (const file of lectures) {
    await processLecture(join(yamlDir, file), dryRun);
  }
  
  console.log("\n" + "─".repeat(60));
  console.log(`\n✅ Complete! Processed ${lectures.length} lecture(s)`);
  
  if (dryRun) {
    console.log("\n💡 Run without --dry-run to write changes to files");
  } else {
    console.log("\n💡 Verify changes with: git diff data/YAML/");
    console.log("💡 Test generation with: npm run generate:lecture -- --input data/YAML/L01_Introduction_to_Cropping_Systems.yaml");
  }
}

main().catch(error => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});
