# SCIE3314 Enhanced Pipeline - Implementation Roadmap

**Project:** RevealJS Lecture Generation with Wiki Grounding  
**Status:** Planning Phase  
**Updated:** 2026-07-20

---

## Overview

This roadmap outlines the implementation plan for enhancing the SCIE3314 lecture generation pipeline with key concepts, wiki integration, learning outcomes alignment, and improved presentation design.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENHANCED YAML STRUCTURE                          │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐                │
│  │ Key        │  │ Wiki         │  │ Learning    │                 │
│  │ Concepts   │  │ References   │  │ Outcomes    │                 │
│  └────────────┘  └──────────────┘  └─────────────┘                 │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐                │
│  │ Teaching   │  │ Pedagogical  │  │ Slide       │                 │
│  │ Notes      │  │ Metadata     │  │ Types       │                 │
│  └────────────┘  └──────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    WIKI-GROUNDED RETRIEVAL                          │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  wa_wiki/ Corpus (170+ documents)                        │      │
│  │  • Semantic term matching                                │      │
│  │  • Direct slug references                                │      │
│  │  • Section-specific queries                              │      │
│  │  • WAAgriContextAgent for complex questions              │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTENT SYNTHESIS                                │
│  ┌───────────────┐            ┌──────────────────┐                 │
│  │ LLM-Enhanced  │     OR     │ Deterministic    │                 │
│  │ (with API key)│            │ (fallback)       │                 │
│  └───────────────┘            └──────────────────┘                 │
│         ↓                              ↓                            │
│  Student bullets + speaker notes from wiki + teaching guidance     │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    REVEALJS RENDERING                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Concept  │  │ Activity │  │ Example  │  │ Case     │           │
│  │ Slides   │  │ Slides   │  │ Slides   │  │ Study    │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
│  • Mermaid diagrams • Math (KaTeX) • Code highlighting            │
│  • Speaker notes • Provenance tracking • UWA branding              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Schema Extension & Validation
**Duration:** Week 1  
**Priority:** CRITICAL - Foundation for all other work

### Tasks

- [ ] **Update TypeScript interfaces** ([src/types.ts](../src/types.ts))
  - [ ] Define `KeyConcept` interface with cognitive levels
  - [ ] Define `WikiReference` interface with relevance types
  - [ ] Define `PedagogicalMetadata` interface
  - [ ] Extend `LectureSubtopic` with all new fields
  - [ ] Add `LectureMetadata` for top-level enhancements
  
- [ ] **Extend YAML parser** ([src/yaml.ts](../src/yaml.ts))
  - [ ] Add parsing for `key_concepts` array
  - [ ] Add parsing for `wiki_references` array
  - [ ] Add parsing for `learning_outcomes` mapping
  - [ ] Add parsing for pedagogical metadata fields
  - [ ] Implement backward compatibility (optional fields)
  - [ ] Add validation rules:
    - [ ] Cognitive levels must be valid Bloom's taxonomy terms
    - [ ] Wiki slugs should exist in `data/wa_wiki/` (warn if missing)
    - [ ] Learning outcomes should match `Learning_Outcomes.md`
    - [ ] Slide types must be from allowed enum
  
- [ ] **Create validation utilities**
  - [ ] `validateLearningOutcomes()` - check against unit outcomes
  - [ ] `validateWikiReferences()` - verify slugs exist
  - [ ] `validateCognitiveLevels()` - ensure valid Bloom's terms
  - [ ] Generate warnings, not errors (allow gradual enhancement)
  
- [ ] **Update test suite** ([tests/contracts.test.ts](../tests/contracts.test.ts))
  - [ ] Test parsing of enhanced YAML
  - [ ] Test backward compatibility with existing YAMLs
  - [ ] Test validation rules
  - [ ] Test error messages are helpful

### Deliverables
- ✅ Extended TypeScript interfaces
- ✅ Backward-compatible YAML parser
- ✅ Validation utilities with warnings
- ✅ Passing test suite
- ✅ Documentation of new schema fields

