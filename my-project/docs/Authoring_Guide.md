# SCIE3314 YAML Authoring Guide

**For instructors creating or enhancing lecture content**  
**Quick reference for the enhanced YAML schema**

---

## 📝 Basic Structure

Every lecture YAML has this top-level structure:

```yaml
lecture_id: "L01"
topic: "Your Lecture Title"
auto_figures: true
duration_minutes: 100
learning_outcomes: [...]
prerequisites: [...]
wiki_context: [...]
pedagogical_approach: "systems-thinking"

subtopics:
  - title: "First Subtopic"
    description: >
      Long narrative...
    key_concepts: [...]
    # ... more fields
```

---

## 🎯 Key Concepts (NEW - Human Curated)

**Purpose**: Explicitly define what students must master from each subtopic.

### Structure
```yaml
key_concepts:
  - name: "Water-use efficiency definition"
    terms: ["WUE", "kg/ha/mm", "transpiration efficiency"]
    cognitive_level: "understand"
    assessment_prompt: "Define WUE in your own words"
```

### Cognitive Levels (Bloom's Taxonomy)
Use ONE of these for each concept:

| Level | Use When | Example Verbs |
|-------|----------|---------------|
| `remember` | Recalling facts | list, name, identify, recall |
| `understand` | Explaining ideas | describe, explain, summarize, interpret |
| `apply` | Using in new situations | calculate, demonstrate, solve, apply |
| `analyze` | Breaking down relationships | compare, contrast, analyze, differentiate |
| `evaluate` | Making judgments | assess, critique, justify, evaluate |
| `create` | Producing new work | design, formulate, construct, create |

### Guidelines
- ✅ **2-4 key concepts per subtopic** (not too many!)
- ✅ **Use student-facing language** (avoid jargon without explanation)
- ✅ **Match cognitive level to learning outcome** (if outcome says "apply", concept should too)
- ✅ **Include assessment prompt** if you want students to self-check

### Example
```yaml
key_concepts:
  - name: "System definition"
    terms: ["system", "interacting elements", "unified whole", "emergent properties"]
    cognitive_level: "understand"
    assessment_prompt: "Explain what makes a cropping system a 'system'"
    
  - name: "Feedback loops in cropping"
    terms: ["positive feedback", "negative feedback", "equilibrium", "amplification"]
    cognitive_level: "analyze"
    assessment_prompt: "Draw a feedback loop for stubble retention decisions"
```

---

## 📚 Wiki References (NEW - Direct Grounding)

**Purpose**: Explicitly link to `wa_wiki/` documents that ground this subtopic's content.

### Structure
```yaml
wiki_references:
  - slug: "water_use_efficiency_and_yield_potential_in_dryland_systems"
    relevance: "foundation"
    sections: ["Water Use Efficiency (WUE)", "Yield Estimation"]
    
  - slug: "cereal_crop_development_and_yield_potential"
    relevance: "example"
    query: "WUE wheat barley 20 kg/ha/mm"
```

### Relevance Types
| Type | Meaning | Use When |
|------|---------|----------|
| `foundation` | Core theory/framework | This wiki doc defines the concept |
| `example` | WA field example | This wiki doc shows it in practice |
| `context` | Background information | Students need this to understand |
| `extension` | Advanced/optional | For deeper dive |

### Fields
- **`slug`** (required): Filename without `.md` (e.g., `stubble_management_western_australia`)
- **`relevance`** (required): See table above
- **`sections`** (optional): List of specific headings to retrieve from that document
- **`query`** (optional): Custom search query for retrieval (overrides default)

### Guidelines
- ✅ **Check the slug exists**: Look in `data/wa_wiki/` folder
- ✅ **Use `sections` to be precise**: Don't retrieve whole doc if you only need one section
- ✅ **Use `query` for nuanced retrieval**: E.g., "herbicide resistance annual ryegrass"
- ❌ **Don't over-reference**: 2-3 wiki docs per subtopic is usually enough

### Example
```yaml
wiki_references:
  - slug: "french_schultz_framework_wue"
    relevance: "foundation"
    sections: ["Calculating WUE", "The 110mm Rule"]
    
  - slug: "cereal_yield_potential_western_australia"
    relevance: "example"
    query: "wheat yield WUE Merredin Katanning"
```

