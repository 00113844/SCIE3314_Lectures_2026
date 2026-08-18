import { buildCorpusIndex, retrieve } from "./src/retrieval.ts";
import { parseLectureYaml } from "./src/yaml.ts";
import { readFile } from "node:fs/promises";
const corpus = await buildCorpusIndex("data/wa_wiki");
const source = await readFile("data/YAML/L01_Introduction_to_Cropping_Systems.yaml", "utf8");
const lecture = parseLectureYaml(source, "L01");
console.log(`Parsed OK: ${lecture.subtopics.length} subtopics\n`);
for (const sub of lecture.subtopics) {
  const query = sub.wiki_query?.trim() || `${lecture.topic} ${sub.title} ${sub.description}`;
  const usingWikiQuery = Boolean(sub.wiki_query?.trim());
  const results = retrieve(corpus, query, 2);
  console.log(`${sub.title}`);
  console.log(`  key_concepts (${sub.key_concepts?.length ?? 0}): ${JSON.stringify(sub.key_concepts)}`);
  console.log(`  query source: ${usingWikiQuery ? "wiki_query" : "fallback(topic+title+description)"}`);
  console.log(`  top match: ${results[0] ? `${results[0].slug} (score ${results[0].score})` : "NONE"}`);
  console.log();
}