### Success Criteria
- Existing L01-L14 YAMLs parse without errors
- New fields parse correctly when present
- Validation provides actionable warnings

---

## Phase 2: Wiki Integration Enhancement
**Duration:** Week 1-2  
**Priority:** HIGH - Enables grounded content generation

### Tasks

- [ ] **Enhance retrieval engine** ([src/retrieval.ts](../src/retrieval.ts))
  - [ ] Implement `RetrievalOptions` interface
  - [ ] Add priority matching for `wiki_references.slug`
  - [ ] Add section-specific retrieval within documents
  - [ ] Add term boosting from `key_concepts.terms`
  - [ ] Implement hybrid retrieval strategy
  - [ ] Add `retrieveEnhanced()` function
  
- [ ] **WAAgriContextAgent integration**
  - [ ] Create agent invocation wrapper function
  - [ ] Parse `agent_query` from `wiki_references`
  - [ ] Implement agent response caching (avoid redundant calls)
  - [ ] Add agent output to slide provenance
  - [ ] Handle agent errors gracefully (fallback to standard retrieval)
  
- [ ] **Wiki corpus improvements**
  - [ ] Add section metadata to `CorpusChunk` (already has heading)
  - [ ] Pre-index common key concepts → wiki mappings
  - [ ] Add wiki-to-learning-outcome mappings
  - [ ] Consider adding semantic embeddings (future: use OpenAI embeddings)
  
- [ ] **Retrieval quality testing**
  - [ ] Create test suite with known queries
  - [ ] Measure precision@K for top-K retrieval
  - [ ] Compare semantic vs keyword vs hybrid strategies
  - [ ] Validate agent queries return relevant context

### Deliverables
- ✅ Enhanced retrieval with priority matching
- ✅ WAAgriContextAgent integration
- ✅ Retrieval quality benchmarks
- ✅ Documentation of retrieval strategies

### Success Criteria
- Direct slug references always retrieve correct document
- Section-specific queries return relevant chunks
- Agent queries return coherent, grounded answers
- Retrieval quality metrics show improvement over baseline

---

## Phase 3: Rendering & Slide Templates
**Duration:** Week 2  
**Priority:** HIGH - Improves presentation quality

### Tasks

- [ ] **Implement slide type templates** ([src/render.ts](../src/render.ts))
  - [ ] `conceptSlide()` - existing, enhance with key concepts card
  - [ ] `exampleSlide()` - WA field example with wiki source chip
  - [ ] `activitySlide()` - think-pair-share with prompts
  - [ ] `discussionSlide()` - prompts with polling/response space
  - [ ] `caseStudySlide()` - scenario + decision question
  - [ ] `keyConceptsSlide()` - dedicated slide for concept introduction
  
- [ ] **Enhanced speaker notes generation**
  - [ ] Include teaching guidance from YAML
  - [ ] Include discussion prompts
  - [ ] Include common misconceptions
  - [ ] Include key concepts reminder
  - [ ] Include wiki provenance
  - [ ] Format for readability in presenter view
  
- [ ] **CSS enhancements** ([presentations/styles/](../presentations/styles/))
  - [ ] `.activity-slide` styling with prompt cards
  - [ ] `.example-slide` styling with context cards
  - [ ] `.case-study-slide` styling with scenario layout
  - [ ] `.key-concepts-slide` styling with concept cards grid
  - [ ] Footer styling with logo and navigation
  - [ ] Responsive design for different screen sizes
  
- [ ] **Footer with UWA dawg logo**
  - [ ] Add logo image to `presentations/styles/`
  - [ ] Implement fixed footer HTML
  - [ ] Add slide number progress display
  - [ ] Add lecture ID display
  - [ ] Hide footer on title/close slides
  - [ ] Adjust opacity based on background color
  
