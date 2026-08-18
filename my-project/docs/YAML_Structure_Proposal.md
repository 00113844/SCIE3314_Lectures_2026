# YAML Structure Enhancement Proposal for SCIE3314 Lectures

**Date:** 2026-07-20  
**Status:** Draft for Review  
**Purpose:** Enhance lecture YAML structure to support key concepts, wiki integration, learning outcomes alignment, and improved presentation design

---

## 1. Current State Analysis

### Existing YAML Structure
```yaml
topic: "Introduction to Cropping Systems"
auto_figures: true
subtopics:
  - title: "Systems Thinking and System"
    description: >
      Long description...
    figure_id: "Fig-L01-Grainbelt"  # optional
    image_prompt: >                  # optional
      Prompt for image generation...
```

### Current Strengths
- ✅ Clear hierarchical structure (topic → subtopics)
- ✅ Figure generation support with IDs and prompts
- ✅ Detailed descriptions for content generation
- ✅ Deterministic parsing with strong validation
- ✅ Wiki corpus retrieval system active
- ✅ Provenance tracking in generated slides

### Identified Gaps
- ❌ **No explicit key concepts/learning objectives per subtopic**
- ❌ **No mechanism to tag/link to wa_wiki documents**
- ❌ **No mapping to unit-wide Learning Outcomes**
- ❌ **No pedagogical metadata** (cognitive level, estimated time, interactivity)
- ❌ **No speaker notes or teaching guidance per subtopic**
- ❌ **No support for different slide types** (activity, discussion, demo, case study)
- ❌ **Limited control over synthesis/content generation** strategy

---

## 2. Enhanced YAML Schema Proposal

### 2.1 Top-Level Fields (Enhanced)

```yaml
lecture_id: "L01"                           # NEW: Canonical lecture identifier
topic: "Introduction to Cropping Systems"
auto_figures: true
duration_minutes: 100                       # NEW: Target duration for pacing
learning_outcomes: []                       # NEW: Maps to Learning_Outcomes.md
prerequisites: []                           # NEW: Prior knowledge required
wiki_context: []                            # NEW: Suggested wa_wiki documents
pedagogical_approach: "systems-thinking"    # NEW: Teaching philosophy tag

subtopics: [...]
```

### 2.2 Enhanced Subtopic Schema

```yaml
- title: "Systems Thinking and System"
  
  # EXISTING
  description: >
    Long narrative description for content generation...
  
  # NEW: KEY CONCEPTS (human-curated, explicit learning targets)
  key_concepts:
    - name: "System definition"
      terms: ["system", "interconnected elements", "emergent properties"]
      cognitive_level: "understand"  # Bloom's: remember, understand, apply, analyze, evaluate, create
      
    - name: "Feedback loops"
      terms: ["positive feedback", "negative feedback", "equilibrium"]
      cognitive_level: "analyze"
      
    - name: "System boundaries"
      terms: ["boundary", "inputs", "outputs", "throughputs"]
      cognitive_level: "apply"
  
  # NEW: WIKI INTEGRATION (explicit grounding)
  wiki_references:
    - slug: "systems_thinking_in_agriculture"        # Links to wa_wiki/systems_thinking_in_agriculture.md
      relevance: "foundation"                        # foundation | example | extension | context
      sections: ["Definition of Systems", "Feedback Mechanisms"]
    
    - slug: "cropping_systems_overview_wa"
      relevance: "example"
      query: "system components boundaries"           # Custom retrieval query
  
  # NEW: LEARNING OUTCOMES MAPPING
  learning_outcomes:
    - "Demonstrate critical thinking at a farming systems scale"
    - "Discuss how agricultural systems can be managed sustainably"
  
  # NEW: PEDAGOGICAL METADATA
  estimated_time_minutes: 8
  slide_type: "concept"           # concept | example | activity | discussion | case_study | synthesis
  interactivity: "low"            # low | medium | high
  
  # NEW: TEACHING GUIDANCE
  teaching_notes: >
    Start with Malthusian population dynamics as historical hook.
    Draw system diagram on board with student participation.
    Emphasize that "everything affects everything" is not systems thinking—
    we need to identify WHICH connections matter most.
  
  discussion_prompts:
    - "What is a system boundary in your family farm?"
    - "Give an example of a positive feedback loop in cropping systems"
  
  common_misconceptions:
    - "Students often think 'system' just means 'complicated thing'"
    - "Confusion between correlation and causation in system diagrams"
  
  # NEW: CONTENT GENERATION STRATEGY
  synthesis_mode: "wiki-grounded"  # wiki-grounded | llm-creative | hybrid | manual
  retrieval_strategy: "semantic"   # semantic | keyword | hybrid
  max_wiki_sources: 3
  
  # EXISTING (unchanged)
  figure_id: "Fig-L01-SystemDiagram"
  image_prompt: >
    Conceptual diagram showing nested systems...
```

