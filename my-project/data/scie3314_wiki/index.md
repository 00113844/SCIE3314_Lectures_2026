# SCIE3314 Curriculum Wiki — Index

Course-pedagogy layer, parallel to `data/wa_wiki/` (which holds WA agriculture domain knowledge).
This wiki tracks unit concepts, which lecture(s) teach them, and how they map to
`learning_outcomes.md`. It is a curation-time reference for the human-in-the-loop review step —
not consumed by `src/cli.ts` at generation time. See `log.md` for the change history.

## Lectures reviewed

| Lecture | Status | Summary |
|---|---|---|
| L01 Introduction to Cropping Systems | reviewed (2026-07-20) | [[L01_introduction_to_cropping_systems]] |
| L02-L14 | not yet reviewed | — |

## Concepts (seeded from L01)

| Concept | Introduced in | Learning outcomes | Status |
|---|---|---|---|
| [[concept_systems_thinking]] | L01 | LO3, LO6 | weak wiki grounding (flagged, not fabricated) |
| [[concept_paddock_technical_components]] | L01 | LO3 | grounded (soil chem/physics strong, biology weak) |
| [[concept_cropping_system_definition]] | L01 | LO3 | grounded |
| [[concept_nested_scales]] | L01 | LO1, LO3, LO6 | grounded (market end strong, farm-business end weak) |
| [[concept_wa_grainbelt_mediterranean_climate]] | L01 | LO1, LO2 | grounded |
| [[concept_water_use_efficiency_yield_gap]] | L01 | LO2, LO3 | grounded |
| [[concept_crop_rotation]] | L01 | LO3 | grounded |
| [[concept_conservation_agriculture_no_till]] | L01 | LO3 | grounded |
| [[concept_stubble_management]] | L01 | LO3, LO4 | grounded |
| [[concept_farm_records]] | L01 | LO6 | grounded |

See also [[unit_roadmap]] — the component/scale-to-lecture mapping introduced in L01's closing
framing slide, to be updated as each later lecture is reviewed.

Each concept page lists which lecture(s) it appears in; update that list (and re-check for
duplicate/near-duplicate concepts) as each subsequent lecture is reviewed, rather than creating a
new concept page per lecture for the same idea.

## Open questions

- 13 content themes (per unit outline) vs 14 `L01-L14` YAML files — not yet resolved. Working
  assumption: treat all 14 as the working set until Gustavo confirms.
- `data/Learning_Outcomes.md` (old, unstructured) vs `learning_outcomes.md` (this wiki, canonical
  LO1-LO6) — the old file has useful granular detail in places but should not be treated as the
  authoritative outcome list. Not yet decided whether to retire it or fold its detail in per-
  lecture.