- [ ] **Pedagogical features**
  - [ ] Add estimated time display per section
  - [ ] Add cognitive level indicators
  - [ ] Add interactivity level badges
  - [ ] Add learning outcome tags (optional display)

### Deliverables
- ✅ Slide type templates for all types
- ✅ Enhanced speaker notes
- ✅ Updated CSS with new slide classes
- ✅ Footer with branding and navigation
- ✅ Sample HTML outputs for review

### Success Criteria
- Each slide type has distinct, appropriate layout
- Speaker notes are comprehensive and actionable
- Footer displays correctly on all slides
- Visual design matches UWA branding
- Accessibility requirements met (WCAG 2.1 AA)

---

## Phase 4: Content Migration & Curation
**Duration:** Week 3-4  
**Priority:** MEDIUM - Requires human input

### Tasks

- [ ] **L01: Introduction to Cropping Systems** (Pilot)
  - [ ] Add `key_concepts` to all subtopics (human curation)
  - [ ] Add `wiki_references` with relevant slugs
  - [ ] Add `teaching_notes` and `discussion_prompts`
  - [ ] Add `common_misconceptions`
  - [ ] Map to `Learning_Outcomes.md`
  - [ ] Test generation pipeline end-to-end
  - [ ] Review output HTML with stakeholders
  - [ ] Iterate based on feedback
  
- [ ] **L02-L05: Core Concepts**
  - [ ] Crop Modelling
  - [ ] Soil Sampling & Fertiliser
  - [ ] Australian/WA Agriculture
  - [ ] WA Climate
  - [ ] Repeat L01 curation process for each
  
- [ ] **L06-L08: Crop-Specific**
  - [ ] Agronomy: Cereals
  - [ ] Agronomy: Canola
  - [ ] Agronomy: Lupins
  - [ ] Focus on crop-specific key concepts
  - [ ] Link to relevant crop wiki documents
  
- [ ] **L09-L14: Management & Systems**
  - [ ] Herbicide Management & Spraying
  - [ ] Farming Systems & Risk
  - [ ] Precision Agriculture
  - [ ] Nematodes
  - [ ] Process Management
  - [ ] Global Food Markets
  - [ ] Focus on decision-making frameworks

### Deliverables
- ✅ Enhanced YAML files for L01-L14
- ✅ Key concepts curated by subject matter expert
- ✅ Wiki references validated and tested
- ✅ Teaching notes from instructor experience
- ✅ Complete learning outcomes mapping

### Success Criteria
- Every subtopic has 2-4 key concepts
- 80%+ of subtopics have wiki references
- All lectures map to at least 3 learning outcomes
- Teaching notes provide actionable guidance
- Stakeholders approve content quality

---

## Phase 5: Validation & Quality Assurance
**Duration:** Week 4  
**Priority:** HIGH - Ensures quality before deployment

### Tasks

- [ ] **Automated validation**
  - [ ] Run `validateLearningOutcomesCoverage()` across all lectures
  - [ ] Check for orphaned learning outcomes (no lecture covers)
  - [ ] Check for orphaned key concepts (no wiki grounding)
  - [ ] Validate all wiki references resolve to real documents
  - [ ] Check for missing teaching notes in core lectures
  
