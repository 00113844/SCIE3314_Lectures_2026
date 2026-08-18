# SCIE3314 RevealJS Pipeline

Convert the canonical SCIE3314 lecture YAML files into deterministic RevealJS HTML decks grounded in the WA agricultural knowledge wiki.

## Project Goals

This pipeline supports the **iterative design and review of undergraduate cropping systems lecture content** before automated HTML generation. The workflow is:

1. **Human-in-the-loop content authoring**: Instructors curate YAML files with explicit key concepts, teaching notes, and learning outcomes alignment
2. **Wiki-grounded synthesis**: Content generation draws from the distilled WA agricultural knowledge base (`data/wa_wiki/`)
3. **Pedagogically-aware rendering**: RevealJS slides adapt to slide types (concept, activity, example, case study) with appropriate layouts
4. **Provenance and transparency**: Every slide tracks its grounding sources for review and refinement

The intent is to **craft and review every lecture** before automation, ensuring quality, alignment with SCIE3314 learning outcomes, and integration with WA-specific agricultural context.

## Quickstart

Requires Node.js 22.6 or newer (Node 22's built-in TypeScript type stripping is used, so there is no install step).

```powershell
cd my-project
npm run generate:all
```

Generate one deck:

```powershell
node --experimental-strip-types src/cli.ts generate:lecture --input data/YAML/L01_Introduction_to_Cropping_Systems.yaml --output presentations
```

Only files named `L01_*.yaml` through `L14_*.yaml` are accepted. Copy and alternate files are ignored whenever a clean canonical file exists. The current L09 and L10 source files have legacy ` - Copy` suffixes; because each is the sole candidate for its lecture, the generator accepts it and normalizes the HTML filename. Generation fails if any of L01–L14 cannot be resolved unambiguously.

Each deck starts from the UWA CSS in `data/_uwa-revealjs.css` and receives a matching, lecture-specific stylesheet in `presentations/styles/`. It includes the RevealJS notes, highlight, markdown, search, zoom, math, and mermaid plugins, paced section dividers, learning objectives, WA-wiki application slides, and stores per-slide provenance in `#scie3314-provenance` JSON. RevealJS assets are pinned to the jsDelivr CDN.

**GitHub Copilot Native**: This pipeline runs entirely on your GitHub Copilot subscription with NO external API dependencies. Content synthesis uses deterministic text processing + wiki grounding. The WAAgriContextAgent provides enhanced wiki queries when available.

Run the small contract suite with `npm test`.

## Landing Page (Online)

The course landing page is published with GitHub Pages from `my-project/index.html` and is available at:

`https://00113844.github.io/SCIE3314_Lectures_2026/`

## Enhanced YAML Schema (Proposed)

**Status**: Under review (see [`docs/YAML_Structure_Proposal.md`](docs/YAML_Structure_Proposal.md))

The current YAML schema is being enhanced to support:

- **Explicit key concepts** with cognitive levels (Bloom's taxonomy)
- **Direct wiki references** for grounded content generation
- **Learning outcomes alignment** to SCIE3314 unit objectives
- **Pedagogical metadata** (slide types, interactivity levels, teaching notes)
- **Discussion prompts and common misconceptions** for speaker notes
- **WAAgriContextAgent integration** for complex wiki queries

See [`docs/L01_Enhanced_Sample.yaml`](docs/L01_Enhanced_Sample.yaml) for a complete example.

## Project Structure

```
my-project/
├── data/
│   ├── wa_wiki/              # Distilled WA agriculture knowledge base (170+ files)
│   ├── YAML/                 # Lecture source files (L01-L14)
│   ├── Learning_Outcomes.md  # SCIE3314 unit-wide learning objectives
│   └── _uwa-revealjs.css     # Base UWA branding stylesheet
├── presentations/            # Generated HTML decks + per-lecture stylesheets
├── src/
│   ├── cli.ts                # Command-line interface (generate:lecture, generate:all)
│   ├── yaml.ts               # Strict YAML parser with validation
│   ├── retrieval.ts          # Wiki corpus indexing and semantic retrieval
│   ├── synthesis.ts          # LLM-based content generation (optional)
│   ├── render.ts             # RevealJS HTML generation with slide templates
│   └── types.ts              # TypeScript interfaces for lectures and slides
├── tests/
│   └── contracts.test.ts     # Validation tests for YAML parsing and generation
└── docs/
    ├── YAML_Structure_Proposal.md   # Proposed schema enhancements
    └── L01_Enhanced_Sample.yaml     # Example of enhanced YAML structure
```

## Workflow

### Phase 1: Content Authoring (Human-in-the-loop)
1. Instructor writes/reviews YAML files with:
   - Key concepts students must master
   - Teaching notes and discussion prompts
   - Explicit wiki references for grounding
   - Alignment to learning outcomes
2. YAML validator checks structure, references, and alignment

### Phase 2: Wiki-Grounded Retrieval
1. Parser extracts key concepts and queries from YAML
2. Retrieval engine searches `wa_wiki/` corpus using:
   - Semantic term matching
   - Direct slug references
   - Section-specific queries
   - WAAgriContextAgent for complex questions
3. Top-K wiki sources attached as provenance

### Phase 3: Content Synthesis
1. Deterministic bullet extraction from YAML descriptions (primary method)
2. WAAgriContextAgent queries for enhanced wiki grounding (when available)
3. Speaker notes combine YAML content + wiki provenance for transparency
4. Optional: Use GitHub Copilot Chat interactively for content refinement

### Phase 4: RevealJS Rendering
1. Slide type templates (concept, activity, example, case study) applied
2. Mermaid diagrams, math equations, code highlighting configured
3. Footer with UWA dawg logo and navigation
4. Per-slide provenance JSON embedded for transparency

## Key Features

✅ **GitHub Copilot Native**: No external API dependencies, runs on Copilot subscription  
✅ **Deterministic parsing**: Strict YAML validator catches errors early  
✅ **Wiki-grounded**: Every claim traceable to WA agriculture knowledge base  
✅ **Agent-enhanced**: WAAgriContextAgent for intelligent wiki queries  
✅ **Pedagogically aware**: Slide types adapt to learning objectives  
✅ **Provenance tracking**: Full audit trail from wiki source to slide  
✅ **RevealJS 5.x**: Modern presentation framework with speaker notes, math, Mermaid  
✅ **Learning outcomes alignment**: Explicit mapping to SCIE3314 objectives  
✅ **Teaching guidance**: Speaker notes with prompts, misconceptions, and timing

## Next Steps

1. **Review proposal**: [`docs/YAML_Structure_Proposal.md`](docs/YAML_Structure_Proposal.md)
2. **Prototype L01**: Implement enhanced schema with Introduction to Cropping Systems
3. **Validate retrieval**: Test wiki corpus queries with sample key concepts
4. **Design slide templates**: Mockup HTML/CSS for activity, example, case study slides
5. **Migrate content**: Gradually enhance L01-L14 YAMLs with key concepts and teaching notes

See [open questions](docs/YAML_Structure_Proposal.md#10-open-questions-for-discussion) in the proposal document.

## Contributing

This is an internal UWA SCIE3314 project. For changes or suggestions:
1. Review the [YAML Structure Proposal](docs/YAML_Structure_Proposal.md)
2. Propose modifications via discussion or PR
3. Validate changes with `npm test` before committing

## License

Proprietary. Copyright University of Western Australia 2026.
