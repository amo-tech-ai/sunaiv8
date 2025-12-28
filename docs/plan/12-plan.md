# Sun AI Agency — Product Roadmap & Architecture (Phase 6)

## 📊 System Capability Matrix

| Feature | Screen | Core Function | Advanced AI (Gemini 3) | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Strategy Hub** | Main Dashboard | Daily task prioritization | Contextual Risk Scoring (Thinking) | 🟢 |
| **Pipeline Board** | CRM Pipeline | Deal stage management | Buying Intent Scoring (Thinking) | 🟢 |
| **Intelligence View** | Market Report | Full-screen data visualization | Grounding with Search & Maps | 🟢 |
| **Creative Suite** | Creative Tab | Visual asset drafting | Pro Image (1K-4K) & Veo Video | 🟡 |
| **Audio Briefs** | Intelligence Tab | Text-to-Speech (TTS) | Multi-speaker strategic briefs | 🟡 |
| **Project Wizard** | Intake Flow | Structured onboarding | AI Enrichment via URL Grounding | 🟢 |
| **Agency Assistant**| Chatbot | Workspace RAG query | Temporal aware context retrieval | 🟢 |

---

## 🏗 Screen & Feature Catalog

### 1. Operations Dashboard (`MainPanel`)
*   **Core**: Stat pills, immediate priorities list, recent activity feed.
*   **Advanced**: Agent Status Ticker (Live view of which agent is "Thinking").
*   **Use Case**: Agency Principal starts the day by reviewing "At Risk" projects identified by the Scorer Agent.

### 2. Market Intelligence Report (`MarketReportView`)
*   **Core**: Industry narrative, competitor table, pain point list.
*   **Advanced**: Verified Source Sidebar (Grounded links), Local Office Intel (Maps integration).
*   **Use Case**: Preparing for a pitch with Maison Laurent by researching their 3 closest competitors in the SS25 season.

### 3. Creative Drafting Studio (`RightPanelCreative`)
*   **Core**: Visual asset gallery, basic image generation.
*   **Advanced**: **Veo Video Generation** (720p/1080p), **High-Res Pro Image** (2K/4K).
*   **Use Case**: Generating a 6-second cinematic mood-video for a luxury fragrance launch.

---

## 🧬 Agentic Workflows & Logic

### Workflow: The Intelligence Loop
1.  **Researcher**: Scrapes web (Search) and local data (Maps) for a lead.
2.  **Analyst**: Runs Python code to calculate ROI based on budget data.
3.  **Planner**: Synthesizes Research + Analysis into a 4-week roadmap.
4.  **Controller**: Presents the roadmap to the human for "Commit" to the Task Board.

### Workflow: Creative Content Generation
1.  **Strategist**: Identifies the "Visual Tone" from the lead's bio.
2.  **Content Agent**: Generates a prompt for Gemini Pro Image or Veo.
3.  **Generator**: Fetches the high-res artifact (requires Paid API Key selection).

---

## 🗺 User Journeys (Real-World Examples)

### Scenario A: The High-Stakes Pitch
*   **User**: Agency Principal
*   **Steps**: Wizard Intake -> Deep Research -> Market Report Review -> Listen to Audio Brief in car -> Pro Image Concept Generation.
*   **Outcome**: Pitch deck contains grounded data and AI-generated high-fidelity visuals.

### Scenario B: Operational Efficiency
*   **User**: Ops Manager
*   **Steps**: Review Dashboard Ticker -> Identify "At Risk" project -> Assistant Chat: "Why is Project X at risk?" -> AI: "Budget overrun in Phase 2" -> User: "Draft alert email."

---

## 📈 Progress Tracker (v1.2.0)

| ID | Feature | Status | % Complete | Verification |
| :--- | :--- | :---: | :---: | :--- |
| **F1** | 3-Panel Editorial UI | 🟢 | 100% | Layout verified on 13/27" |
| **F2** | Grounded Research Agent | 🟢 | 100% | Search/Maps tools integrated |
| **F3** | ROI Analyst (Python) | 🟢 | 100% | Code execution math verified |
| **F4** | Audio Strategic Briefs | 🟡 | 60% | TTS integration pending |
| **F5** | Pro Creative (Veo/Pro Img) | 🔴 | 10% | Paid Key logic required |
| **F6** | Workspace RAG Assistant | 🟢 | 100% | Multi-turn chat verified |

**Overall Percent Completed: 82%**