---

## 3. Cognitive Levels & Bloom's Taxonomy Integration

### Mapping to Bloom's Revised Taxonomy
Each `key_concept` should specify a cognitive level to guide assessment and activity design:

| Level | Description | Example Verbs | SCIE3314 Application |
|-------|-------------|---------------|----------------------|
| **Remember** | Recall facts | list, name, identify | Recall growth stages, list major crops |
| **Understand** | Explain concepts | describe, explain, summarize | Explain water-use efficiency framework |
| **Apply** | Use in new situations | calculate, demonstrate, solve | Calculate yield potential from rainfall |
| **Analyze** | Break down relationships | compare, contrast, differentiate | Analyze yield gap causes |
| **Evaluate** | Make judgments | assess, critique, justify | Evaluate rotation strategy trade-offs |
| **Create** | Produce new work | design, formulate, construct | Design a cropping system for constraints |

### Example Implementation in YAML
```yaml
key_concepts:
  - name: "Water-use efficiency"
    cognitive_level: "apply"
    assessment_prompt: "Calculate WUE for a 3.5 t/ha wheat crop with 350mm rainfall"
    
  - name: "Rotation benefits"
    cognitive_level: "evaluate"
    assessment_prompt: "Justify why continuous wheat is problematic despite short-term profit"
```

---

## 4. Wiki Integration Strategy

### 4.1 Retrieval Workflow

```
YAML subtopic
    ↓
key_concepts.terms → [retrieval query]
    ↓
wiki_references.slug → [direct document fetch]
    ↓
wiki_references.query → [custom semantic search]
    ↓
Corpus retrieve() → Top-K results
    ↓
Slide provenance tracking
```

### 4.2 Enhanced `retrieval.ts` Function

Current retrieval uses:
- Simple term overlap scoring
- Title/tag boosting
- Top-K results (default 3)

**Proposed Enhancement:**
```typescript
export interface RetrievalOptions {
  strategy: "semantic" | "keyword" | "hybrid";
  preferredSlugs?: string[];        // From wiki_references
  requiredSections?: string[];      // From wiki_references.sections
  boostTerms?: string[];            // From key_concepts.terms
  maxResults?: number;
}

export function retrieveEnhanced(
  corpus: CorpusDocument[],
  query: string,
  options: RetrievalOptions
): RetrievalResult[] {
  // 1. Direct slug matches get priority
  // 2. Section-specific retrieval within matched docs
  // 3. Term boosting from key_concepts
  // 4. Fallback to current overlap scoring
}
```

### 4.3 WAAgriContextAgent Integration

The existing `@file:wa_wiki_agent_search` agent should be invoked when:
- `wiki_references` specifies complex queries
- LLM synthesis mode needs grounded context
- Generating discussion prompts from wiki content

**Workflow:**
```yaml
# In YAML
wiki_references:
  - agent_query: "How do WA farmers manage herbicide resistance in continuous wheat?"
    agent_output_as: "discussion_context"
```

**In generation pipeline:**
```typescript
if (subtopic.wiki_references.some(ref => ref.agent_query)) {
  const agentResponse = await invokeWAAgriContextAgent({
    query: ref.agent_query,
    wiki_path: "data/wa_wiki"
  });
  slideContent.notes += `\n\nWiki Agent Context: ${agentResponse.answer}`;
}
```

---

## 5. Learning Outcomes Alignment

### 5.1 Top-Level Outcomes Mapping
The `Learning_Outcomes.md` file contains unit-wide objectives. Each lecture should explicitly map to relevant outcomes:

```yaml
# At lecture level
learning_outcomes:
  - id: "LO-01"
    text: "Understand the context of Australian agriculture in relation to world food production"
    coverage: "partial"  # full | partial | supporting
    
  - id: "LO-04"
    text: "Demonstrate critical thinking at a farming systems scale"
    coverage: "full"
```

### 5.2 Subtopic-Level Alignment
Each subtopic's `learning_outcomes` field should reference the unit-wide outcomes by text match or ID:

