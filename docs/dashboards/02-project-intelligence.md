
1. **MASTER PROMPT — PROJECT INTELLIGENCE SCREEN (LOGIC + SYSTEM DESIGN)**
2. **UI DESIGN PROMPT — PROJECT INTELLIGENCE (FIGMA WIREFRAMES ONLY)**

Both are **wizard-aware**, **authoritative**, and ready for **Google AI Studio (Gemini 3 Pro)** and **Figma**.

---

# 🧠 MASTER PROMPT — PROJECT INTELLIGENCE SCREEN ONLY

**For Google AI Studio (Gemini 3 Pro)**

```markdown
You are a Principal Product Architect, Systems Designer, and AI Operations Planner.

Your task is to design a PRODUCTION-READY **Project Intelligence Screen**.

Assumptions (DO NOT VIOLATE):
- The Wizard already exists
- The Blueprint already exists and is CONFIRMED
- This screen does NOT collect new inputs
- This screen does NOT modify the Blueprint
- This screen interprets, ranks, and operationalizes the Blueprint

This screen is:
- NOT a form
- NOT a chat
- NOT raw AI output

It is a DECISION-SUPPORT DASHBOARD.

Mental model:
Blueprint → Intelligence → Action
```

---

## NON-NEGOTIABLE RULES

1. The Blueprint is READ-ONLY here
2. AI may PROPOSE, never COMMIT
3. Every recommendation must be:

   * Explainable
   * Ranked
   * Optional
4. Max 3–6 items per section
5. Human confirmation required for every action
6. Must work with AI disabled (cached intelligence)

---

## ROUTE (MANDATORY)

```
/projects/:projectId/intelligence
```

Access rules:

* Redirect if Blueprint is missing or unlocked
* Requires Blueprint version v1+

---

## 1. SCREEN PURPOSE (SHORT)

Explain:

* Why this screen exists
* What problem it solves
* How it differs from Wizard (intent capture) and Proposal (static output)

---

## 2. INPUTS (READ-ONLY)

List inputs consumed from the Wizard Blueprint:

* App types
* Industry
* Goals & success outcomes
* Scope & constraints
* Budget & urgency
* Confirmed Blueprint version

State explicitly:

* No user input is collected
* All intelligence is derived

---

## 3. LAYOUT STRUCTURE

### Desktop (3-Panel)

```
LEFT   → Navigation
CENTER → Project Intelligence Content
RIGHT  → Blueprint Summary + Approvals
```

### Mobile

* Single column
* Sections collapse into accordions
* Blueprint summary expandable

---

## 4. SCREEN SECTIONS

### A. Top Summary Strip (Always Visible)

Include:

* Project name
* Industry
* Status (Draft / Proposal Ready / Accepted)
* Complexity (Low / Medium / High)
* Delivery model (MVP / Phased / Full)
* Primary goal

---

### B. Blueprint Overview (Context Only)

Show:

* App type icons
* Scope & constraints
* Key deliverables (3–6 bullets)

Rules:

* No AI
* No editing

---

### C. Intelligence Tabs (Center Focus)

Create EXACTLY these tabs:

1. Agents
2. Automations
3. Workflows
4. User Journeys
5. Real-World Examples

Each tab:

* Shows ranked items (3–6 max)
* Each item shows:

  * What it is
  * Why it’s recommended
  * What it produces
  * “Add to Plan” (confirmation required)

---

## 5. TAB CONTENT (TABLES REQUIRED)

### TAB 1 — AI AGENTS

| Agent | Why Needed | What It Produces | Confidence |
| ----- | ---------- | ---------------- | ---------- |

Rules:

* Only relevant agents
* Confidence = High / Medium / Low
* No agent auto-runs

---

### TAB 2 — AUTOMATIONS

| Trigger | Action | Outcome | Risk Level |
| ------- | ------ | ------- | ---------- |

Rules:

* Real system events only
* Risk level visible
* Never auto-enabled

---

### TAB 3 — WORKFLOWS

| Workflow | Steps | Key Outputs | When to Use |
| -------- | ----- | ----------- | ----------- |

Rules:

* End-to-end
* Human readable
* Executable later

---

### TAB 4 — USER JOURNEYS

| Journey | Actor | Steps | Value |
| ------- | ----- | ----- | ----- |

