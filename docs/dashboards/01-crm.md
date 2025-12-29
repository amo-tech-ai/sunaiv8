
# CRM Module — Architecture & Implementation Master Plan

**Module:** Client Relationship Management (CRM)
**Theme:** "Relationship Intelligence"
**Layout:** 3-Panel Responsive (Nav · Work Surface · Intelligence)
**Goal:** Transform the CRM from a passive database into an active, AI-orchestrated revenue engine.

---

## 📊 Implementation Progress Tracker

| Sequence | Feature / Component | Type | Complexity | Status |
| :--- | :--- | :---: | :---: | :---: |
| **01** | **Pipeline Board UI** | Core | Medium | 🟢 |
| **02** | **Contact Detail Drawer (Details Tab)** | Core | Low | 🟢 |
| **03** | **Interaction Logger (Modal)** | Core | Low | 🟢 |
| **04** | **Intake Wizard (Add Lead)** | Core | Medium | 🟢 |
| **05** | **Researcher Agent (Enrichment)** | AI | High | 🟢 |
| **06** | **Strategist Agent (Buying Intent)** | AI | High | 🔴 |
| **07** | **The Closer Agent (Drafting)** | AI | High | 🔴 |
| **08** | **Controller Gate (Audit Log)** | Logic | Medium | 🟢 |
| **09** | **Deal Forecast Visualization** | Advanced | Medium | 🔴 |
| **10** | **Smart Nudges (Stale Alerts)** | Intelligence | Low | 🔴 |

*(Legend: 🟢 Verified Complete, 🟡 In Progress, 🔴 Pending)*

---

## 📐 3-Panel Layout Logic

The CRM adheres to the **Sun AI Operational Layout** to minimize context switching.

### Panel A: Navigation (Left)
*   **Role:** Context Switching.
*   **Behavior:** Fixed width.
*   **CRM State:** Shows "CRM" active.
*   **Filters:** Quick filters for "High Value", "Stale", "New Leads".

### Panel B: Work Surface (Center)
*   **Role:** High-Density Management.
*   **View:** **Pipeline Board** (Kanban).
*   **Logic:**
    *   Horizontal scroll for stage columns.
    *   Vertical scroll for lead cards within columns.
    *   **Click Interaction:** Clicking a card does NOT navigate away. It triggers `setFocus(contact)` which updates Panel C.

### Panel C: Intelligence (Right)
*   **Role:** The "Brain" & Details.
*   **Tabs:**
    1.  **Details:** Static data (Bio, Deals, History).
    2.  **Intelligence:** AI Analysis (Buying Score, Risk, Next Steps).
    3.  **Creative:** Generative assets (Moodboards).
*   **Logic:**
    *   *Idle State:* Shows Aggregate Pipeline Stats.
    *   *Active State:* Updates instantly when Panel B selection changes.

---

## 🔍 Screen Specifications & Features

### 1. The Pipeline Board (Main View)
**Purpose:** At-a-glance view of agency revenue health and deal momentum.

| Feature Type | Feature Description | Purpose |
| :--- | :--- | :--- |
| **Core** | **Kanban Columns** | Discovery, Proposal, Negotiation, Closed. |
| **Core** | **Lead Card** | Company, Stakeholder, Deal Value, Last Contact. |
| **Core** | **Aggregate Headers** | Total Deal Value per column (e.g., "$120k"). |
| **Advanced** | **Stale Indicators** | Visual "Yellow Dot" if `lastContact > 14 days`. |
| **Advanced** | **Agent Status** | Pulsing ring around avatar if AI is researching. |
| **Advanced** | **Velocity Sparkline** | Mini-chart on card showing interaction freq. |

### 2. The Relationship Drawer (Right Panel)
**Purpose:** Deep dive and action execution without leaving the board.

| Feature Type | Feature Description | Purpose |
| :--- | :--- | :--- |
| **Core** | **Bio Block** | Rich text description of the company/lead. |
| **Core** | **Interaction Feed** | Chronological timeline of calls, emails, notes. |
| **Core** | **Stage Control** | Dropdown to move lead between columns. |
| **Advanced** | **Buying Intent Score** | AI-calculated 0-100% probability gauge. |
| **Advanced** | **Next Best Action** | AI-suggested task (e.g., "Send Q3 Case Study"). |
| **Advanced** | **Psychometric Profile** | AI analysis of communication style. |

### 3. The Intake Wizard (Modal)
**Purpose:** High-fidelity data entry with zero friction.

| Feature Type | Feature Description | Purpose |
| :--- | :--- | :--- |
| **Core** | **Multi-step Form** | Identity -> Strategy -> Context. |
| **Advanced** | **"Magic Paste"** | Paste LinkedIn URL -> AI auto-fills fields. |
| **Advanced** | **Instant Grounding** | Fetches company news/location during entry. |

---

## 🤖 AI Agents & Workflows

### Agent 1: The Researcher (Enrichment)
*   **Trigger:** New Lead Created or Manual "Refresh" click.
*   **Input:** Company Name + Website.
*   **Logic:**
    1.  `googleSearch` for latest news, funding, and recent creative work.
    2.  `googleMaps` for physical HQ location (Logistics context).
