# SCIE3314 Curriculum Wiki — Log

Append-only. One entry per review/build session.

## 2026-07-20 — Initial build, seeded from L01

- Fixed `src/cli.ts` so `subtopic.wiki_query` actually drives generation-time retrieval (was
  previously parsed and silently discarded; `npm test` still passes, `generate:lecture` verified
  end to end on L01).
- Rewrote `key_concepts` and `wiki_query` for all 19 subtopics in
  `data/YAML/L01_Introduction_to_Cropping_Systems.yaml`, grounded by searching and reading
  `data/wa_wiki/` directly (acting as `WAAgriContextAgent`) and validating each `wiki_query`
  against the real `retrieve()` scorer. 17/19 subtopics now retrieve correctly on-topic sources
  (several previously scored on unrelated docs, e.g. "Why Rotate?" was matching an adjuvants doc).
  2 subtopics ("Systems Thinking and System", "What is a system made from?") left without
  `wiki_query` since the WA wiki has no general-systems-theory content to ground them in honestly.
- Built this curriculum wiki (`index.md`, `learning_outcomes.md`, `concepts/`, `lectures/`),
  seeded from L01 only. Learning outcomes sourced from the official unit outline (uploaded by
  Gustavo), using the Bloom's-tagged LO1-LO6 as canonical per his confirmation ("these are the
  learning outcomes, mainly - can be extended").
- Left open: 13-vs-14 lecture count discrepancy in the unit outline; relationship between this
  wiki's `learning_outcomes.md` and the older `data/Learning_Outcomes.md`; `src/agent-bridge.ts`
  stub and `retrieveEnhanced()` remain dead code, intentionally not touched this session.
- Next: review L02 onward, updating `concepts/` (reuse existing pages where a concept recurs
  rather than duplicating) and `lectures/` as each is done.

## 2026-07-20 — Restructured L01 framing (subtopics 1-6)

- At Gustavo's direction, replaced the abstract general-systems-theory content (old subtopics
  "Elements of Farming Systems" and "What is a system made from?") with a concrete narrative: one
  paddock as a holistic project, broken into technical components (soil chemistry/physics/biology;
  crop production — seed, fertiliser, herbicides/fungicides/insecticides), then zoomed out to
  nested scales (soil → paddock → farm-as-business → market), then an explicit roadmap mapping
  each component/scale onto the L02-L14 sequence.