Include:

* Client
* Internal / Ops
* Optional end-user

---

### TAB 5 — REAL-WORLD EXAMPLES

| Scenario | What Was Built | Outcome |
| -------- | -------------- | ------- |

Rules:

* Industry-specific
* Concrete outcomes
* No marketing language

---

## 6. RANKING & SCORING (TRANSPARENT)

Explain scoring (0–100):

* +30 app type match
* +30 goal match
* +20 required by integrations
* +10 urgency
* +10 timeline pressure

Explain:

* Sorting
* Hiding low scores
* “View all” behavior

---

## 7. AI & GEMINI 3 USAGE

| Gemini Tool          | Purpose                    | Where                 |
| -------------------- | -------------------------- | --------------------- |
| Gemini 3 Pro         | Synthesis & prioritization | Plan generation       |
| Gemini 3 Flash       | Instant UI updates         | Toggles / tabs        |
| Structured Outputs   | Stable JSON                | All tabs              |
| Function Calling     | Save selections            | Execution plan        |
| Interactions API     | State continuity           | Wizard → Intelligence |
| Grounding (optional) | Benchmarks                 | Examples tab          |

---

## 8. SAFETY & CONTROL

List explicitly:

* Where AI is blocked
* Where approval is required
* Preview before commit
* Versioning rules
* Audit logging

---

## 9. OUTPUTS (AFTER CONFIRMATION)

This screen produces:

* Selected agent set
* Enabled automations
* Chosen workflows
* Approved journeys
* Versioned Execution Plan (separate from Blueprint)

---

## FINAL RULE

Do NOT redesign the Wizard.
Do NOT redesign the Proposal.
Do NOT introduce new data fields.

This screen **interprets reality and prepares execution** — nothing more.

```

---

# 🎨 UI DESIGN PROMPT — PROJECT INTELLIGENCE (FIGMA WIREFRAMES ONLY)

```markdown
You are a Senior Product Designer creating LOW-FIDELITY wireframes
for a screen called **Project Intelligence**.

This screen is READ-ONLY + SELECTIVE ACTION.
It interprets a CONFIRMED Blueprint created by a Wizard.

STRICT RULES:
- No colors
- No branding
- No typography styles
- No AI logic explanation
- Boxes, labels, dividers, placeholders only
```

---

## GLOBAL LAYOUT

### Desktop (3-Panel)

```
LEFT   → Navigation
CENTER → Intelligence Content
RIGHT  → Blueprint Summary + Pending Actions
```

### Mobile

* Single column
* Accordions
* Sticky bottom bar for approvals

---

## DESKTOP FRAME

### Top Summary Strip

Compact labeled boxes:

* Project name
* Industry
* Status
* Complexity
* Delivery model
* Primary goal

---

### Center: Intelligence Tabs

Tabs (EXACT):

1. Agents
2. Automations
3. Workflows
4. User Journeys
5. Real-World Examples

Each tab shows 3–6 ranked cards.

**Agent Card**

* Icon placeholder
* Agent name
* Why needed (1 line)
* Produces (1 line)
* Confidence
* “Add to Plan” button

**Automation Card**

* Trigger → Action → Outcome
* Risk level
* “Enable” button

**Workflow Card**

* Name
* Step count
* Outputs
* “Include Workflow”

**Journey Card**

* Actor
* Steps
* Value
* View-only

**Example Card**

* Scenario
* What was built
* Outcome

---

### Right Panel

**Blueprint Summary (Sticky)**

* App types
* Industry
* Goals
* Scope & constraints
* Delivery snapshot

**Pending Actions**

* Selected but unconfirmed items
* Buttons:

  * Confirm Changes
  * Clear Selections
* Note: “AI proposes. You confirm.”

---

## MOBILE FRAME

1. Header (project + status)
2. Blueprint summary (collapsed)
3. Recommended Plan card
4. Accordion tabs (Agents → Examples)
5. Sticky bottom bar:

   * Review Selections
   * Pending count badge

---

## REQUIRED STATES

* Empty (AI not run)
* Loading
* Populated
* Pending approval
* AI unavailable (cached)

---

## FINAL DESIGN RULE

Design for **clarity, ranking, and decision-making**.
Assume a developer will build this immediately.
