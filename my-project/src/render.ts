import { readFile } from "node:fs/promises";
import type { Lecture, LectureSubtopic, RetrievalResult, SlideContent } from "./types.ts";
import { studentBullets } from "./synthesis.ts";

const REVEAL_VERSION = "5.1.0";
const PALETTES = [
  { accent: "#E2B600", deep: "#27348B", tint: "#FFF7D7", wash: "#F5F7FF" },
  { accent: "#3E8E7E", deep: "#27348B", tint: "#E8F5F1", wash: "#F2F7F7" },
  { accent: "#B86A35", deep: "#27348B", tint: "#FFF0E5", wash: "#FAF5F0" },
  { accent: "#6F5AA7", deep: "#27348B", tint: "#F0EDFA", wash: "#F7F5FB" },
  { accent: "#A9435E", deep: "#27348B", tint: "#FCECEF", wash: "#FBF5F6" },
  { accent: "#2C7DA0", deep: "#27348B", tint: "#E6F4F8", wash: "#F1F8FA" }
];

interface PlannedSlide { html: string; provenance?: RetrievalResult[]; }
export interface RenderedDeck { html: string; stylesheet: string; }

/** Builds a 90–110 minute teaching sequence from the YAML's ordered lecture brief. */
export async function renderDeck(lecture: Lecture, slides: SlideContent[], themePath: string, stylesheetHref: string): Promise<RenderedDeck> {
  const baseTheme = await readFile(themePath, "utf8");
  const palette = PALETTES[hash(lecture.topic) % PALETTES.length];
  const plan = buildTeachingArc(lecture, slides);
  const provenance = plan.map((slide, index) => ({ slide: index + 1, sources: (slide.provenance ?? []).map(({ path, title, heading, score }) => ({ path, title, heading, score })) }));
  const sections = plan.map((slide) => slide.html).join("\n");
  return {
    stylesheet: deckStyles(palette),
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(lecture.topic)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/dist/reveal.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/dist/theme/white.css"><style>${baseTheme}</style><link rel="stylesheet" href="${escapeAttribute(stylesheetHref)}"></head>
<body><div class="reveal"><div class="slides">${sections}</div></div>
<script id="scie3314-provenance" type="application/json">${escapeHtml(JSON.stringify(provenance))}</script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/dist/reveal.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/notes/notes.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/highlight/highlight.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/markdown/markdown.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/search/search.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/zoom/zoom.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/math/math.js"></script><script src="https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/plugin/mermaid/mermaid.js"></script>
<script>try { if (!window.Reveal) throw new Error('RevealJS did not load'); const deck=new Reveal({hash:true,slideNumber:'c/t',transition:'slide',backgroundTransition:'fade',controls:true,progress:true,center:true,autoAnimate:true,plugins:[window.RevealNotes,window.RevealHighlight,window.RevealMarkdown,window.RevealSearch,window.RevealZoom,window.RevealMath?.KaTeX,window.RevealMermaid].filter(Boolean)}); deck.initialize(); } catch(error) { console.error(error); document.body.classList.add('reveal-fallback'); }</script></body></html>`
  };
}

function buildTeachingArc(lecture: Lecture, content: SlideContent[]): PlannedSlide[] {
  const groups = groupSlides(content, 3);
  const sourceDeck = content.length;
  const contextEvery = sourceDeck <= 13 ? 1 : 3;
  const planned: PlannedSlide[] = [
    titleSlide(lecture, content),
    objectivesSlide(lecture, content),
    journeySlide(groups)
  ];
  for (const [groupIndex, group] of groups.entries()) {
    planned.push(dividerSlide(groupIndex, groups.length, group));
    for (const [index, slide] of group.entries()) {
      // Check if subtopic has key_concepts - add concept intro slide
      const subtopicIndex = groups.slice(0, groupIndex).reduce((count, part) => count + part.length, 0) + index;
      const subtopic = lecture.subtopics[subtopicIndex];
      
      if (subtopic?.key_concepts && subtopic.key_concepts.length > 0) {
        planned.push(keyConceptsSlide(subtopic, groupIndex + 1));
      }
      
      planned.push(conceptSlide(slide, groupIndex + 1, subtopic));
      
      const absoluteIndex = groups.slice(0, groupIndex).reduce((count, part) => count + part.length, 0) + index;
      if (absoluteIndex % contextEvery === 0) planned.push(contextSlide(slide));
    }
  }
  planned.push(synthesisSlide(lecture, content));
  planned.push(closeSlide(lecture));
  return planned;
}

function titleSlide(lecture: Lecture, content: SlideContent[]): PlannedSlide {
  const subtitle = content[0] ? compact(content[0].bullets[0], 78) : "A Western Australian cropping systems lecture";
  return { html: `<section class="title-slide" data-background-color="#27348B"><p class="eyebrow">SCIE3314 · Cropping Systems</p><h1>${escapeHtml(lecture.topic)}</h1><p class="title-subtitle">${escapeHtml(subtitle)}</p><p class="title-meta">90–110 minute teaching deck · WA-grounded</p><aside class="notes">Open with the applied question for this lecture. Make the intended decision context explicit before introducing terminology.</aside></section>` };
}

function objectivesSlide(lecture: Lecture, content: SlideContent[]): PlannedSlide {
  const objectives = content.slice(0, 3).map((slide) => `<li><strong>${escapeHtml(compact(slide.title, 46))}</strong><span>${escapeHtml(compact(slide.bullets[0] ?? "", 82))}</span></li>`).join("");
  return { html: `<section class="learning-objectives-slide"><p class="eyebrow">Learning outcomes · 5 minutes</p><h2>By the end, you can…</h2><ol class="objective-list">${objectives}</ol><div class="time-chip">Plan for a decision, not just a definition</div><aside class="notes">Use these outcomes as the contract for the session. Ask students which outcome feels least familiar.</aside></section>` };
}

function journeySlide(groups: SlideContent[][]): PlannedSlide {
  const nodes = groups.map((group, index) => `A${index}["${escapeMermaid(`${index + 1}. ${compact(group[0]?.title ?? "", 24)}`)}"]`).join(" --> ");
  const labels = groups.map((group, index) => `<li><b>${index + 1}</b><span>${escapeHtml(compact(group[0]?.title ?? "", 52))}</span></li>`).join("");
  return { html: `<section class="journey-slide"><p class="eyebrow">The lecture arc · 5 minutes</p><h2>From diagnosis to a better decision</h2><div class="journey-layout"><pre class="mermaid">flowchart LR\n${nodes}\nclassDef default fill:#F5F7FF,stroke:#27348B,color:#27348B,rx:10,ry:10</pre><ol class="journey-list">${labels}</ol></div><aside class="notes">Signpost the journey. Explain that each part answers a different management question and will finish with an applied WA context check.</aside></section>` };
}

function dividerSlide(index: number, count: number, group: SlideContent[]): PlannedSlide {
  const first = group[0];
  return { html: `<section class="section-divider" data-background-color="#002147"><p class="eyebrow">Part ${index + 1} of ${count}</p><h2>${escapeHtml(compact(first?.title ?? "", 68))}</h2><p>${escapeHtml(compact(first?.bullets[0] ?? "", 105))}</p><aside class="notes">Pause and make the question for this section explicit. This divider also marks a natural discussion or short break point.</aside></section>` };
}

function conceptSlide(slide: SlideContent, part: number, subtopic?: LectureSubtopic): PlannedSlide {
  const bullets = slide.bullets.slice(0, 3).map((item, index) => `<li class="fragment ${index === 0 ? "current-visible" : ""}">${escapeHtml(item)}</li>`).join("");
  const takeaway = slide.bullets[0] ?? slide.title;
  
  // Add figure placeholder if figure_source is "literature" or "manual"
  let figureHtml = "";
  if (subtopic?.figure_source === "literature" || subtopic?.figure_source === "manual") {
    const source = subtopic.figure_source === "literature" ? "literature citation" : "manual curation";
    figureHtml = `<div class="figure-placeholder" style="background:#FFF7D7;border:2px dashed #E2B600;padding:1em;margin:1em 0;border-radius:8px;"><strong>📚 Figure to be added</strong><br/><span style="font-size:0.8em;opacity:0.8;">Source: ${source}</span></div>`;
  }
  
  return { provenance: slide.provenance, html: `<section class="content-slide"><p class="eyebrow">Part ${part} · Core idea</p><h2>${escapeHtml(compact(slide.title, 72))}</h2>${figureHtml}<div class="content-layout"><ul class="sparse-bullets">${bullets}</ul><aside class="takeaway"><span>Takeaway</span><p>${escapeHtml(takeaway)}</p></aside></div><aside class="notes">${escapeHtml(slide.notes)}</aside></section>` };
}

function keyConceptsSlide(subtopic: LectureSubtopic, part: number): PlannedSlide {
  const concepts = subtopic.key_concepts!.map((concept, index) => `<li class="fragment fade-in"><span class="concept-number">${index + 1}</span><span class="concept-text">${escapeHtml(concept)}</span></li>`).join("");
  return { html: `<section class="key-concepts-slide"><p class="eyebrow">Part ${part} · Learning targets</p><h2>Key Concepts</h2><p style="font-size:0.65em;margin-bottom:1.5em;">Master these foundational ideas:</p><ul class="concepts-list" style="list-style:none;padding:0;">${concepts}</ul><aside class="notes">These are the core concepts students must master from this section. Refer back to these at the end to check understanding.</aside></section>` };
}

function contextSlide(slide: SlideContent): PlannedSlide {
  const source = slide.provenance[0];
  const body = source ? studentBullets(source.excerpt, 2) : ["The management decision should be tested against the lecture evidence and the local paddock context."];
  return { provenance: slide.provenance, html: `<section class="context-slide"><p class="eyebrow">WA field context · Apply the idea</p><h2>What does this change in practice?</h2><div class="context-card"><div class="context-question">${escapeHtml(compact(slide.title, 80))}</div><ul>${body.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>${source ? `<p class="source-chip">WA wiki · ${escapeHtml(source.title)}${source.heading && source.heading !== "Overview" ? ` · ${escapeHtml(source.heading)}` : ""}</p>` : ""}<aside class="notes">Prompt students to identify the decision, evidence, trade-off, and uncertainty. Retrieved context: ${escapeHtml(source?.excerpt ?? "No high-confidence match.")}</aside></section>` };
}

function synthesisSlide(lecture: Lecture, content: SlideContent[]): PlannedSlide {
  const takeaways = content.slice(-3).map((slide) => `<li><strong>${escapeHtml(compact(slide.title, 42))}</strong><span>${escapeHtml(compact(slide.bullets[0] ?? "", 86))}</span></li>`).join("");
  return { html: `<section class="synthesis-slide"><p class="eyebrow">Synthesis · 10 minutes</p><h2>Bring the system back together</h2><div class="synthesis-prompt">When facing a new cropping decision, ask: <b>what is changing, what constrains it, and what action remains robust?</b></div><ul class="synthesis-list">${takeaways}</ul><aside class="notes">Invite students to link one key idea from each part. Use a current WA seasonal decision as the synthesis example.</aside></section>` };
}

function closeSlide(lecture: Lecture): PlannedSlide { return { html: `<section class="close-slide" data-background-color="#27348B"><p class="eyebrow">Exit question</p><h2>What is the next decision you would make differently?</h2><p>${escapeHtml(lecture.topic)} is useful only when it changes how we diagnose, choose, or act.</p><div class="closing-rule">Observe → interpret → decide → learn</div><aside class="notes">Allow time for an exit question or pair discussion. Point students to the relevant wiki sources embedded as slide provenance.</aside></section>` }; }

function groupSlides(slides: SlideContent[], groupCount: number): SlideContent[][] { const size = Math.ceil(slides.length / groupCount); return Array.from({ length: groupCount }, (_, index) => slides.slice(index * size, (index + 1) * size)).filter((group) => group.length); }
function compact(value: string, length: number): string { const clean = value.replace(/\s+/g, " ").replace(/^(Introduce|Explain|Discuss|Emphasise|Stress|Situate)\s+/i, "").trim(); return clean.length <= length ? clean : `${clean.slice(0, length - 1).replace(/\s+\S*$/, "").trimEnd()}…`; }
function hash(value: string): number { return [...value].reduce((result, char) => ((result * 31) + char.charCodeAt(0)) >>> 0, 7); }
function escapeMermaid(value: string): string { return value.replace(/["\[\]]/g, ""); }
function escapeHtml(value: string): string { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
function escapeAttribute(value: string): string { return escapeHtml(value); }

function deckStyles(palette: typeof PALETTES[number]): string { return `:root{--deck-accent:${palette.accent};--deck-deep:${palette.deep};--deck-tint:${palette.tint};--deck-wash:${palette.wash}}.reveal{font-size:33px}.reveal h1{font-size:2.3em;line-height:1.08}.reveal h2{font-size:1.45em;line-height:1.15;text-transform:none;letter-spacing:-.025em}.reveal p{line-height:1.35}.eyebrow{color:var(--deck-accent);font-size:.48em;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:1.25em!important}.title-slide,.section-divider,.close-slide{padding:1.7em!important;text-align:left}.title-slide{background:radial-gradient(circle at 84% 18%,rgba(226,182,0,.2),transparent 24%),linear-gradient(135deg,#27348B 0%,#16205d 100%)}.title-slide h1{max-width:80%;margin:0!important}.title-subtitle{max-width:62%;font-size:.75em;margin-top:1em!important}.title-meta{font-size:.42em;opacity:.78;margin-top:4em!important}.section-divider{background:linear-gradient(135deg,#002147 0%,#102e51 100%)}.section-divider h2{color:var(--deck-accent)!important;max-width:78%;margin:0!important}.section-divider>p:not(.eyebrow){max-width:64%;font-size:.7em;margin-top:1.2em!important}.learning-objectives-slide,.journey-slide,.content-slide,.context-slide,.synthesis-slide{padding:1.15em 1.45em!important}.objective-list{display:grid;grid-template-columns:repeat(3,1fr);gap:.65em;list-style:none;margin:1em 0!important;padding:0!important}.objective-list li{border-top:5px solid var(--deck-accent);background:var(--deck-wash);padding:.85em!important;text-align:left;min-height:5.5em}.objective-list strong,.objective-list span{display:block}.objective-list strong{font-size:.68em;color:var(--deck-deep)}.objective-list span{font-size:.49em;line-height:1.35;margin-top:.55em}.time-chip,.source-chip{display:inline-block;background:var(--deck-tint);border-radius:99px;color:var(--deck-deep);font-size:.43em;font-weight:700;padding:.5em .9em}.journey-layout{display:grid;grid-template-columns:1.45fr .8fr;gap:1em;align-items:center}.journey-list{margin:0!important;list-style:none}.journey-list li{display:flex;align-items:center;gap:.7em;margin:.65em 0;font-size:.52em}.journey-list b{background:var(--deck-accent);border-radius:50%;color:#fff;display:grid;height:1.8em;place-items:center;width:1.8em}.reveal .mermaid{max-height:47vh}.content-layout{display:grid;grid-template-columns:1.35fr .65fr;gap:1.2em;align-items:center}.sparse-bullets{margin:0!important;padding-left:1.1em!important}.sparse-bullets li{font-size:.72em;line-height:1.3;margin:0 0 .75em!important}.takeaway{background:var(--deck-deep);border-radius:.25em;color:#fff;padding:1em;text-align:left}.takeaway span{color:var(--deck-accent);font-size:.42em;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.takeaway p{font-size:.57em;line-height:1.4;margin:.55em 0 0!important}.context-slide{background:linear-gradient(135deg,#fff 0%,var(--deck-wash) 100%)}.context-card{border-left:8px solid var(--deck-accent);background:#fff;box-shadow:0 12px 26px rgba(39,52,139,.1);padding:1em 1.25em;text-align:left}.context-question{color:var(--deck-deep);font-size:.78em;font-weight:700;margin-bottom:.65em}.context-card ul{font-size:.59em;margin:0!important;padding-left:1.1em!important}.context-card li{margin:.45em 0!important}.source-chip{margin-top:1.15em}.synthesis-prompt{background:var(--deck-deep);color:#fff;font-size:.69em;line-height:1.35;margin:1em 0;padding:1em 1.25em;text-align:left}.synthesis-list{display:grid;gap:.5em;grid-template-columns:repeat(3,1fr);list-style:none;margin:0!important;padding:0!important}.synthesis-list li{background:var(--deck-wash);font-size:.48em;padding:.8em;text-align:left}.synthesis-list strong,.synthesis-list span{display:block}.synthesis-list strong{color:var(--deck-deep);font-size:1.1em;margin-bottom:.4em}.close-slide{background:radial-gradient(circle at 12% 80%,rgba(226,182,0,.24),transparent 25%),#27348B}.close-slide h2{color:var(--deck-accent)!important;max-width:74%;margin:0!important}.close-slide>p:not(.eyebrow){font-size:.68em;max-width:67%;margin-top:1.2em!important}.closing-rule{border-top:1px solid rgba(255,255,255,.35);color:#fff;font-size:.58em;letter-spacing:.08em;margin-top:3em;padding-top:1em;text-transform:uppercase}.reveal-fallback .reveal{height:auto;overflow:visible}.reveal-fallback .slides{height:auto;position:static;transform:none}.reveal-fallback .slides>section{display:block;min-height:0;opacity:1;position:static;transform:none}`; }
