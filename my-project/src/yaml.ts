import type { Lecture, LectureSubtopic } from "./types.ts";

/** Minimal, deliberately strict parser for the SCIE3314 lecture YAML contract. */
export function parseLectureYaml(source: string, sourceName = "lecture YAML"): Lecture {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const root: Record<string, unknown> = {};
  const subtopics: LectureSubtopic[] = [];
  let current: Partial<LectureSubtopic> | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const top = /^(topic|auto_figures):\s*(.*)$/.exec(trimmed);
    if (top) {
      root[top[1]] = parseScalar(top[2]);
      continue;
    }
    if (trimmed === "subtopics:") continue;

    const item = /^-\s+title:\s*(.*)$/.exec(trimmed);
    if (item) {
      if (current) subtopics.push(validateSubtopic(current, sourceName));
      current = { title: String(parseScalar(item[1])) };
      continue;
    }

    const property = /^(title|description|figure_id|image_prompt|wiki_query|figure_source):\s*(.*)$/.exec(trimmed);
    if (property) {
      const [, key, value] = property;
      if (value === ">" || value === "|") {
        const folded: string[] = [];
        const propertyIndent = raw.length - raw.trimStart().length;
        while (index + 1 < lines.length && (!lines[index + 1].trim() || indentation(lines[index + 1]) > propertyIndent)) {
          index += 1;
          const continuation = lines[index];
          if (!continuation.trim()) { folded.push(""); continue; }
          folded.push(continuation.trim());
        }
        current[key] = value === ">" ? folded.join(" ").replace(/\s+/g, " ").trim() : folded.join("\n");
      } else {
        current[key] = String(parseScalar(value));
      }
      continue;
    }
    
    // Handle key_concepts array
    const array = /^key_concepts:\s*$/.exec(trimmed);
    if (array) {
      const items: string[] = [];
      const arrayIndent = raw.length - raw.trimStart().length;
      while (index + 1 < lines.length && (!lines[index + 1].trim() || indentation(lines[index + 1]) > arrayIndent)) {
        index += 1;
        const item = lines[index].trim();
        if (!item) continue;
        const listItem = /^-\s+(.+)$/.exec(item);
        if (listItem) {
          items.push(listItem[1].replace(/^["']|["']$/g, ""));
        }
      }
      current.key_concepts = items;
      continue;
    }
    
    if (!current) {
      throw new Error(`${sourceName}:${index + 1}: expected a lecture field or subtopic item`);
    }
  }
  if (current) subtopics.push(validateSubtopic(current, sourceName));
  const lecture = { topic: root.topic, auto_figures: root.auto_figures, subtopics };
  return validateLecture(lecture, sourceName);
}

function indentation(value: string): number { return value.length - value.trimStart().length; }

function parseScalar(value: string): string | boolean {
  const unquoted = value.trim();
  if (unquoted === "true") return true;
  if (unquoted === "false") return false;
  if ((unquoted.startsWith('"') && unquoted.endsWith('"')) || (unquoted.startsWith("'") && unquoted.endsWith("'"))) {
    return unquoted.slice(1, -1).replace(/\\"/g, '"');
  }
  return unquoted;
}

function validateSubtopic(value: Partial<LectureSubtopic>, sourceName: string): LectureSubtopic {
  if (!value.title?.trim() || !value.description?.trim()) {
    throw new Error(`${sourceName}: every subtopic requires a non-empty title and description`);
  }
  return value as LectureSubtopic;
}

export function validateLecture(value: { topic: unknown; auto_figures: unknown; subtopics: LectureSubtopic[] }, sourceName: string): Lecture {
  if (typeof value.topic !== "string" || !value.topic.trim()) throw new Error(`${sourceName}: 'topic' must be a non-empty string`);
  if (typeof value.auto_figures !== "boolean") throw new Error(`${sourceName}: 'auto_figures' must be true or false`);
  if (!Array.isArray(value.subtopics) || value.subtopics.length === 0) throw new Error(`${sourceName}: 'subtopics' must contain at least one item`);
  return { topic: value.topic, auto_figures: value.auto_figures, subtopics: value.subtopics };
}
