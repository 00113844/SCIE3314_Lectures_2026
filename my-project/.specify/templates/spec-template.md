# SCIE3314 Pipeline Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: $ARGUMENTS

## Scope Contract *(mandatory)*

- **Lecture YAML scope**: `data/YAML/L01_*.yaml` through `L14_*.yaml` only. Copy, chapter, and alternate inputs are excluded.
- **Required schema**: `topic`, boolean `auto_figures`, and `subtopics[]` with `title` and `description`. Figures are out of scope unless a future feature changes this contract.
- **Retrieval sources**: `data/wa_wiki/index.md` and the Markdown corpus in `data/wa_wiki/`.
- **Output contract**: one deterministic, standalone HTML deck per canonical lecture in `presentations/`, using `data/_uwa-revealjs.css` and recording per-slide provenance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a lecture deck (Priority: P1)

[Describe how a lecturer creates one HTML deck from one canonical YAML input.]

**Independent Test**: Run `generate:lecture` and open the resulting RevealJS deck.

**Acceptance Scenarios**:

1. **Given** a valid canonical YAML file, **When** the CLI generates it, **Then** one themed HTML deck with notes and provenance is written.
2. **Given** invalid YAML, **When** the CLI generates it, **Then** it reports an actionable schema error and writes no misleading deck.

### User Story 2 - Generate the course set (Priority: P2)

[Describe complete L01–L14 generation and deterministic ordering.]

**Independent Test**: Run `generate:all` against `data/YAML` and verify exactly 14 decks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept only canonical L01–L14 lecture files for course generation.
- **FR-002**: System MUST validate the SCIE3314 YAML schema with source-specific errors.
- **FR-003**: System MUST retrieve relevant normalized corpus chunks before slide synthesis.
- **FR-004**: System MUST retain retrieval provenance with every rendered slide.
- **FR-005**: System MUST render RevealJS HTML with notes, highlight, markdown, search, zoom, math, and mermaid plugins.
- **FR-006**: System MUST apply `data/_uwa-revealjs.css` as the default theme.

## Success Criteria *(mandatory)*

- **SC-001**: `generate:all` produces 14 deterministically named decks in L01–L14 order.
- **SC-002**: Every content slide records whether LLM or fallback synthesis was used and its retrieved sources.
- **SC-003**: All generated decks include the UWA theme and the plugin baseline.

## Assumptions

- Node.js/TypeScript is the runtime and RevealJS assets may be loaded from pinned CDN URLs.
- An `OPENAI_API_KEY` enables LLM-first synthesis; a deterministic grounded fallback keeps local generation usable without credentials.