- [ ] **Generation quality checks**
  - [ ] Generate all L01-L14 HTML decks
  - [ ] Verify no broken links or missing images
  - [ ] Check provenance JSON is complete
  - [ ] Validate speaker notes render correctly
  - [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
  - [ ] Test on different screen sizes (desktop, tablet, mobile)
  
- [ ] **Content quality review**
  - [ ] Peer review of key concepts accuracy
  - [ ] Instructor review of teaching notes relevance
  - [ ] Student pilot test (if possible) with L01-L03
  - [ ] Accessibility audit (screen reader compatibility)
  - [ ] Plain language review (avoid jargon without definition)
  
- [ ] **Documentation completion**
  - [ ] Update README with final workflow
  - [ ] Document new YAML fields with examples
  - [ ] Create instructor guide for content authoring
  - [ ] Create troubleshooting guide for common issues

### Deliverables
- ✅ Validation report with metrics
- ✅ Quality assurance checklist (all passed)
- ✅ Browser compatibility report
- ✅ Accessibility audit report
- ✅ Complete documentation set

### Success Criteria
- All automated validation passes
- All HTML decks render correctly
- Stakeholders approve content for deployment
- Documentation is comprehensive and clear
- No critical bugs or missing features

---

## Dependencies & Risks

### Critical Dependencies
1. **Node.js 22.6+** - Type stripping feature required
2. **WA Wiki corpus** - Must be complete and up-to-date
3. **OpenAI API** (optional) - For LLM-enhanced synthesis
4. **Subject matter expert time** - For key concepts curation

### Known Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Wiki corpus incomplete | HIGH | Validate references, use WAAgriContextAgent fallback |
| SME availability limited | MEDIUM | Prioritize L01-L03 pilot, iterate on others |
| RevealJS version conflicts | LOW | Pin to 5.1.0 on jsDelivr CDN |
| Browser compatibility issues | MEDIUM | Test on all major browsers early |
| Learning outcomes drift | LOW | Version control, change log, periodic audits |

---

## Success Metrics

### Quantitative Metrics
- [ ] **Coverage**: 100% of L01-L14 lectures have enhanced YAMLs
- [ ] **Alignment**: 100% of unit learning outcomes covered by at least one lecture
- [ ] **Grounding**: 80%+ of subtopics have wiki references
- [ ] **Quality**: Zero critical bugs in validation tests
- [ ] **Performance**: HTML generation completes in <30 seconds per lecture

### Qualitative Metrics
- [ ] **Instructor feedback**: "Enhanced speaker notes are actionable"
- [ ] **Student feedback**: "Slides are engaging and well-paced"
- [ ] **Stakeholder approval**: "Content meets SCIE3314 standards"
- [ ] **Maintainability**: "New instructors can author content easily"

---

## Timeline Summary

```
Week 1  ┃ Phase 1: Schema Extension ██████████
        ┃ Phase 2: Wiki Integration ████████████
Week 2  ┃ Phase 2: Wiki Integration ████
        ┃ Phase 3: Rendering       ██████████████
Week 3  ┃ Phase 4: Content (L01-07) ████████████████████
Week 4  ┃ Phase 4: Content (L08-14) ████████████████████
        ┃ Phase 5: Validation       ██████████
```

---

## Open Questions for Stakeholder Decision

1. **Key Concepts Granularity**: 2-4 per subtopic, or allow more flexibility?
2. **Wiki Agent Frequency**: Invoke for every subtopic, or only when explicit `agent_query`?
3. **Cognitive Level Distribution**: Should we enforce balance across Bloom's taxonomy?
4. **Slide Type Ratio**: Target mix of concept:example:activity slides?
5. **Backward Compatibility**: Require all L01-L14 to be enhanced, or allow gradual migration?
6. **Learning Outcomes Format**: Use IDs (LO-01) or full text matching?
7. **Wiki Reference Strictness**: Error if slug doesn't exist, or just warn?
8. **LLM Synthesis Default**: Use LLM when API key present, or require explicit opt-in per lecture?

---

## Next Actions (Immediate)

1. **Decision Point**: Review and approve [`docs/YAML_Structure_Proposal.md`](YAML_Structure_Proposal.md)
2. **Kickoff Meeting**: Align on timeline, roles, and open questions
3. **Phase 1 Start**: Begin schema extension in `src/types.ts` and `src/yaml.ts`
4. **L01 Pilot**: Start curating key concepts for Introduction to Cropping Systems
5. **Wiki Audit**: Verify `wa_wiki/` corpus is complete and indexed

---

**Document Status:** Draft for Review  
**Last Updated:** 2026-07-20  
**Maintained By:** Project Team
