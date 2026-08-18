/**
 * GitHub Copilot-Native Content Synthesis
 * 
 * This module provides content synthesis WITHOUT external API dependencies.
 * It uses:
 * 1. Deterministic text processing as primary method
 * 2. WAAgriContextAgent for wiki grounding (when available)
 * 3. Structured prompts for GitHub Copilot Chat interactive enhancement
 * 
 * NO OPENAI_API_KEY REQUIRED - runs entirely on GitHub Copilot subscription.
 */

import type { LectureSubtopic, RetrievalResult, SlideContent } from "./types.ts";
import { studentBullets } from "./synthesis.ts";

/**
 * Synthesize slide content using deterministic + agent-enhanced approach.
 * 
 * This is the new default synthesis method that:
 * - Extracts bullets from YAML description (deterministic)
 * - Uses wiki context for grounding
 * - Generates speaker notes with provenance
 * - Does NOT require external API calls
 * 
 * @param subtopic - Lecture subtopic from YAML
 * @param provenance - Wiki retrieval results for grounding
 * @returns Complete slide content with provenance tracking
 */
export async function synthesiseSlideLocal(
  subtopic: LectureSubtopic,
  provenance: RetrievalResult[]
): Promise<SlideContent> {
  // Extract student-facing bullets from YAML description (deterministic)
  const bullets = studentBullets(subtopic.description, 4);
  
  // Generate speaker notes with wiki grounding
  const notes = generateSpeakerNotes(subtopic, provenance);
  
  return {
    title: subtopic.title,
    bullets: bullets.length > 0 ? bullets : [subtopic.description],
    notes,
    provenance,
    synthesis: "copilot-native"
  };
}

/**
 * Generate speaker notes from subtopic and wiki context.
 * 
 * Combines:
 * - Original YAML description (instructor intent)
 * - Wiki provenance (WA-specific grounding)
 * - Teaching guidance (if available from YAML)
 * 
 * @param subtopic - Lecture subtopic
 * @param provenance - Wiki sources used
 * @returns Formatted speaker notes
 */
function generateSpeakerNotes(
  subtopic: LectureSubtopic,
  provenance: RetrievalResult[]
): string {
  const sections: string[] = [];
  
  // 1. Core content from YAML
  sections.push("## Teaching Notes\n");
  sections.push(subtopic.description);
  
  // 2. Wiki grounding
  if (provenance.length > 0) {
    sections.push("\n\n## WA Agriculture Context\n");
    sections.push("This slide is grounded in the following WA-specific sources:\n");
    provenance.forEach(source => {
      sections.push(`- **${source.title}** (${source.slug}.md)`);
      sections.push(`  ${source.excerpt.slice(0, 150)}...`);
    });
  } else {
    sections.push("\n\n## Note\n");
    sections.push("⚠️ No high-confidence wiki match found. Verify content against lecture brief.");
  }
  
  // 3. Key concepts (if available)
  // This will be populated once YAML schema is enhanced
  
  return sections.join("\n");
}

/**
 * Generate a structured prompt for GitHub Copilot Chat to enhance content.
 * 
 * This is NOT called automatically - it's a helper for interactive enhancement
 * where an instructor uses Copilot Chat to improve slide content.
 * 
 * @param subtopic - Lecture subtopic
 * @param wikiContext - Retrieved wiki excerpts
 * @returns Formatted prompt for Copilot Chat
 */
export function generateCopilotPrompt(
  subtopic: LectureSubtopic,
  wikiContext: RetrievalResult[]
): string {
  const context = wikiContext
    .map(r => `SOURCE: ${r.title}\n${r.excerpt}`)
    .join("\n\n");
  
  return `Create a university lecture slide for SCIE3314 (Cropping Systems).

**Slide Title**: ${subtopic.title}

**Instructor Brief**:
${subtopic.description}

**WA Agriculture Context** (from local wiki):
${context || "No wiki sources found - use instructor brief only"}

**Task**:
Generate 3-5 student-facing bullet points that:
- Are complete, factual teaching statements (not questions or activities)
- Are grounded in the WA agriculture context above
- Use specific examples from Western Australian farming systems
- Are appropriate for undergraduate agriculture students

**Format**: Return JSON with:
\`\`\`json
{
  "bullets": ["statement 1", "statement 2", "statement 3"],
  "teaching_notes": "Brief guidance for instructor delivery"
}
\`\`\``;
}

/**
 * Check if GitHub Copilot enhancement is available.
 * 
 * @returns true if running in VS Code with Copilot, false otherwise
 */
export function isCopilotAvailable(): boolean {
  // In CLI context, Copilot is not directly available
  // This would be true in a VS Code extension context
  return false;
}

/**
 * Export deterministic synthesis as the default method.
 * 
 * This ensures the pipeline works WITHOUT any external dependencies.
 */
export { synthesiseSlideLocal as synthesiseSlide };
