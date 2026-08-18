import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { parseLectureYaml } from "./yaml.ts";
import { buildCorpusIndex, retrieve } from "./retrieval.ts";
import { synthesiseSlide } from "./synthesis.ts";
import { renderDeck } from "./render.ts";

const canonicalPattern = /^L(0[1-9]|1[0-4])_[^.]+\.ya?ml$/i;

async function main(): Promise<void> {
  const [command, ...argumentsList] = process.argv.slice(2);
  if (command !== "generate:lecture" && command !== "generate:all") return usage();
  const options = optionsFrom(argumentsList);
  const input = resolve(options.input ?? (command === "generate:all" ? "data/YAML" : ""));
  const output = resolve(options.output ?? "presentations");
  if (!input) throw new Error("--input is required for generate:lecture");
  const root = projectRoot(input, command === "generate:all");
  const corpus = await buildCorpusIndex(join(root, "data", "wa_wiki"));
  const themePath = join(root, "data", "_uwa-revealjs.css");
  const files = command === "generate:all" ? await canonicalLectureFiles(input) : [{ path: input, outputName: basename(input) }];
  await mkdir(output, { recursive: true });
  for (const file of files) await generate(file.path, output, corpus, themePath, file.outputName);
  console.log(`Generated ${files.length} deck(s) in ${output}`);
}

async function generate(file: string, output: string, corpus: Awaited<ReturnType<typeof buildCorpusIndex>>, themePath: string, outputName = basename(file)): Promise<void> {
  if (!canonicalPattern.test(basename(file))) throw new Error(`${file}: expected canonical L01_ through L14_ lecture filename`);
  const lecture = parseLectureYaml(await readFile(file, "utf8"), file);
  const slides = await Promise.all(lecture.subtopics.map(async (subtopic) => synthesiseSlide(subtopic, retrieve(corpus, subtopic.wiki_query?.trim() || `${lecture.topic} ${subtopic.title} ${subtopic.description}`))));
  const htmlName = outputName.replace(/\.ya?ml$/i, ".html");
  const styleName = outputName.replace(/\.ya?ml$/i, ".css");
  const stylesDir = join(output, "styles");
  await mkdir(stylesDir, { recursive: true });
  const deck = await renderDeck(lecture, slides, themePath, `styles/${styleName}`);
  const target = join(output, htmlName);
  await Promise.all([writeFile(target, deck.html, "utf8"), writeFile(join(stylesDir, styleName), deck.stylesheet, "utf8")]);
  console.log(`  ${basename(target)} (${slides.length} content slides)`);
}

async function canonicalLectureFiles(input: string): Promise<Array<{ path: string; outputName: string }>> {
  const candidates = (await readdir(input)).filter((file) => /^L(0[1-9]|1[0-4])_[^.]+\.ya?ml$/i.test(file));
  return Array.from({ length: 14 }, (_, offset) => {
    const number = String(offset + 1).padStart(2, "0");
    const matching = candidates.filter((file) => file.startsWith(`L${number}_`));
    const clean = matching.filter((file) => !/\s-\s(?:copy|alternate)\.ya?ml$/i.test(file));
    if (clean.length > 1) throw new Error(`${input}: multiple canonical candidates for L${number}: ${clean.join(", ")}`);
    if (clean.length === 1) return { path: join(input, clean[0]), outputName: clean[0] };
    // L09/L10 currently carry a legacy suffix. It is accepted only as the sole
    // candidate and is normalised in output; a clean future file wins instead.
    if (matching.length === 1) return { path: join(input, matching[0]), outputName: matching[0].replace(/\s-\s(?:copy|alternate)(\.ya?ml)$/i, "$1") };
    throw new Error(`${input}: expected one canonical candidate for L${number}; found ${matching.length}`);
  });
}

function projectRoot(input: string, inputIsDirectory: boolean): string { return inputIsDirectory ? dirname(dirname(input)) : dirname(dirname(dirname(input))); }
function optionsFrom(values: string[]): Record<string, string> { const options: Record<string, string> = {}; for (let i = 0; i < values.length; i += 2) { if (!values[i]?.startsWith("--") || !values[i + 1]) throw new Error("Options must use --input <path> --output <path>"); options[values[i].slice(2)] = values[i + 1]; } return options; }
function usage(): never { throw new Error("Usage: generate:lecture --input data/YAML/L01_*.yaml --output presentations | generate:all --input data/YAML --output presentations"); }

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
