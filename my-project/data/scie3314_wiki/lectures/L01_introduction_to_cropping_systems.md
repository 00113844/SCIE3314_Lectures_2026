---
title: "L01: Introduction to Cropping Systems"
type: lecture-summary
source_yaml: data/YAML/L01_Introduction_to_Cropping_Systems.yaml
learning_outcomes: [LO1, LO2, LO3, LO6]
status: reviewed
created: 2026-07-20
updated: 2026-07-20
---

# L01: Introduction to Cropping Systems

19 subtopics. Reviewed 2026-07-20: `key_concepts`/`wiki_query` re-grounded across all subtopics,
`src/cli.ts` fixed so `wiki_query` drives generation-time retrieval, and subtopics 1-6 (the framing
section) restructured around a concrete "holistic project" narrative — one paddock broken into its
technical components (soil chemistry/physics/biology, crop production inputs), then zoomed out to
nested scales (soil/paddock/farm/market), then mapped forward onto the semester via
[[unit_roadmap]].

## Subtopics and the concepts they map to

| # | Subtopic | Concept page | LO |
|---|---|---|---|
| 1 | Systems Thinking and System | [[concept_systems_thinking]] | LO3, LO6 |
| 2 | One Farming System, Broken Into Its Technical Components | [[concept_paddock_technical_components]] | LO3 |
| 3 | From Paddock to System: Defining a Cropping System | [[concept_cropping_system_definition]] | LO3 |
| 4 | Nested Scales: From Soil to Global Market | [[concept_nested_scales]] | LO1, LO3, LO6 |
| 5 | The Western Australian Grainbelt: Scale and Significance | [[concept_wa_grainbelt_mediterranean_climate]] | LO1 |
| 6 | Roadmap: How This Unit Unpacks Each Component | [[unit_roadmap]] | — (meta/structural) |
| 7 | The Mediterranean Rhythm: Matching Operations to the Season | [[concept_wa_grainbelt_mediterranean_climate]] | LO2 |
| 8 | Water as the First Limiting Resource | [[concept_water_use_efficiency_yield_gap]] | LO2 |
| 9 | Water-Use Efficiency: The French-Schultz Benchmark | [[concept_water_use_efficiency_yield_gap]] | LO2, LO3 |
| 10 | Closing the Yield Gap: Agronomy, Genetics and the Exceedance Idea | [[concept_water_use_efficiency_yield_gap]] | LO2, LO3 |
| 11 | Why Rotate? The Case Against Continuous Wheat | [[concept_crop_rotation]] | LO3 |
| 12 | The Classic WA Rotations and Their Logic | [[concept_crop_rotation]] | LO3 |
| 13 | The Wheat-Dominance Problem and Diversifying Rotations | [[concept_crop_rotation]] | LO3 |
| 14 | Records: The Memory of the System | [[concept_farm_records]] | LO6 |
| 15 | The Tillage Revolution: Why WA Abandoned the Plough | [[concept_conservation_agriculture_no_till]] | LO3 |
| 16 | Principles of Conservation Agriculture | [[concept_conservation_agriculture_no_till]] | LO3 |
| 17 | The Case for Some Tillage: Strategic Intervention | [[concept_conservation_agriculture_no_till]] | LO3 |
| 18 | Seeding Machinery: Tines versus Discs | [[concept_conservation_agriculture_no_till]] | LO3 |
| 19 | Stubble: To Retain or To Burn? | [[concept_stubble_management]] | LO3, LO4 |

## Wiki grounding status (subtopics 1-6, post-restructure)

| # | wiki_query set? | Top match | Score |
|---|---|---|---|
| 1 | no (genuine gap — general systems theory not in wa_wiki) | fallback: concept_decision_support_systems | 17 (weak topical fit) |
| 2 | yes | agronomic_planning_and_soil_water_management_in_western_aust | 11 |
| 3 | yes | environmental_drivers_and_agronomic_systems_of_the_wa_wheatb | 16 |
| 4 | yes | global_grain_production_and_sustainable_intensification_in_w | 10 (market end only — farm-business end weakly covered in wa_wiki) |
| 5 | yes | environmental_drivers_and_system_dynamics_of_western_austral | 14 |
| 6 | no (meta/course-structure content, not agriculture fact — grounding would be artificial) | fallback: concept_integrated_weed_management | 29 (incidental, ignore) |

## Coverage gaps noted

LO4 (crop protection: weeds, disease, pests) and LO5 (APSIM modelling) are only lightly touched
in L01 (stubble-borne disease mentions only) — expected, since this is the introductory lecture
and both outcomes have dedicated later lectures (L09, L12 for LO4; L02 + computer labs for LO5).
Not a gap to fix in L01 itself.