```yaml
# In subtopic
learning_outcomes:
  - "Demonstrate critical thinking at a farming systems scale"
  - "Discuss how models can simulate complex agricultural systems"
```

### 5.3 Automated Validation
Add a validation step in `cli.ts`:

```typescript
function validateLearningOutcomesCoverage(lectures: Lecture[]): void {
  const unitOutcomes = parseMarkdownOutcomes("data/Learning_Outcomes.md");
  const coveredOutcomes = new Set<string>();
  
  for (const lecture of lectures) {
    for (const outcome of lecture.learning_outcomes) {
      coveredOutcomes.add(outcome.id);
    }
  }
  
  const uncovered = unitOutcomes.filter(o => !coveredOutcomes.has(o.id));
  if (uncovered.length > 0) {
    console.warn(`⚠️  Uncovered learning outcomes: ${uncovered.map(o => o.id).join(", ")}`);
  }
}
```

---

## 6. RevealJS Design Enhancements

### 6.1 Slide Type Templates

Based on `slide_type`, render different layouts:

```typescript
function renderSlideByType(subtopic: SubtopicEnhanced, content: SlideContent): string {
  switch (subtopic.slide_type) {
    case "concept":
      return conceptSlide(content);  // Current default
      
    case "example":
      return `<section class="example-slide">
        <p class="eyebrow">WA Field Example</p>
        <h2>${content.title}</h2>
        <div class="example-card">
          ${content.bullets.map(b => `<li>${b}</li>`).join("")}
        </div>
        ${renderWikiSourceChip(content.provenance)}
      </section>`;
      
    case "activity":
      return `<section class="activity-slide">
        <p class="eyebrow">Active Learning · ${subtopic.estimated_time_minutes} min</p>
        <h2>${content.title}</h2>
        <div class="activity-prompt">
          ${subtopic.discussion_prompts?.map(p => `<p>💬 ${p}</p>`).join("")}
        </div>
        <div class="activity-instructions">
          <strong>Think-Pair-Share:</strong> 2 min individual, 3 min pairs, 3 min class
        </div>
      </section>`;
      
    case "case_study":
      return `<section class="case-study-slide">
        <p class="eyebrow">Case Study · Real WA Farm</p>
        <h2>${content.title}</h2>
        <div class="case-study-card">
          <div class="case-study-scenario">${content.bullets[0]}</div>
          <div class="case-study-question">What decision would you make?</div>
        </div>
      </section>`;
      
    default:
      return conceptSlide(content);
  }
}
```

### 6.2 Key Concepts Slide

Add a dedicated slide type for explicit concept introduction:

```typescript
function keyConceptsSlide(subtopic: SubtopicEnhanced): string {
  const concepts = subtopic.key_concepts.map((concept, idx) => `
    <div class="concept-card fragment" data-fragment-index="${idx}">
      <h3>${concept.name}</h3>
      <div class="concept-terms">
        ${concept.terms.map(t => `<span class="term-tag">${t}</span>`).join("")}
      </div>
      <div class="concept-level">${concept.cognitive_level}</div>
    </div>
  `).join("");
  
  return `<section class="key-concepts-slide">
    <p class="eyebrow">Core Concepts · Master These</p>
    <h2>${subtopic.title}</h2>
    <div class="concepts-grid">
      ${concepts}
    </div>
    <aside class="notes">
      Walk through each concept. Ask students to self-assess: 
      can you explain each term to a peer?
    </aside>
  </section>`;
}
```

### 6.3 Footer with Dawg Logo

Add to base template in `render.ts`:

```html
<!-- In <body> before </div> reveal closing -->
<footer class="slide-footer">
  <img src="styles/uwa-dawg-logo.png" alt="UWA" class="footer-logo" />
  <span class="footer-lecture">SCIE3314 · L01</span>
  <span class="footer-progress"></span>
</footer>

<script>
// Update footer progress with slide number
Reveal.on('slidechanged', (event) => {
  const progress = document.querySelector('.footer-progress');
  if (progress) {
    progress.textContent = `${event.indexh + 1} / ${Reveal.getTotalSlides()}`;
  }
});
</script>
```

