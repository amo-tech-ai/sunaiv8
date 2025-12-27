# Sun AI Agency — Agent Implementation Prompts

This document contains the multi-step prompts required to implement the advanced agentic features of the Sun AI Dashboard.

---

## 🟦 MODULE 1: Deep Research & Reporting (Researcher Agent)
**Goal:** Create a full-screen "Intelligence Report" view that displays grounded market research.

### 📋 Tasks & Steps
1.  **UI Component:** Create `MarketReportView.tsx` with sections for "Industry Trends," "Competitive Landscape," and "Automation Recommendations."
2.  **Logic:** In `RightPanel.tsx`, add a "View Full Report" button when `contact.researchData.agentReport` is present.
3.  **Grounding:** Utilize `googleSearch` to pull actual competitor news and `googleMaps` for headquarters visual context.
4.  **Workflow:** User Focus -> Click "Run Deep Research" -> Researcher Agent triggers -> Structured JSON returned -> UI renders Report.

**Success Criteria:**
- Report includes real URLs found via grounding.
- Competitor analysis lists at least 3 distinct businesses.

---

## 🟩 MODULE 2: Automated Planner (Planner Agent)
**Goal:** Transform "Discovery" leads into "Proposal" stage with an AI-generated 4-week project roadmap.

### 📋 Tasks & Steps
1.  **Prompt Engineering:** Feed the Researcher Agent's report into the Planner Agent.
2.  **Action:** The Planner Agent returns a list of `ActionItem` objects (Milestones).
3.  **UI:** Render a "Proposed Plan" in the `RightPanel` with a checkbox for each task.
4.  **Controller Gate:** Human clicks "Approve Plan" to batch-insert the tasks into the `TasksPanel`.

**Success Criteria:**
- Tasks are linked to the Lead.
- Due dates are realistically spaced (7-day intervals).

---

## 🟨 MODULE 3: Orchestrator Dashboard
**Goal:** A high-level view showing which agents are currently working on which leads.

### 📋 Tasks & Steps
1.  **UI:** Add an "Agent Status" ticker to the top of the `MainPanel`.
2.  **State:** Track `isResearching`, `isPlanning`, and `isPrototyping` per contact.
3.  **Visualization:** Use progress bars or pulses next to contact names in the CRM Board when an agent is running.

**Success Criteria:**
- Real-time feedback when `conductMarketAnalysis` is running.
- Clear indication of which agents are "Idle" vs "Active".

---

## 🛠 Production Checklist
- [x] Gemini 3 Pro thinking budget set to 4k for strategy.
- [x] Google Search Grounding active for Research.
- [x] Structured JSON outputs enforced for Report UI.
- [x] "Human-in-the-loop" (Controller Gate) enforced on all write actions.
