# Documentation Index - SCIE3314 Enhanced Pipeline

**Quick navigation guide for all project documentation**

---

## 🚀 Start Here

New to the project? Read these in order:

1. **[Project Summary](Project_Summary.md)** — 10-minute overview of enhancements
2. **[README](../README.md)** — Project goals and quickstart
3. **[YAML Structure Proposal](YAML_Structure_Proposal.md)** — Detailed specification

---

## 📖 Core Documentation

### For Decision Makers
- **[Project Summary](Project_Summary.md)** — Executive overview with benefits and decision points
- **[Implementation Roadmap](Implementation_Roadmap.md)** — 4-week plan with phases, tasks, timeline

### For Content Authors (Instructors)
- **[Authoring Guide](Authoring_Guide.md)** — Quick reference for writing enhanced YAMLs
- **[L01 Enhanced Sample](L01_Enhanced_Sample.yaml)** — Complete example with 4 subtopics

### For Developers
- **[YAML Structure Proposal](YAML_Structure_Proposal.md)** — Full schema specification
- **[Implementation Roadmap](Implementation_Roadmap.md)** — Technical tasks by phase
- **[README](../README.md)** — Project structure and workflow

---

## 📋 By Document Type

### Specifications
| Document | Purpose | Audience |
|----------|---------|----------|
| [YAML Structure Proposal](YAML_Structure_Proposal.md) | Complete schema with all new fields | Developers, SMEs, Stakeholders |
| [Authoring Guide](Authoring_Guide.md) | Field-by-field reference for YAML authoring | Instructors, Content Authors |

### Examples & Templates
| Document | Purpose | Audience |
|----------|---------|----------|
| [L01 Enhanced Sample](L01_Enhanced_Sample.yaml) | Concrete example of enhanced structure | All (reference) |

### Planning & Management
| Document | Purpose | Audience |
|----------|---------|----------|
| [Project Summary](Project_Summary.md) | Executive summary with decision points | Stakeholders, Project Leads |
| [Implementation Roadmap](Implementation_Roadmap.md) | Phased implementation plan | Project Managers, Developers |

### Project Overview
| Document | Purpose | Audience |
|----------|---------|----------|
| [README](../README.md) | Project goals, quickstart, workflow | All |

---

## 🎯 By Role

### I am a... **Stakeholder / Decision Maker**
Read:
1. [Project Summary](Project_Summary.md) — Benefits and decision points (10 min)
2. [Implementation Roadmap](Implementation_Roadmap.md) — Timeline and resources (15 min)

Decision needed: Approve proposal to proceed to Phase 1?

---

### I am an... **Instructor / Content Author**
Read:
1. [Authoring Guide](Authoring_Guide.md) — How to write enhanced YAMLs (20 min)
2. [L01 Enhanced Sample](L01_Enhanced_Sample.yaml) — Concrete example (10 min)
3. [YAML Structure Proposal](YAML_Structure_Proposal.md) § 2.2 — Subtopic schema (10 min)

Task: Curate key concepts for your lecture(s)

---

### I am a... **Developer / Technical Lead**
Read:
1. [YAML Structure Proposal](YAML_Structure_Proposal.md) — Full specification (45 min)
2. [Implementation Roadmap](Implementation_Roadmap.md) — Technical tasks (30 min)
3. [README](../README.md) — Project structure (10 min)

Task: Implement Phase 1 (schema extension)

---

### I am a... **Project Manager**
Read:
1. [Implementation Roadmap](Implementation_Roadmap.md) — Timeline, tasks, risks (30 min)
2. [Project Summary](Project_Summary.md) — Acceptance criteria (10 min)

Task: Schedule kickoff meeting, assign roles

---

## 🔍 By Topic

