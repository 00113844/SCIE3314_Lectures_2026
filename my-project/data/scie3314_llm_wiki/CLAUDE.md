# SCIE3314 Crops and Cropping Systems Wiki — Operating Schema

## Structure

- `raw/` is immutable source evidence.
- `wiki/` contains LLM-maintained Markdown pages.
- `wiki/index.md` is the master catalog and must be updated on every ingest.
- `wiki/log.md` is append-only.
- `wiki/concepts/` holds topic pages; `wiki/sources/` holds source summaries; `wiki/comparisons/` holds decision comparisons.
- `outputs/` holds dated lint reports and other derived artifacts.

## Page conventions

Every page needs YAML frontmatter with `title`, `type`, `sources`, `related`, `created`, `updated`, and `confidence`. Use lowercase kebab-case filenames. Use `[[wikilinks]]` for relationships and ordinary Markdown links when portable click-through is useful. Keep claims traceable to a raw source or flag them as an inference.

## Ingest

1. Add a new source under `raw/`; never overwrite an existing raw file.
2. Read it and identify the material implications for existing topics.
3. Create or update source summaries, concepts, entities, or comparisons.
4. Update the master index and append a dated log entry.
5. Run a lint for broken links, orphan pages, gaps, contradictions, stale claims, and unsupported assertions; save the report under `outputs/`.

## Query

Read `wiki/index.md` first. Follow only relevant linked pages, synthesize an answer, and cite `[[source-summary]]` pages. Save genuinely durable new synthesis as a wiki update.

