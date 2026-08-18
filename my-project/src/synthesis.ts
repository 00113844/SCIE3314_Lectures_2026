import type { LectureSubtopic, RetrievalResult, SlideContent } from "./types.ts";

/**
 * Synthesize slide content using GitHub Copilot-native approach.
 * 
 * NO EXTERNAL API DEPENDENCY - uses deterministic text processing + local wiki grounding.
 * For LLM enhancement, use GitHub Copilot Chat interactively with generateCopilotPrompt().
 * 
 * @param subtopic - Lecture subtopic from YAML
 * @param provenance - Wiki retrieval results
 * @returns Complete slide content
 */
export async function synthesiseSlide(subtopic: LectureSubtopic, provenance: RetrievalResult[]): Promise<SlideContent> {
  // Use deterministic extraction as primary method
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
 */
function generateSpeakerNotes(subtopic: LectureSubtopic, provenance: RetrievalResult[]): string {
  const sections: string[] = [];
  
  sections.push("## Teaching Notes\n");
  sections.push(subtopic.description);
  
  if (provenance.length > 0) {
    sections.push("\n\n## WA Agriculture Context\n");
    sections.push("Grounded in:\n");
    provenance.forEach(source => {
      sections.push(`- **${source.title}** (${source.slug}.md): ${source.excerpt.slice(0, 120)}...`);
    });
  } else {
    sections.push("\n\n⚠️ No high-confidence wiki match. Verify against lecture brief.");
  }
  
  return sections.join("\n");
}

/**
 * Generate a prompt for GitHub Copilot Chat to enhance slide content interactively.
 * 
 * This is NOT called automatically - instructors use this with Copilot Chat for
 * interactive content refinement.
 */
export function generateCopilotPrompt(subtopic: LectureSubtopic, provenance: RetrievalResult[]): string {
  const context = provenance.map(r => `SOURCE: ${r.title}\n${r.excerpt}`).join("\n\n");
  
  return `Create a university lecture slide for SCIE3314 (Cropping Systems).

**Slide Title**: ${subtopic.title}

**Instructor Brief**:
${subtopic.description}

**WA Agriculture Context**:
${context || "No wiki sources - use instructor brief only"}

**Task**: Generate 3-5 factual bullet points grounded in WA agriculture context.
**Format**: Return JSON with bullets array and teaching_notes string.`;
}

export function studentBullets(value: string, maximum = 3): string[] {
  const sentences = splitSentences(value);
  const factual = sentences.map(toStudentStatement).filter((sentence) => sentence.length > 24);
  return factual.slice(0, maximum).map((sentence) => shortenTeachingStatement(sentence, 190));
}

function toStudentStatement(value: string): string {
  const clean = cleanMarkdown(value);
  // YAML descriptions often start with author directions. If a colon introduces
  // the factual content, retain that content; otherwise remove the direction.
  const cue = /^(open|introduce|explain|discuss|emphasise|stress|situate|give|describe|conclude|frame|use|ask|show|compare|contrast|highlight|lay out)\b/i;
  if (cue.test(clean)) {
    const colon = clean.indexOf(":");
    return colon >= 0 ? clean.slice(colon + 1).trim() : "";
  }
  return clean.replace(/^(that|how|why)\s+/i, "").trim();
}

function cleanMarkdown(value: string): string { return value.replace(/^[-•]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/`/g, "").replace(/\s+/g, " ").trim(); }
function shortenTeachingStatement(value: string, max: number): string {
  if (value.length <= max) return value;
  const candidate = value.slice(0, max);
  const boundary = Math.max(candidate.lastIndexOf(";"), candidate.lastIndexOf(" — "), candidate.lastIndexOf(","));
  return `${(boundary > max * 0.45 ? candidate.slice(0, boundary) : candidate.slice(0, candidate.lastIndexOf(" "))).trimEnd()}.`;
}
function splitSentences(value: string): string[] { return value.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 18) ?? []; }
