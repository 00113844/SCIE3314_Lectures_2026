---
title: Unit roadmap - component/scale to lecture mapping
type: reference
source: L01 subtopic "Roadmap: How This Unit Unpacks Each Component"
updated: 2026-07-20
---

# Unit roadmap

The forward-mapping introduced in L01's closing framing slide. Update as each lecture is reviewed
and its actual content confirmed against this plan.

| Component / scale | Lecture(s) | Status |
|---|---|---|
| Systems thinking, technical components, nested scales | L01 | reviewed |
| Quantitative modelling (conceptual → hands-on) | L02 Crop Modelling + computer labs | reviewed |
| Soil chemistry and nutrition | L03 Soil Sampling, Acidity, Fertiliser | reviewed |
| Climate driver (LO2) | L04 WA Climate | reviewed |
| Global/national context (LO1) | L05 Australian and WA Temperate Agriculture | reviewed |
| Crop production — cereals | L06 Agronomy of Cereals | reviewed |
| Crop production — canola | L07 Agronomy of Canola | reviewed |
| Crop production — lupins/pulses | L08 Agronomy of Lupins and Grain Legumes | reviewed |
| Crop protection — weeds/herbicides | L09 Weed Management, Herbicides, Spraying Tech | reviewed |
| Farm-business scale — financial/risk | L10 Farm Financial and Production Analysis, Risk Management | reviewed |
| Technology layer across scales | L11 Precision Agriculture | reviewed |
| Soil biology / crop protection — disease | L12 Nematodes and Soilborne Diseases | reviewed |
| Farm-business scale — operations/logistics | L13 Process Management and Grain Logistics | reviewed |
| Market scale | L14 Global Food Markets and Food Security | reviewed |

All 14 lectures reviewed as of 2026-07-20.

Note: L04 and L05 were swapped by Gustavo on 2026-07-20 (climate now precedes the
Australian/WA context lecture in the teaching sequence). This table reflects the corrected order.

## Open gap

No dedicated lecture visible for general crop disease/fungicides or insect pests as a topic in
its own right (L12 is soilborne/nematode-specific; L09 is herbicide-specific). May be covered by
guest lectures not captured as a standalone YAML, or folded into the species-specific agronomy
lectures (L06-L08) — check when those are reviewed rather than assuming a gap.

## Review notes (2026-07-20 session)

- L02 Crop Modelling: key_concepts/wiki_query grounding pass only, no structural changes needed.
- L04 WA Climate: wrote full prose for 2 raw subtopics (agrometeorology key concepts, climate
  classification), fixed figure IDs left over from the L04/L05 swap, grounding pass on all 15 subtopics.
- L05 Australian/WA Temperate Agriculture: wrote 3 new subtopics (agro-ecological zoning,
  domestication of temperate crops, yield-concept taxonomy) from raw notes, positioned them for
  narrative flow rather than left at the end, grounding pass on all 15 subtopics.
- L07 Canola: repositioned the misplaced "Sustainability, Carbon Markets, ISCC" subtopic to sit
  before the closing "Quality, Markets and Whole-System Fit" synthesis slide; grounding pass,
  including wa_wiki-sourced blackleg epidemiology detail (AG-race hotspot, ascospore dispersal).
- L08 Lupins: repositioned 4 new subtopics (domestication/breeding, abiotic stress, precision ag,
  farming-systems/lupinosis) into the narrative rather than trailing after the closing slide;
  grounding pass, including wa_wiki-sourced rhizobia/inoculation specifics (Group G, 5-7yr cycle).
- L09 Herbicides/Spraying: merged 6 duplicate-content subtopics (droplet physics into spray
  quality, advanced nozzle design into hydraulic nozzles, boom dynamics into boom set-up, a
  duplicate PWM slide into modern spray systems, micrometeorology and rheology into adjuvants/
  weather) into their existing counterparts; kept 2 genuinely new subtopics (optical weed
  detection, UAVs) and repositioned them; 25 → 19 subtopics.
- L10 Financial/Risk: merged 3 duplicate subtopics (EGM into gross margins, whole-farm budgeting
  EBIT detail into whole-farm analysis, a duplicate synthesis into the closing slide); kept 5 new
  subtopics (farm audit, cash flow budgeting, balance sheet, capital budgeting/NPV, sensitivity
  analysis) and positioned them; 21 → 18 subtopics.
- L12 Nematodes: merged two concatenated decks (original 11 subtopics + 7 new CCN/RKN-focused
  ones) into one coherent lecture — kept the deeper CCN/RKN biology and species-specific
  management content, merged duplicate diagnosis and synthesis slides, added wa_wiki-sourced
  facts (60% WA paddock prevalence, resistance/tolerance definitions, Rhizoctonia AG8/AG11
  strains); 18 → 15 subtopics.
- All 6 lectures verified via `npm test` and `generate:lecture`.
