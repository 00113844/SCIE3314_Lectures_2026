export interface LectureSubtopic {
  title: string;
  description: string;
  figure_id?: string;
  image_prompt?: string;
  
  // Enhanced fields for v1.0 (GitHub Copilot-native)
  key_concepts?: string[];          // 3-5 student learning targets (human-curated)
  wiki_query?: string;              // Natural language query for WAAgriContextAgent
  figure_source?: "literature" | "manual" | "none";  // Source strategy for figures
}

export interface Lecture {
  topic: string;
  auto_figures: boolean;
  subtopics: LectureSubtopic[];
}

export interface CorpusDocument {
  slug: string;
  title: string;
  tags: string[];
  path: string;
  chunks: CorpusChunk[];
}

export interface CorpusChunk {
  id: string;
  heading: string;
  text: string;
  terms: string[];
}

export interface RetrievalResult {
  slug: string;
  title: string;
  path: string;
  heading: string;
  excerpt: string;
  score: number;
}

export interface SlideContent {
  title: string;
  bullets: string[];
  notes: string;
  provenance: RetrievalResult[];
  synthesis: "llm" | "grounded-fallback" | "copilot-native";
}