---

## 🎓 Learning Outcomes Mapping (NEW)

**Purpose**: Align this subtopic to unit-wide learning outcomes from `Learning_Outcomes.md`.

### Structure
```yaml
learning_outcomes:
  - "Gain an understanding of WUE in rainfed cropping systems"
  - "Use WUE for comparison of wheat crop performance"
```

### Guidelines
- ✅ **Copy exact text** from `Learning_Outcomes.md` (or use ID if implemented)
- ✅ **Map 1-3 outcomes per subtopic** (not all outcomes need to be in every subtopic)
- ✅ **Be honest**: Only claim outcomes this subtopic actually addresses
- ❌ **Don't orphan outcomes**: Make sure every unit outcome appears in at least one lecture

### How to Find Relevant Outcomes
1. Open [`data/Learning_Outcomes.md`](../data/Learning_Outcomes.md)
2. Search for keywords from your subtopic (e.g., "WUE", "rotation", "precision")
3. Copy the full outcome text into your YAML

---

## 📖 Teaching Guidance (NEW - For You!)

**Purpose**: Capture your teaching experience so other instructors can deliver this content well.

### Structure
```yaml
teaching_notes: >
  START with Malthusian population dynamics as historical hook.
  Students have heard "exponential growth" but haven't thought 
  about it as a differential equation system.
  
  BOARD WORK: Draw a simple system diagram with students calling 
  out components. Start with "wheat crop" in center, then add: 
  soil, water, nitrogen, weeds, machinery, decisions, markets.
  
  KEY POINT: Emphasize that "everything affects everything" is NOT 
  systems thinking—we need to identify WHICH connections matter most.
  
  TRANSITION: "We'll spend the whole unit learning to think this way."

discussion_prompts:
  - "What is the system boundary for your family farm?"
  - "Give an example of a positive feedback loop in cropping"
  - "When does 'more complexity' help vs hurt understanding?"

common_misconceptions:
  - "Students think 'system' just means 'complicated thing'—clarify it's about RELATIONSHIPS"
  - "Confusion between correlation and causation in system diagrams"
  - "Thinking feedback loops are always stabilizing (negative feedback bias)"
```

### Fields Explained

#### `teaching_notes` (String, long text)
Your advice to another instructor delivering this slide. Include:
- Opening hook or question
- Board work or demonstrations
- Key points to emphasize
- Common student questions
- Timing notes ("spend 5 min on this", "don't rush the calculation")
- Transition to next slide

**Tone**: Conversational, like you're briefing a colleague.

#### `discussion_prompts` (List of strings)
Questions to ask students:
- Think-pair-share prompts
- Clicker questions
- Open discussion starters
- Exit questions

**Guidelines**:
- ✅ Open-ended (not just yes/no)
- ✅ Connected to WA context where possible
- ✅ Encourage system-level thinking

#### `common_misconceptions` (List of strings)
Things students get wrong or confused about:
- Terminology mix-ups
- Conceptual errors
- Calculation mistakes
- Over-simplifications

**Guidelines**:
- ✅ Be specific ("Students think X" not "Students are confused")
- ✅ Include correction strategy if possible
- ✅ Based on your actual teaching experience

---

## 🎬 Slide Types & Interactivity (NEW)

**Purpose**: Control how the slide is rendered and how students engage.

### Structure
```yaml
estimated_time_minutes: 10
slide_type: "concept"
interactivity: "medium"
```

### Slide Types
| Type | Use For | Features |
|------|---------|----------|
| `concept` | Introducing theory | Standard layout, bullet points, takeaway box |
| `example` | WA field case | Context card, wiki source chip, practical focus |
| `activity` | Think-pair-share | Prompts, timer, instructions for activity |
| `discussion` | Class conversation | Open-ended questions, poll options |
| `case_study` | Real-world scenario | Scenario card, decision question, trade-offs |

### Interactivity Levels
| Level | Student Role | Examples |
|-------|--------------|----------|
| `low` | Listen, observe | Lecture, demo, worked example |
| `medium` | Respond, discuss | Clicker questions, brief pair talk |
| `high` | Create, decide | Case study decisions, calculations, drawing |