- New order: (1) Systems Thinking [trimmed], (2) One Farming System, Broken Into Its Technical
  Components [new], (3) From Paddock to System [trimmed, scale content moved out], (4) Nested
  Scales: From Soil to Global Market [new], (5) WA Grainbelt [unchanged], (6) Roadmap [new,
  replaces old "Components of a Cropping System" checklist, which is now absorbed into #2].
  Subtopics 7-19 untouched. Subtopic count still 19.
- New concept pages: [[concept_paddock_technical_components]], [[concept_nested_scales]]. New
  top-level reference: [[unit_roadmap]]. Updated [[concept_cropping_system_definition]] to remove
  the now-duplicated nested-scales content.
- Verified: `npm test` passes, `generate:lecture` produces 19 slides, wiki_query grounding checked
  for all 6 restructured subtopics (2 intentionally ungrounded — general systems theory and
  course-structure meta content have no wa_wiki counterpart, forcing a match would misrepresent
  provenance).
- Roadmap content (`unit_roadmap.md`) is a claim about what L02-L14 will cover, inferred from
  filenames/topics only — not yet verified against each lecture's actual content. Correct it as
  each lecture is reviewed rather than treating it as ground truth.

## 2026-07-20 — Reviewed L02, L04, L05, L07, L08, L09, L10, L12

- Gustavo manually added new content and figures to the L02-L14 YAMLs, some as raw/typo'd note
  fragments, some as new well-written subtopics appended out of narrative order, and some as
  overlapping content from what looked like a second source deck concatenated onto the original.
- L02: only needed a `key_concepts`/`wiki_query` grounding pass; content was already well-written.
- L04 (WA Climate) and L05 (Australian/WA Temperate Agriculture) had been swapped by Gustavo,
  reversing the teaching order — `unit_roadmap.md` corrected to match. L04 had 2 subtopics of raw,
  typo'd notes needing full prose (agrometeorology key concepts, Koppen climate classification);
  L05 had 3 needing prose and repositioning (agro-ecological zoning, temperate-crop domestication,
  a yield-concept taxonomy that sharpens L01's yield-gap framework).
- L07 (Canola) and L08 (Lupins) needed repositioning only: new subtopics were well-written but
  appended after the closing synthesis slide; moved each into its narratively correct place so the
  original closing slide stays last.
- L09 (Herbicides/Spraying), L10 (Financial/Risk), L12 (Nematodes) had two decks concatenated —
  reviewed both versions as an agronomist would, merged genuinely duplicate content into the
  richer of the two treatments (folding unique facts from the dropped slide into the kept one),
  kept new content that added real coverage (optical weed detection and UAVs in L09; cash flow,
  balance sheet, capital budgeting and sensitivity analysis in L10; CCN/RKN-specific biology and
  management in L12), and repositioned everything into one coherent narrative per lecture.
- Cross-checked wa_wiki for material not yet reflected in the merged content and added several
  concrete facts: blackleg AG-race hotspot and ascospore dispersal (L07); rhizobia strain/
  re-inoculation specifics (L08); herbicide resistance MOA-group risk, HWSC seed-destruction rate,
  "double knock" (L09); "roughly right, not precisely wrong" gross-margin philosophy (L10); WA
  root-lesion-nematode prevalence, resistance/tolerance definitions, Rhizoctonia AG8/AG11 strains
  (L12).
- Net subtopic counts after merging duplicates while keeping genuinely new content: L09 25→19,
  L10 21→18, L12 18→15. L05 and L08 grew as planned (12→15, 10→14) since their new material was
  additive, not duplicate.
- All 6 lectures verified via `npm test` and `generate:lecture`.
- Not yet done: updating individual `lectures/*.md` subtopic-mapping pages in this wiki for these
  6 lectures (only L01's exists so far). L03, L06, L11, L13, L14 were not yet reviewed at this
  point — see next entry.

## 2026-07-20 — Reviewed L03, L06, L11, L13, L14 (remaining lectures)

- Gustavo asked why these five were untouched: they simply hadn't been flagged as edited, so they
  were never queued. Reviewed all five to bring them to the same standard as the rest.
- L03 (Soil Sampling/Acidity/Fertiliser): found one raw, unformatted block of copy-pasted notes
  ("Philosophical Approaches to Fertilizer Recommendations" — build-up-and-maintenance, percent
  sufficiency, cation saturation ratios) dumped onto the end of the closing synthesis slide.
  Extracted it into its own subtopic, positioned after "Critical Values and Calibration" where it
  belongs conceptually, and restored the closing slide's original clean text. 13 → 14 subtopics.
  Enriched acidity/liming content with wa_wiki figures ($500M-$1.5B annual WA acidity cost, iLime
  decision-support tool, Avon River Basin pH trend, liming trade-offs).
- L06 (Cereals), L11 (Precision Ag), L13 (Process/Logistics), L14 (Global Markets): all already
  well-written with no structural problems (no raw notes, no duplicate decks) — needed only the
  standard `key_concepts`/`wiki_query` grounding pass. Enriched several slides with concrete
  wa_wiki figures where available: flag-leaf photosynthesis share and malt-protein window (L06);
  CTF wheeled-area and plant-available-water figures, RTK accuracy (L11). L13 and L14 cover
  logistics/economics/world-markets content outside wa_wiki's agronomy scope, so grounding value
  was necessarily thinner there — expected and consistent with L05/L10's economics content.
- All 5 lectures verified via `npm test` and `generate:lecture`; full `generate:all` run across
  all 14 YAMLs confirms the complete set still parses and generates together cleanly.
- All 14 lectures (L01-L14) are now reviewed. `unit_roadmap.md` updated to reflect this.