**CSS for footer:**
```css
.slide-footer {
  position: fixed;
  bottom: 10px;
  left: 20px;
  right: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.7em;
  color: #666;
  z-index: 100;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.reveal:not(.has-dark-background) .slide-footer {
  color: #666;
}

.reveal.has-dark-background .slide-footer {
  color: #fff;
}

.footer-logo {
  height: 32px;
  width: auto;
}

.footer-lecture {
  font-weight: 600;
}

.footer-progress {
  font-family: 'Courier New', monospace;
}
```

### 6.4 Speaker Notes Enhancement

Generate richer speaker notes from YAML fields:

```typescript
function generateSpeakerNotes(subtopic: SubtopicEnhanced, content: SlideContent): string {
  let notes = `<aside class="notes">`;
  
  // Teaching guidance
  if (subtopic.teaching_notes) {
    notes += `<h4>Teaching Guidance</h4><p>${subtopic.teaching_notes}</p>`;
  }
  
  // Key concepts reminder
  if (subtopic.key_concepts) {
    notes += `<h4>Key Concepts to Cover</h4><ul>`;
    notes += subtopic.key_concepts.map(c => 
      `<li><strong>${c.name}</strong> (${c.cognitive_level}): ${c.terms.join(", ")}</li>`
    ).join("");
    notes += `</ul>`;
  }
  
  // Discussion prompts
  if (subtopic.discussion_prompts) {
    notes += `<h4>Discussion Prompts</h4><ul>`;
    notes += subtopic.discussion_prompts.map(p => `<li>${p}</li>`).join("");
    notes += `</ul>`;
  }
  
  // Common misconceptions
  if (subtopic.common_misconceptions) {
    notes += `<h4>⚠️ Watch For</h4><ul>`;
    notes += subtopic.common_misconceptions.map(m => `<li>${m}</li>`).join("");
    notes += `</ul>`;
  }
  
  // Wiki provenance
  if (content.provenance.length > 0) {
    notes += `<h4>Grounded In</h4><ul>`;
    notes += content.provenance.map(p => 
      `<li>${p.title} → ${p.heading} (score: ${p.score})</li>`
    ).join("");
    notes += `</ul>`;
  }
  
  notes += `</aside>`;
  return notes;
}
```

---

## 7. Implementation Roadmap

### Phase 1: Schema Extension (Week 1)
- [ ] Update `types.ts` with new interfaces
- [ ] Extend `yaml.ts` parser to support new fields (backward compatible)
- [ ] Add validation for key_concepts, wiki_references, learning_outcomes
- [ ] Create schema documentation and examples

### Phase 2: Wiki Integration (Week 1-2)
- [ ] Enhance `retrieval.ts` with priority slug matching
- [ ] Integrate section-specific retrieval
- [ ] Add WAAgriContextAgent invocation for complex queries
- [ ] Test retrieval quality with sample queries

### Phase 3: Rendering Enhancements (Week 2)
- [ ] Implement slide type templates (activity, example, case_study)
- [ ] Add key concepts slide generator
- [ ] Enhance speaker notes generation
- [ ] Add footer with dawg logo
- [ ] Update CSS with new slide classes

### Phase 4: Content Migration (Week 3-4)
- [ ] Audit L01-L14 YAML files
- [ ] Add key_concepts to all subtopics (human curation)
- [ ] Map to Learning_Outcomes.md
- [ ] Add wiki_references where relevant
- [ ] Add teaching_notes and discussion_prompts

### Phase 5: Validation & Refinement (Week 4)
- [ ] Run generation pipeline on all lectures
- [ ] Validate learning outcomes coverage
- [ ] Review slide quality with stakeholders
- [ ] Iterate based on feedback

---

## 8. Example: Enhanced L01 Subtopic

