import test from "node:test";
import assert from "node:assert/strict";
import { parseLectureYaml } from "../src/yaml.ts";
import { retrieve } from "../src/retrieval.ts";
import { studentBullets } from "../src/synthesis.ts";

test("parses the SCIE3314 lecture contract", () => {
  const lecture = parseLectureYaml('topic: "Example"\nauto_figures: false\nsubtopics:\n  - title: "One"\n    description: >\n      A useful description.\n');
  assert.equal(lecture.topic, "Example"); assert.equal(lecture.subtopics[0].description, "A useful description.");
});
test("retrieval ranks matching corpus chunks", () => {
  const results = retrieve([{ slug: "canola", title: "Canola management", tags: ["canola"], path: "data/wa_wiki/canola.md", chunks: [{ id: "1", heading: "Blackleg", text: "Canola disease management", terms: ["canola", "disease", "management"] }] }], "canola disease");
  assert.equal(results[0].slug, "canola");
});

test("student bullets remove presenter directions and retain factual claims", () => {
  const bullets = studentBullets("Open by resolving the paradox: Australia exports most of the grain it produces. Explain the implications. Large farms use mechanisation to lower labour requirements per hectare.");
  assert.deepEqual(bullets, ["Australia exports most of the grain it produces.", "Large farms use mechanisation to lower labour requirements per hectare."]);
});