### Key Concepts
- [YAML Structure Proposal § 2.2](YAML_Structure_Proposal.md#22-enhanced-subtopic-schema) — Schema definition
- [Authoring Guide § Key Concepts](Authoring_Guide.md#-key-concepts-new---human-curated) — How to write them
- [L01 Sample: Systems Thinking](L01_Enhanced_Sample.yaml#L49-L70) — Example with 4 concepts
- [YAML Structure Proposal § 3](YAML_Structure_Proposal.md#3-cognitive-levels--blooms-taxonomy-integration) — Bloom's taxonomy

### Wiki Integration
- [YAML Structure Proposal § 4](YAML_Structure_Proposal.md#4-wiki-integration-strategy) — Retrieval workflow
- [Authoring Guide § Wiki References](Authoring_Guide.md#-wiki-references-new---direct-grounding) — How to reference wiki docs
- [Implementation Roadmap: Phase 2](Implementation_Roadmap.md#phase-2-wiki-integration-enhancement) — Enhancement tasks

### Learning Outcomes
- [YAML Structure Proposal § 5](YAML_Structure_Proposal.md#5-learning-outcomes-alignment) — Alignment approach
- [Authoring Guide § Learning Outcomes](Authoring_Guide.md#-learning-outcomes-mapping-new) — How to map
- [Implementation Roadmap: Phase 4](Implementation_Roadmap.md#phase-4-content-migration--curation) — Migration tasks

### Teaching Guidance
- [YAML Structure Proposal § 2.2](YAML_Structure_Proposal.md#22-enhanced-subtopic-schema) — Schema fields
- [Authoring Guide § Teaching Guidance](Authoring_Guide.md#-teaching-guidance-new---for-you) — How to write teaching notes
- [L01 Sample: WUE Example](L01_Enhanced_Sample.yaml#L216-L233) — Rich teaching notes example

### Slide Types & Design
- [YAML Structure Proposal § 6](YAML_Structure_Proposal.md#6-revealjs-design-enhancements) — Slide templates
- [Authoring Guide § Slide Types](Authoring_Guide.md#-slide-types--interactivity-new) — Type selection guide
- [Implementation Roadmap: Phase 3](Implementation_Roadmap.md#phase-3-rendering--slide-templates) — Rendering tasks

---

## 📅 By Project Phase

### Phase 1: Schema Extension
- [Implementation Roadmap: Phase 1](Implementation_Roadmap.md#phase-1-schema-extension--validation)
- [YAML Structure Proposal § 2](YAML_Structure_Proposal.md#2-enhanced-yaml-schema-proposal)
- Source files: [`src/types.ts`](../src/types.ts), [`src/yaml.ts`](../src/yaml.ts)

### Phase 2: Wiki Integration
- [Implementation Roadmap: Phase 2](Implementation_Roadmap.md#phase-2-wiki-integration-enhancement)
- [YAML Structure Proposal § 4](YAML_Structure_Proposal.md#4-wiki-integration-strategy)
- Source file: [`src/retrieval.ts`](../src/retrieval.ts)

### Phase 3: Rendering
- [Implementation Roadmap: Phase 3](Implementation_Roadmap.md#phase-3-rendering--slide-templates)
- [YAML Structure Proposal § 6](YAML_Structure_Proposal.md#6-revealjs-design-enhancements)
- Source file: [`src/render.ts`](../src/render.ts)

### Phase 4: Content Migration
- [Implementation Roadmap: Phase 4](Implementation_Roadmap.md#phase-4-content-migration--curation)
- [Authoring Guide](Authoring_Guide.md) — Full authoring reference
- Source files: [`data/YAML/L01-L14.yaml`](../data/YAML/)

### Phase 5: Validation
- [Implementation Roadmap: Phase 5](Implementation_Roadmap.md#phase-5-validation--quality-assurance)
- [Project Summary § Acceptance Criteria](Project_Summary.md#-acceptance-criteria-for-proposal-approval)

---

## ❓ Common Questions

### Q: Where do I start if I want to author content?
**A:** Read the [Authoring Guide](Authoring_Guide.md), then look at [L01 Enhanced Sample](L01_Enhanced_Sample.yaml).

### Q: What's the implementation timeline?
**A:** 4 weeks (see [Implementation Roadmap](Implementation_Roadmap.md)).

### Q: Is this backward compatible with existing YAMLs?
**A:** Yes. All new fields are optional. See [YAML Structure Proposal § 7](YAML_Structure_Proposal.md#7-implementation-roadmap).

### Q: How do I validate my YAML file?
**A:** Run `npm run generate:lecture -- --input data/YAML/your_file.yaml --output presentations`

### Q: Where are the Learning Outcomes defined?
**A:** [`data/Learning_Outcomes.md`](../data/Learning_Outcomes.md)

### Q: Where is the wiki corpus?
**A:** [`data/wa_wiki/`](../data/wa_wiki/) (170+ markdown files)

### Q: How do I know which wiki slug to use?
**A:** List files: `ls data/wa_wiki/*.md` or check wiki index (if it exists)

### Q: What's the difference between synthesis_mode options?
**A:** See [Authoring Guide § Content Generation Strategy](Authoring_Guide.md#-content-generation-strategy-new)

---

## 📁 File Structure

```
my-project/
├── docs/                                    ← YOU ARE HERE
│   ├── INDEX.md                             ← This file
│   ├── Project_Summary.md                   ← Start here (10 min)
│   ├── YAML_Structure_Proposal.md           ← Full specification (45 min)
│   ├── L01_Enhanced_Sample.yaml             ← Concrete example
│   ├── Implementation_Roadmap.md            ← 4-week plan
│   └── Authoring_Guide.md                   ← Instructor reference
│
├── README.md                                ← Project overview
│
├── src/                                     ← Source code
│   ├── types.ts                             ← TypeScript interfaces
│   ├── yaml.ts                              ← YAML parser
│   ├── retrieval.ts                         ← Wiki corpus retrieval
│   ├── synthesis.ts                         ← LLM content generation
│   ├── render.ts                            ← RevealJS HTML rendering
│   └── cli.ts                               ← Command-line interface
│
├── data/
│   ├── YAML/                                ← Lecture source files (L01-L14)
│   ├── wa_wiki/                             ← WA agriculture wiki (170+ files)
│   ├── Learning_Outcomes.md                 ← Unit-wide learning objectives
│   └── _uwa-revealjs.css                    ← Base stylesheet
│
├── presentations/                           ← Generated HTML decks
└── tests/                                   ← Validation tests
```

---

## 🔗 Quick Links

### External References
- RevealJS Documentation: https://revealjs.com/
- Bloom's Taxonomy: https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/
- UWA Branding: [Internal link if available]

### Internal Resources
- SCIE3314 Unit Outline: [Link if available]
- Teaching Team Contact: [Link if available]
- Student Feedback Portal: [Link if available]

---

## 📝 Document Metadata

| Document | Status | Last Updated | Word Count |
|----------|--------|--------------|------------|
| [Project Summary](Project_Summary.md) | Complete | 2026-07-20 | ~2,800 |
| [YAML Structure Proposal](YAML_Structure_Proposal.md) | Complete | 2026-07-20 | ~8,500 |
| [Implementation Roadmap](Implementation_Roadmap.md) | Complete | 2026-07-20 | ~5,200 |
| [Authoring Guide](Authoring_Guide.md) | Complete | 2026-07-20 | ~4,300 |
| [L01 Enhanced Sample](L01_Enhanced_Sample.yaml) | Complete | 2026-07-20 | ~1,200 lines |
| [README](../README.md) | Updated | 2026-07-20 | ~1,100 |

**Total Documentation:** ~20,000 words + 1 sample YAML file

---

## ✏️ How to Update This Index

When adding new documentation:

1. Add entry to relevant section(s) above
2. Update file structure diagram
3. Update document metadata table
4. Commit with message: `docs: add [document name] to index`

---

**Last Updated:** 2026-07-20  
**Maintained By:** Project Documentation Team  
**Questions?** See [Project Summary § Contact](Project_Summary.md#-contact--feedback)
