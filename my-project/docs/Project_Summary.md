# Project Enhancement Summary - SCIE3314 RevealJS Pipeline

**Date:** 2026-07-20  
**Status:** Proposal Phase — Ready for Review

---

## 📋 Overview

This document summarizes the proposed enhancements to the SCIE3314 lecture generation pipeline to better support **human-in-the-loop content curation**, **wiki-grounded synthesis**, **learning outcomes alignment**, and **pedagogically-aware presentation design**.

---

## 🎯 Project Goals (Updated)

### Current State
✅ Deterministic YAML → RevealJS HTML generation  
✅ Wiki corpus retrieval with provenance tracking  
✅ LLM-optional content synthesis  
✅ UWA branding and styling

### Proposed Enhancements
🔲 **Explicit key concepts** — Human-curated learning targets per subtopic  
🔲 **Wiki integration** — Direct references to `wa_wiki/` documents with section targeting  
🔲 **Learning outcomes alignment** — Mapping to `Learning_Outcomes.md` with coverage tracking  
🔲 **Teaching guidance** — Speaker notes with prompts, misconceptions, and timing  
🔲 **Slide type variety** — Activity, example, case study templates beyond concept slides  
🔲 **Pedagogical metadata** — Cognitive levels (Bloom's), interactivity, estimated time  
🔲 **WAAgriContextAgent** — Integration for complex wiki queries

---

## 📚 Documentation Created

### 1. **[YAML Structure Proposal](YAML_Structure_Proposal.md)**
**Purpose:** Complete specification of the enhanced YAML schema  
**Contents:**
- Current state analysis
- Proposed schema with all new fields
- Cognitive levels & Bloom's taxonomy integration
- Wiki integration strategy (retrieval + agent)
- Learning outcomes alignment approach
- RevealJS design enhancements (slide types, footer, speaker notes)
- Benefits summary & open questions

**Key Sections:**
- Enhanced subtopic schema (key_concepts, wiki_references, teaching_notes)
- Retrieval workflow diagrams
- Slide type templates (concept, activity, example, case_study)
- Implementation benefits for humans & automation

### 2. **[L01 Enhanced Sample](L01_Enhanced_Sample.yaml)**
**Purpose:** Concrete example of the new structure in practice  
**Contents:**
- 4 fully-enhanced subtopics demonstrating:
  - Concept slide with key concepts
  - Activity slide with think-pair-share
  - Example slide with WUE calculation
  - Case study slide with stubble decision
- Complete field usage showing all new YAML features

**Use Cases:**
- Reference when authoring new content
- Template for migrating existing lectures
- Testing schema implementation

### 3. **[Implementation Roadmap](Implementation_Roadmap.md)**
**Purpose:** Phased plan for building and deploying enhancements  
**Contents:**
- 5-phase implementation plan (4 weeks)
- Tasks, deliverables, success criteria for each phase
- Dependencies & risk mitigation
- Timeline with Gantt-style visualization
- Success metrics (quantitative & qualitative)
- Open questions for stakeholder decision

**Phases:**
1. Schema Extension & Validation (Week 1)
2. Wiki Integration Enhancement (Week 1-2)
3. Rendering & Slide Templates (Week 2)
4. Content Migration & Curation (Week 3-4)
5. Validation & Quality Assurance (Week 4)

### 4. **[Authoring Guide](Authoring_Guide.md)**
**Purpose:** Quick reference for instructors writing YAML content  
**Contents:**
- Field-by-field explanations with examples
- Cognitive level selection guide (Bloom's taxonomy)
- Wiki reference best practices
- Teaching notes writing tips
- Slide type selection matrix
- Common issues & troubleshooting
- Complete subtopic example

**Audience:** Instructors, content authors, teaching assistants

### 5. **[README.md](../README.md)** (Updated)
**Purpose:** Project overview with enhanced goals and workflow  
**Contents:**
- Updated project goals emphasizing human curation
- Enhanced YAML schema status
- Workflow diagram (authoring → retrieval → synthesis → rendering)
- Key features with checkmarks
- Next steps and decision points

---

## 🔑 Key Enhancements Explained

### 1. **Key Concepts** (Human-Curated)
```yaml
key_concepts:
  - name: "Water-use efficiency definition"
    terms: ["WUE", "kg/ha/mm", "transpiration efficiency"]
    cognitive_level: "understand"
    assessment_prompt: "Define WUE in your own words"
```

**Why:** Makes learning targets explicit and controllable by instructors, not inferred by LLMs.  
**Benefit:** Human-in-the-loop can fine-tune exactly what students should master.

### 2. **Wiki References** (Direct Grounding)
```yaml
wiki_references:
  - slug: "water_use_efficiency_and_yield_potential_in_dryland_systems"
    relevance: "foundation"
    sections: ["Water Use Efficiency (WUE)", "French and Schultz Framework"]
```

**Why:** Explicitly ties content to verified WA agricultural knowledge sources.  
**Benefit:** Transparency, auditability, and higher retrieval quality.

### 3. **Learning Outcomes Alignment**
```yaml
learning_outcomes:
  - "Gain an understanding of WUE in rainfed cropping systems"
  - "Use WUE for comparison of wheat crop performance"
```

**Why:** Ensures every lecture subtopic maps to unit-wide objectives.  
**Benefit:** Coverage tracking, gap analysis, constructive alignment.

### 4. **Teaching Guidance**
```yaml
teaching_notes: >
  START with historical hook. BOARD WORK: Draw axes, ask students
  to predict. KEY INSIGHT: Yield gap is a diagnostic signal, not failure.

discussion_prompts:
  - "If your paddock yielded 3.2 t/ha with 380mm GSR, are you at potential?"

common_misconceptions:
  - "Students think WUE is yield/total rainfall (it's growing season only)"
```

**Why:** Captures instructor experience and best practices for future delivery.  
**Benefit:** Consistent quality across instructors, onboarding support for new tutors.

### 5. **Slide Type Variety**
```yaml
slide_type: "activity"       # concept | activity | example | case_study | discussion
interactivity: "high"         # low | medium | high
estimated_time_minutes: 10
```

**Why:** Different content requires different pedagogical approaches.  
**Benefit:** Breaks monotony, increases engagement, supports active learning.

---

## 💡 How It All Fits Together

```
┌──────────────────────────────────────────────────────────────┐
│ INSTRUCTOR AUTHORS YAML                                      │
│  • Key concepts (what students must learn)                   │
│  • Wiki references (where truth comes from)                  │
│  • Teaching notes (how to deliver it)                        │
│  • Learning outcomes (why we teach it)                       │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ RETRIEVAL ENGINE                                             │
│  • Searches wa_wiki/ corpus using key concept terms          │
│  • Prioritizes direct slug references                        │
│  • Filters by sections if specified                          │
│  • Invokes WAAgriContextAgent for complex queries            │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ SYNTHESIS LAYER (LLM or deterministic)                       │
│  • Generates student-facing bullets from wiki excerpts       │
│  • Embeds teaching notes + prompts in speaker notes          │
│  • Preserves provenance (which wiki doc → which slide)       │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ REVEALJS RENDERER                                            │
│  • Applies slide type template (concept/activity/example)    │
│  • Adds footer with UWA dawg logo + navigation               │
│  • Generates speaker notes with guidance + misconceptions    │
│  • Outputs HTML with provenance JSON embedded                │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ INSTRUCTOR REVIEWS                                           │
│  • Checks slides match intent                                │
│  • Verifies wiki grounding is relevant                       │
│  • Iterates on key concepts or teaching notes if needed      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Expected Benefits

### For Instructors
- ✅ **Control:** Explicit key concepts, not LLM-inferred
- ✅ **Transparency:** Know exactly which wiki docs inform each slide
- ✅ **Consistency:** Teaching notes preserve best practices
- ✅ **Quality:** Human curation where it matters (concepts, pedagogy)

### For Students
- ✅ **Clarity:** Explicit learning targets ("master these 3 concepts")
- ✅ **Engagement:** Varied slide types (not all lecture)
- ✅ **Grounding:** All claims traceable to WA agriculture sources
- ✅ **Assessment alignment:** Cognitive levels match learning outcomes

### For Course Management
- ✅ **Alignment:** All unit outcomes covered, no gaps
- ✅ **Audit:** Provenance tracking for quality assurance
- ✅ **Scalability:** New instructors can use teaching notes
- ✅ **Iteration:** Easy to enhance one lecture without breaking others

---

## 🚦 Decision Points

### Immediate Decisions Needed
1. **Approve schema enhancements?** → Proceed to Phase 1 implementation
2. **Backward compatibility strategy?** → Gradual enhancement or require full migration?
3. **Cognitive level enforcement?** → Require distribution across Bloom's levels, or flexible?
4. **Wiki agent usage?** → Invoke by default, or only when explicit `agent_query`?
5. **Content migration owner?** → Who curates key concepts for L01-L14?

### Open Questions (See [Proposal Doc](YAML_Structure_Proposal.md#10-open-questions-for-discussion))
- Key concepts granularity (2-4 per subtopic?)
- Slide type balance (target ratio?)
- Learning outcomes format (IDs vs full text?)
- Wiki reference strictness (error or warn if slug missing?)

---

## 📅 Next Steps

### This Week
1. ✅ **Review all documentation** with project stakeholders
2. 🔲 **Hold kickoff meeting** to align on timeline and roles
3. 🔲 **Decide on open questions** listed above
4. 🔲 **Assign Phase 1 tasks** (schema extension in `src/types.ts` and `src/yaml.ts`)

### Next 4 Weeks (If Approved)
- **Week 1:** Schema extension + wiki integration enhancement
- **Week 2:** Rendering improvements + slide templates
- **Week 3-4:** Content migration (L01-L14) + validation
- **Week 4:** Quality assurance + stakeholder review

### Long-Term
- Expand to other units beyond SCIE3314
- Build authoring UI (web-based YAML editor)
- Integrate with LMS for automated delivery
- Student analytics (which slides are effective?)

---

## 📁 Files Created in This Session

```
my-project/
├── docs/
│   ├── YAML_Structure_Proposal.md     ← Complete schema specification
│   ├── L01_Enhanced_Sample.yaml       ← Concrete example with 4 subtopics
│   ├── Implementation_Roadmap.md      ← 5-phase plan with timeline
│   ├── Authoring_Guide.md             ← Quick reference for instructors
│   └── Project_Summary.md             ← THIS DOCUMENT
└── README.md (updated)                ← Project overview with new goals
```

---

## 🎓 Pedagogical Foundation

This enhancement is grounded in:

1. **Constructive Alignment** (Biggs & Tang, 2011)
   - Learning outcomes → teaching activities → assessment aligned
   
2. **Bloom's Revised Taxonomy** (Anderson & Krathwohl, 2001)
   - Explicit cognitive levels for each learning target
   
3. **Active Learning** (Freeman et al., 2014)
   - Activity slides, think-pair-share, case studies
   
4. **Evidence-Based Teaching** (Wieman, 2014)
   - Provenance tracking, iterative refinement based on data
   
5. **Backward Design** (Wiggins & McTighe, 2005)
   - Start with learning outcomes, then design instruction

---

## 📞 Contact & Feedback

**Project Lead:** [To be assigned]  
**Content SME:** [To be assigned]  
**Technical Lead:** [To be assigned]

**Feedback:** Please review documents and provide comments via:
- GitHub issues/PRs (if using version control)
- Email with document name in subject line
- Meeting discussion (schedule kickoff)

---

## ✅ Acceptance Criteria for Proposal Approval

This proposal is **ready for implementation** when stakeholders agree that:

- [ ] The enhanced schema supports human-in-the-loop content curation
- [ ] Wiki integration approach is technically sound
- [ ] Learning outcomes alignment provides value
- [ ] Teaching guidance fields will be used by instructors
- [ ] Implementation timeline (4 weeks) is realistic
- [ ] Resources (SME time, developer time) are available
- [ ] Open questions have been resolved
- [ ] Backward compatibility strategy is acceptable

---

**Document Status:** Complete — Ready for Stakeholder Review  
**Last Updated:** 2026-07-20  
**Version:** 1.0  
**Author:** AI Assistant (GitHub Copilot) in collaboration with project team

---

## 🙏 Acknowledgments

This proposal builds on:
- Existing SCIE3314 curriculum and lecture content
- WA agricultural knowledge wiki (170+ documents)
- RevealJS presentation framework
- Feedback from instructors and students (implied in misconceptions, teaching notes structure)

Thank you to all contributors to the WA agriculture knowledge base and the SCIE3314 teaching team.