```yaml
- title: "Water-Use Efficiency: The French-Schultz Benchmark"
  
  # Core narrative (existing)
  description: >
    Introduce water-use efficiency (WUE) as the single most useful benchmark
    for comparing crop performance in Mediterranean-type environments...
  
  # Explicit learning targets (NEW)
  key_concepts:
    - name: "Water-use efficiency definition"
      terms: ["WUE", "kg/ha/mm", "transpiration efficiency"]
      cognitive_level: "understand"
      
    - name: "French-Schultz framework"
      terms: ["growing season rainfall", "soil evaporation", "110mm", "20-25 kg/ha/mm"]
      cognitive_level: "apply"
      
    - name: "Yield gap analysis"
      terms: ["yield gap", "water-limited potential", "actual yield"]
      cognitive_level: "analyze"
  
  # Direct wiki grounding (NEW)
  wiki_references:
    - slug: "water_use_efficiency_and_yield_potential_in_dryland_systems"
      relevance: "foundation"
      sections: ["Water Use Efficiency (WUE)", "Yield Estimation"]
      
    - slug: "cereal_crop_development_and_yield_potential_in_western_austr"
      relevance: "example"
      query: "WUE wheat barley canola"
  
  # Outcomes alignment (NEW)
  learning_outcomes:
    - "Gain an understanding of WUE in rainfed cropping systems of Mediterranean-type environments"
    - "Use WUE for comparison of wheat crop performance"
  
  # Pedagogical metadata (NEW)
  estimated_time_minutes: 12
  slide_type: "concept"
  interactivity: "medium"
  
  # Teaching guidance (NEW)
  teaching_notes: >
    Draw the French-Schultz graph on board before showing slide.
    Have students predict the slope before revealing.
    Use current season rainfall (look up Perth BOM) to calculate 
    expected WUE benchmark for this year.
  
  discussion_prompts:
    - "If your paddock yielded 3.2 t/ha with 380mm rainfall, are you at potential?"
    - "What factors would cause a paddock to fall below the potential line?"
  
  common_misconceptions:
    - "Students think WUE is yield divided by total annual rainfall (it's growing season only)"
    - "Confusion about whether the 110mm is subtracted or included in the x-axis"
  
  # Content strategy (NEW)
  synthesis_mode: "wiki-grounded"
  max_wiki_sources: 4
  
  # Figures (existing)
  figure_id: "Fig-L01-FrenchSchultz"
  image_prompt: >
    Scatter plot in the classic French-Schultz style...
```

---

## 9. Benefits Summary

### For Human-in-the-Loop Content Review
- ✅ **Explicit key concepts** make curation transparent and targetable
- ✅ **Cognitive levels** guide appropriate assessment and activity design
- ✅ **Teaching notes** preserve institutional knowledge and best practices
- ✅ **Misconceptions** help new tutors anticipate student struggles

### For Automated Content Generation
- ✅ **Wiki references** provide deterministic grounding sources
- ✅ **Synthesis modes** allow flexible generation strategies
- ✅ **Key concept terms** boost retrieval relevance
- ✅ **Slide types** enable varied, pedagogically appropriate layouts

### For Learning Outcomes Alignment
- ✅ **Explicit mapping** enables gap analysis and audit trails
- ✅ **Coverage tracking** ensures no outcome is orphaned
- ✅ **Assessment alignment** supports constructive alignment principles

### For RevealJS Presentation Quality
- ✅ **Slide type variety** breaks monotony, increases engagement
- ✅ **Enhanced speaker notes** support consistent delivery across instructors
- ✅ **Footer navigation** improves orientation and professionalism
- ✅ **Activity slides** encourage active learning moments

---

## 10. Open Questions for Discussion

1. **Key Concepts Granularity**: How many key concepts per subtopic? (Proposed: 2-4)

2. **Wiki Agent Frequency**: Should every subtopic invoke the agent, or only when explicit `agent_query` is present?

3. **Cognitive Level Distribution**: Should we enforce a distribution (e.g., 30% understand, 40% apply, 20% analyze, 10% evaluate) across a lecture?

4. **Slide Type Balance**: What's the ideal ratio of concept:example:activity slides?

5. **Backward Compatibility**: Should we maintain full backward compatibility with existing YAMLs (gradual enhancement) or require migration?

6. **Learning Outcomes Format**: Should we use IDs (LO-01) or full text matching for alignment?

7. **Wiki Reference Validation**: Should the parser validate that referenced slugs exist in wa_wiki/?

8. **Synthesis Mode Default**: What should be the default `synthesis_mode` when not specified?

---

## 11. Next Steps

**Immediate Actions:**
1. ✅ **Review this proposal** with project stakeholders
2. ⏳ **Prototype Phase 1** (schema extension) with L01 as test case
3. ⏳ **Validate wiki retrieval** enhancements with sample queries
4. ⏳ **Design slide templates** in HTML/CSS mockups
5. ⏳ **Plan content migration** strategy for L01-L14

**Decision Points:**
- Approve enhanced schema (or request modifications)
- Agree on backward compatibility strategy
- Prioritize which new features to implement first
- Assign roles for human curation (key concepts, teaching notes)

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-20  
**Author:** AI Assistant (GitHub Copilot)  
**Reviewers:** [To be assigned]
