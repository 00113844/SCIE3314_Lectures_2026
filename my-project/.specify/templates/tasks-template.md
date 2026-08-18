---
description: "SCIE3314 YAML to RevealJS pipeline task list"
---

# Tasks: [FEATURE NAME]

**Input**: Feature documents from `/specs/[###-feature-name]/`

## Required Pipeline Coverage

Every generated task list MUST include all of these phases, with exact paths and checkbox IDs:

1. **Setup**: Node/TypeScript CLI scripts and test runner.
2. **Parse & validate**: YAML schema types, parser, and actionable validation tests.
3. **Canonical resolution**: L01–L14 selection only; copies and alternates excluded.
4. **Retrieval**: index `data/wa_wiki/index.md` and corpus Markdown, normalize titles/tags/chunks, retrieve top-k sources.
5. **Synthesis**: LLM-first grounded bullets and speaker notes, fallback behaviour, and provenance metadata.
6. **Render**: standalone RevealJS HTML, baseline plugins, inline UWA CSS, deterministic output names.
7. **QA**: exactly 14 decks, theme/plugin/provenance checks, and contract tests.
8. **Documentation**: quickstart and CLI usage.

## Format

```text
- [ ] T001 [P?] [US?] Concrete action in exact/path.ext
```

Organize implementation by independently testable user story after the shared setup and foundation. Treat figure generation as out of scope unless the feature specification explicitly reintroduces it.
