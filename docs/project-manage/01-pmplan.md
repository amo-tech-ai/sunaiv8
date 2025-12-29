
# Sun AI Agency — Project Management Module Architecture

**Version:** 2.2 (Complete Gemini 3 Matrix)
**Theme:** "Quiet Execution"
**Goal:** Transform project management from administrative overhead into an AI-orchestrated flow of high-value decisions.

---

## 🤖 AI Agent Matrix: Gemini 3 Integration

This module utilizes a specialized swarm of agents powered by **Gemini 3** models to handle specific cognitive tasks.

| Agent Name | Base Model | Configuration | Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Orchestrator** | `gemini-3-flash-preview` | `systemInstruction`: "Router" | Determines which specialized agent to call based on user interaction (e.g., clicking "Analyze Risk" vs "Draft Brief"). |
| **Planner Agent** | `gemini-3-pro-preview` | `thinkingConfig: { thinkingBudget: 4000 }` | Breaks down high-level project goals into granular Work Breakdown Structures (WBS) with logical dependencies. |
| **Risk Analyst** | `gemini-3-pro-preview` | `thinkingConfig: { thinkingBudget: 2000 }` | Evaluates project health by reasoning through timeline slippage, resource contention, and complexity. |
| **Budget Analyst** | `gemini-3-pro-preview` | `tools: [{ codeExecution: {} }]` | Executes Python code to calculate precise burn rates, ROI projections, and Schedule Performance Index (SPI) during wizard intake and project review. |
| **Grounding Agent** | `gemini-3-pro-preview` | `tools: [{ googleSearch: {} }]` | Verifies external factors like vendor pricing trends, competitor benchmarks, or tech stack viability. |
| **Creative Director** | `gemini-2.5-flash-image` | `aspectRatio: "16:9"` | Generates visual mood boards and style frames for creative tasks directly within the brief. |
| **Status Reporter** | `gemini-3-flash-preview` | `responseSchema: StatusUpdate` | Synthesizes git commits, task updates, and meeting notes into a concise, editorial status report. |

---

## 📐 3-Panel Layout Logic (Responsive & Functional)

The Project Management module strictly adheres to the **Context · Work · Intelligence** flow.

### 1. Panel A: Context & Navigation (Left - 25%)
*   **Role:** Selection & Filtering.
*   **Components:**
    *   **Portfolio List:** Scrollable list of active engagements with mini status dots.
    *   **Quick Filters:** "At Risk", "My Tasks", "High Budget".
    *   **Wizard Trigger:** "+ New Project" button (Opens Modal).
*   **Behavior:** Clicking an item here changes the content of Panel B and resets Panel C.

### 2. Panel B: Execution Surface (Center - 50%)
*   **Role:** The "Work" area. High density, low noise.
*   **Views (Tabbed):**
    *   **Grid:** High-level cards with health metrics.
    *   **Kanban:** `dnd-kit` powered board for task movement.
    *   **Timeline:** Horizontal scrolling Gantt chart for resource allocation.
*   **Interaction:** Clicking a Project Card or Task Card puts it into "Focus Mode", triggering Panel C.

### 3. Panel C: Intelligence & Details (Right - 25%)
*   **Role:** The "Brain". Contextual insights based on Panel B selection.
*   **States:**
    *   *Idle:* Shows aggregate portfolio stats (Total Active, Avg Risk).
    *   *Project Focus:* Shows `Risk Analyst` output, Budget calculated by `Analyst`, and "Drafts" from `Status Reporter`.
    *   *Task Focus:* Shows dependency chain, assignee availability, and "Blocker" resolution suggestions.

---

## 📱 Screens & Routes

The PM module is a Single Page Application (SPA) experience primarily residing at `/projects` but dynamically rendering views.

| Route State | Screen Name | Layout Configuration |
| :--- | :--- | :--- |
| `/projects` | **Portfolio View** | Panel A (List) + Panel B (Grid) + Panel C (Portfolio Stats) |
| `/projects?view=timeline` | **Resource View** | Panel A (List) + Panel B (Gantt) + Panel C (Conflict Resolver) |
| `/tasks` | **Execution View** | Panel A (Filters) + Panel B (Kanban) + Panel C (Task Details) |
| `modal:wizard` | **New Project** | Full-screen overlay with Stepper UI (Scope -> Budget -> Plan -> Review) |

---

## 🔄 User Journeys & Workflows

### Journey 1: The Intelligent Kickoff (Wizard)
1.  **Trigger:** User clicks "+ New Project".
2.  **Input:** User types "Rebrand for Maison Laurent. Q3 Launch."
3.  **Agent Action (Analyst):** User clicks "Run Estimate". Gemini 3 Pro (Code Exec) calculates budget breakdown ($150k).
4.  **Agent Action (Planner):** Gemini 3 Pro (Thinking) generates a 12-week WBS with Phases (Discovery, Design, Dev).
5.  **Refinement:** User reviews cost vs timeline.
6.  **Commit:** User clicks "Launch". System writes to DB.

### Journey 2: The Firefight (Risk Mitigation)
1.  **Trigger:** System detects a "Critical" task is 3 days overdue.
2.  **Agent Action (Risk):** Background agent flags Project A as "At Risk".
3.  **User Action:** User sees Red Dot on Project A in Panel A. Clicks it.
4.  **Panel C Update:** Displays "Risk Analysis: Critical Path delay. 3 days slip expected."
5.  **Suggestion:** Agent offers "Resolution: Swap Junior Designer for Senior (Amara)."
6.  **Resolution:** User clicks "Apply Resource Swap". System updates assignments.

### Journey 3: The Financial Audit
1.  **Trigger:** User focuses on "Fintech App" project.
2.  **User Action:** Clicks "Run Budget Audit" in Panel C.
3.  **Agent Action (Analyst):** Gemini 3 Pro (Code Execution) runs Python script to sum hours * rates vs total budget.
4.  **Output:** Returns JSON `{ burnRate: 1.2, estimatedCompletionCost: 150000 }`.
5.  **UI Display:** Panel C renders a burn-down chart and a "Budget Alert" warning if > 1.0.

---

## 🛠 Implementation Best Practices

1.  **Optimistic UI:** When moving cards in Kanban, update UI immediately. Rollback if API fails.
2.  **Quiet AI:** Never auto-popups. Intelligence (Panel C) waits for a click. Risk alerts are subtle dots, not modals.
3.  **Code Execution Transparency:** When `Analyst` runs Python, show a small "Computing..." indicator so the user trusts the math.
4.  **Responsive Grid:**
    *   **Desktop:** 3-Panel (25/50/25).
    *   **Tablet:** 2-Panel (30/70) - Panel C slides over as a drawer.
    *   **Mobile:** 1-Panel (Stack) - Navigation Drawer -> List -> Details.