*   **Output:** Structured JSON (`industry`, `recentNews`, `marketPosition`).
*   **UI Update:** Populates the "Bio" and "Intelligence" tab.

### Agent 2: The Strategist (Scoring & Risk)
*   **Trigger:** Interaction Logged or Stage Change.
*   **Input:** Last 5 interaction notes + Deal Value.
*   **Logic:**
    1.  Analyze sentiment (Positive/Neutral/Negative).
    2.  Identify blockers (e.g., "Waiting on Budget").
    3.  Compare interaction frequency against "ideal" velocity.
*   **Output:** `BuyingIntentScore` (High/Med/Low) + `ReasoningTrace`.

### Agent 3: The Closer (Automation)
*   **Trigger:** Lead moved to "Proposal" or "Negotiation".
*   **Logic:**
    1.  Read `ResearchResult` + `AgencyPortfolio`.
    2.  Draft a grounded email/message.
*   **Output:** `WorkflowDraft` object.
*   **Controller Gate:** User sees draft in Panel C. Must click "Approve" or "Copy".

---

## 👤 User Journeys (Real World Scenarios)

### Scenario A: The Cold Inbound (Enrichment)
1.  **User** opens **Intake Wizard** and types "Acme Luxury".
2.  **Researcher Agent** runs in background (Spinner UI).
3.  **UI** auto-fills "Industry: Sustainable Fashion", "CEO: Jane Doe".
4.  **User** saves. Lead appears in **Discovery**.
5.  **User** sees "Recent News: Acme launched recycled denim line" in Panel C.

### Scenario B: The Stalled Deal (Nudge)
1.  **User** scans Pipeline Board. Sees "Luxe Corp" has a **Yellow Dot** (Stale).
2.  **User** clicks card. Panel C opens to **Intelligence Tab**.
3.  **Strategist Agent** says: "Risk High. No contact in 21 days. Last note mentioned 'Budget Review'."
4.  **User** clicks "Generate Nudge".
5.  **Closer Agent** drafts email: "Hi [Name], seeing how the budget review went..."
6.  **User** copies and sends. Interaction is logged. Yellow dot disappears.

### Scenario C: The Upsell (Prediction)
1.  **User** logs a "Coffee Meeting" with existing client.
2.  **User** notes: "They are expanding to Asian markets next quarter."
3.  **Strategist Agent** detects opportunity.
4.  **UI Notification:** "New Opportunity Detected: Asia GTM Strategy."
5.  **User** clicks "Create Deal". New deal added to **Discovery** ($50k est).

---

## 🛠 Multistep Implementation Prompts

### Prompt 1: Buying Intent Scorer (The Strategist)
**Goal:** Implement AI logic to score leads based on interaction sentiment and frequency.
**Tasks:**
1.  Modify `geminiService.ts`: Add `analyzeBuyingIntent(interactions, dealStage)`.
2.  Use **Gemini 3 Pro** with `thinkingConfig` (budget 2000).
3.  Prompt: "Analyze these interactions. Output specific risk factors and a 0-100 score."
4.  Update `RightPanelIntelligence.tsx` to display a "Health Gauge" visualization using the score.
**Success Criteria:**
- Score updates when a new interaction is logged.
- "Reasoning" text explains *why* the score changed (e.g., "+5 due to positive meeting").
**Validation:** Log a "Negative" call note and verify score drops.

### Prompt 2: The "Closer" Drafting Agent
**Goal:** Automate the creation of stage-relevant communication.
**Tasks:**
1.  Create `services/ai/closerAgent.ts`.
2.  Implement `generateOutreach(contact, intent)`.
3.  Logic: If Stage = Proposal, draft "Proposal Review Check-in". If Stage = Discovery, draft "Introductory Value Add".
4.  Update `RightPanel.tsx`: Add a "Draft Email" button in the Action Bar.
5.  **Controller Gate:** Display the draft in a textarea for editing before "Logging" it.
**Success Criteria:**
- Drafts are context-aware (referencing company name and last note).
- User must explicitely approve/copy the text.

### Prompt 3: Deal Velocity Visualization
**Goal:** Visual indicators of deal momentum on the board.
**Tasks:**
1.  Update `CRMPanel.tsx` -> `PipelineCard`.
2.  Calculate `daysSinceLastContact` and `daysInCurrentStage`.
3.  Visuals:
    *   Green border: Interaction < 7 days ago.
    *   Gray border: Interaction 7-14 days ago.
    *   Yellow border/dot: Interaction > 14 days ago.
4.  Add a small sparkline SVG to the card representing interaction frequency over the last 3 months.
**Success Criteria:**
- Board visually highlights "At Risk" deals instantly.
- Sparkline renders correctly based on `interactions` array.

### Prompt 4: "Smart Nudge" System
**Goal:** Proactive AI suggestions for stale leads.
**Tasks:**
1.  In `App.tsx` (Orchestrator), run a check on load.
2.  Identify leads with `status === 'Active'` and `lastContact > 14 days`.
3.  Batch send these to `StrategistAgent` for a 1-sentence "Next Action" recommendation.
4.  Display a "⚠️ Action Required" section at the top of the **CRM Board** listing these specific leads.
**Success Criteria:**
- "Stale" leads are lifted out of the columns into a dedicated attention block.
- Each item has a quick "Draft Nudge" button.
