# SCIE3314 Pipeline Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

## Summary

[Describe the YAML → retrieval → LLM synthesis → RevealJS HTML delivery path.]

## Locked Technical Context

**Language/Version**: Node.js 22.6+ with TypeScript  
**Project Type**: CLI generator  
**Input**: Canonical `data/YAML/L01_*.yaml` … `L14_*.yaml`  
**Corpus**: `data/wa_wiki/index.md` and `data/wa_wiki/*.md`  
**Output**: Standalone deterministic HTML in `presentations/`  
**Commands**: `generate:lecture --input <lecture> --output presentations/`; `generate:all --input data/YAML --output presentations/`  
**RevealJS baseline**: notes, highlight, markdown, search, zoom, math, mermaid  
**Theme**: `data/_uwa-revealjs.css`  
**Tests**: Node test runner; parser, canonical selection, retrieval, renderer contract  
**Constraints**: L01–L14 only; ignore copies/alternates; figures out of scope; provenance required.

## Architecture and Contracts

1. Parse and validate the lecture YAML schema.
2. Index corpus documents by title, tags, headings, and normalized terms.
3. Retrieve top-k chunks per subtopic.
4. Use an OpenAI-compatible model when configured; otherwise use deterministic grounded fallback content.
5. Render a single RevealJS document with inline UWA CSS and embedded provenance JSON.

Document the command interface in `contracts/cli.md`, data types in `data-model.md`, and verification in `quickstart.md`.

## Project Structure

```text
src/
├── cli.ts
├── yaml.ts
├── retrieval.ts
├── synthesis.ts
├── render.ts
└── types.ts
tests/
└── contracts.test.ts
presentations/
```

## Quality Gates

- Valid schema errors identify the input source and missing/invalid field.
- All-course generation writes exactly 14 HTML files in canonical order.
- Every content slide has provenance and a synthesis mode.
- UWA CSS and all baseline RevealJS plugins are present in every deck.