### Guidelines
- ✅ **Vary slide types**: Don't make every slide `concept`
- ✅ **Match time to type**: Activities need more time than concepts
- ✅ **Sequence matters**: Concept → Example → Activity is a good flow
- ✅ **High interactivity needs setup**: Ensure discussion prompts are in YAML

---

## 🎨 Figures (Existing - Enhanced)

**Purpose**: Specify figures to be generated (GenAI, Mermaid, or charts).

### Structure
```yaml
figure_id: "Fig-L01-FrenchSchultz"
image_prompt: >
  Scatter plot in the classic French-Schultz style.
  X-axis: Growing season water use (mm), range 100-500mm.
  Y-axis: Wheat grain yield (t/ha), range 0-6 t/ha.
  
  Boundary line starting at x-intercept ~110mm, slope 22 kg/ha/mm.
  Gold data points below line representing real paddock yields.
  Vertical arrow showing "yield gap" annotation.
  
  UWA blue (#27348B) for boundary line.
  Gold (#E2B600) for data points.
  Clean academic style, --ar 16:9, --no text.
```

### Guidelines
- ✅ **Be specific**: Axis ranges, colors, annotations
- ✅ **Use UWA colors**: Blue `#27348B`, Gold `#E2B600`
- ✅ **Specify aspect ratio**: `--ar 16:9` for slides
- ✅ **No text in image**: Use `--no text` (overlaid via HTML instead)
- ✅ **Reference existing figures**: Check other lectures for similar diagrams

---

## 🧪 Content Generation Strategy (NEW)

**Purpose**: Control how slide content is synthesized from wiki sources.

### Structure
```yaml
synthesis_mode: "wiki-grounded"
retrieval_strategy: "hybrid"
max_wiki_sources: 3
```

### Synthesis Modes
| Mode | Behavior | Use When |
|------|----------|----------|
| `wiki-grounded` | LLM uses wiki context only | You want factual, grounded content |
| `llm-creative` | LLM can elaborate beyond wiki | You want engaging narrative |
| `hybrid` | Wiki + LLM elaboration | Balance between accuracy and engagement |
| `manual` | No LLM, use wiki excerpts directly | You've written detailed description |

### Retrieval Strategies
| Strategy | Behavior | Use When |
|----------|----------|----------|
| `semantic` | Uses term overlap + boosting | Conceptual topics |
| `keyword` | Exact keyword matching | Specific facts, names, places |
| `hybrid` | Combines both approaches | Most subtopics (default) |

### Guidelines
- ✅ **Default to `wiki-grounded` + `hybrid`**: Safe, balanced approach
- ✅ **Use `manual` for activities**: You're designing the activity, not generating it
- ✅ **Limit sources to 3-4**: More sources = more noise, not clarity

---

## ✅ Validation Checklist

Before committing your YAML, check:

- [ ] **Key concepts**: 2-4 per subtopic, with cognitive levels
- [ ] **Wiki references**: At least 1-2 per subtopic, slugs exist in `data/wa_wiki/`
- [ ] **Learning outcomes**: Mapped to unit outcomes in `Learning_Outcomes.md`
- [ ] **Teaching notes**: Actionable guidance for another instructor
- [ ] **Slide type**: Appropriate for content (not all `concept`)
- [ ] **Discussion prompts**: At least 1-2 open-ended questions
- [ ] **Estimated time**: Realistic (8-15 min per subtopic)
- [ ] **YAML syntax**: Valid indentation, no tabs, strings quoted if needed

### Quick Validation
Run the parser to catch errors:
```powershell
node --experimental-strip-types src/cli.ts generate:lecture --input data/YAML/L01_Introduction_to_Cropping_Systems.yaml --output presentations
```

If it generates HTML without errors, your YAML is valid!

---

## 📖 Example: Complete Subtopic

Here's a fully-enhanced subtopic for reference:

```yaml
- title: "Water-Use Efficiency: The French-Schultz Benchmark"
  
  description: >
    Introduce water-use efficiency (WUE) as the single most useful benchmark
    for comparing crop performance in Mediterranean-type environments. Define
    WUE as grain yield produced per millimetre of water used (kg/ha/mm), and
    present the French and Schultz (1984) framework developed in South Australia
    and universally applied across southern Australia.
  
  key_concepts:
    - name: "Water-use efficiency definition"
      terms: ["WUE", "kg/ha/mm", "transpiration efficiency"]
      cognitive_level: "understand"
      
    - name: "French-Schultz calculation"
      terms: ["growing season rainfall", "soil evaporation", "110mm constant"]
      cognitive_level: "apply"
      assessment_prompt: "Calculate expected yield for 350mm GSR"
      
    - name: "Yield gap interpretation"
      terms: ["yield gap", "water-limited potential", "constraint diagnosis"]
      cognitive_level: "analyze"
  
  wiki_references:
    - slug: "water_use_efficiency_and_yield_potential_in_dryland_systems"
      relevance: "foundation"
      sections: ["Water Use Efficiency (WUE)", "French and Schultz Framework"]
      
    - slug: "cereal_crop_development_and_yield_potential_in_western_austr"
      relevance: "example"
      query: "WUE wheat barley 20 kg/ha/mm transpiration"
  
  learning_outcomes:
    - "Gain an understanding of WUE in rainfed cropping systems"
    - "Use WUE for comparison of wheat crop performance"
  
  estimated_time_minutes: 12
  slide_type: "example"
  interactivity: "medium"
  
  teaching_notes: >
    BEFORE SLIDE: Draw blank axes on board. Ask students to predict
    yield for 200, 300, 400mm water. Plot their guesses. THEN show slide.
    
    CALCULATION DEMO: Use CURRENT SEASON rainfall from BOM.
    Example: "Perth has had 180mm Apr-Jul. If we get average Aug-Oct (120mm),
    that's 300mm total. Minus 110mm evaporation = 190mm transpired.
    At 22 kg/ha/mm, that's 4.2 t/ha potential for wheat this year."
    
    KEY INSIGHT: "If your paddock did 2.8 t/ha with 300mm, you're 1.4 t/ha
    below potential. That's a DIAGNOSTIC SIGNAL—now we ask WHY?"
  
  discussion_prompts:
    - "If your paddock yielded 3.2 t/ha with 380mm GSR, are you at potential?"
    - "What factors would push a paddock below the French-Schultz line?"
    - "Why is the evaporation constant ~110mm? Could it vary?"
  
  common_misconceptions:
    - "Students think WUE is yield/total annual rainfall (it's growing season only)"
    - "Confusion about whether 110mm is subtracted or included in x-axis"
    - "Believing the line is a target (it's a ceiling, not a goal)"
  
  synthesis_mode: "wiki-grounded"
  retrieval_strategy: "hybrid"
  max_wiki_sources: 4
  
  figure_id: "Fig-L01-FrenchSchultz"
  image_prompt: >
    Scatter plot: X-axis 100-500mm water, Y-axis 0-6 t/ha yield.
    Boundary line from 110mm intercept, slope 22 kg/ha/mm.
    Gold data points below line. Vertical arrow showing "yield gap".
    UWA blue line, gold points, clean academic style, --ar 16:9, --no text.
```

---

## 🆘 Common Issues & Solutions

### Issue: Parser rejects my YAML
**Solution**: Check indentation (use spaces, not tabs). YAML is whitespace-sensitive.

### Issue: Wiki slug not found
**Solution**: Check filename exactly matches (case-sensitive, underscores not spaces).
List files: `ls data/wa_wiki/`

### Issue: Learning outcome not recognized
**Solution**: Copy exact text from `Learning_Outcomes.md`. No abbreviations.

### Issue: Figure not generating
**Solution**: Ensure `auto_figures: true` at lecture level. Check `figure_id` is unique.

### Issue: Teaching notes too long / not rendering
**Solution**: Keep under ~500 words. Use `>` for multiline strings in YAML.

---

## 📞 Getting Help

- **Schema reference**: [`docs/YAML_Structure_Proposal.md`](YAML_Structure_Proposal.md)
- **Full example**: [`docs/L01_Enhanced_Sample.yaml`](L01_Enhanced_Sample.yaml)
- **Roadmap**: [`docs/Implementation_Roadmap.md`](Implementation_Roadmap.md)
- **Test your YAML**: `npm run generate:lecture -- --input data/YAML/your_file.yaml`

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-20  
**For:** SCIE3314 Content Authors
