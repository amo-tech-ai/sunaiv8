# Sun AI Agency — Implementation Prompts (End-to-End)

## 🟦 PROMPT 1: The Market Analysis Report View
**Goal Summary:** Create a high-fidelity report screen that renders grounded search results including competitor tactics and industry pain points.

### 📋 Tasks & Steps
1. **Component Creation**: Build `components/MarketReportView.tsx`.
2. **Layout**: Use a 2-column grid. Left: Industry Trends & Pain Points. Right: Competitor Table & Tactics.
3. **Data Mapping**: Map the `MarketReport` type from `types.ts` to the UI.
4. **Tool Integration**: Add a "Search Tool" icon next to grounded claims that links to the `sources` URI.

### ⚙️ Logic & Workflows
- Trigger: User clicks "View Full Report" in `RightPanel`.
- State: Modal or Full-screen overlay within the `MainPanel` area.

### ✅ Success Criteria
- Renders 100% of the structured JSON from `conductMarketAnalysis`.
- Includes "Suggested Automations" as clickable task-generation buttons.

---

## 🟩 PROMPT 2: The Agent Orchestrator UI
**Goal Summary:** Add a global "Orchestrator Status" tracker to visualize multi-agent handoffs and progress.

### 📋 Tasks & Steps
1. **State Update**: Add `orchestratorState` to `App.tsx` (e.g., `{ activeAgents: string[], currentTask: string }`).
2. **UI Component**: Add a subtle, glass-morphism status bar at the top of `MainPanel`.
3. **Feedback Loop**: Pulse the status bar based on `isProcessing` flags from the focus model.

### ⚙️ Logic & Workflows
- When `Researcher` completes, trigger `Planner` automatically if the stage is "Proposal".
- Display: "Researcher found 3 competitors. Handoff to Planner for Roadmap generation..."

### ✅ Success Criteria
- User can see exactly which AI model is "thinking" and what it is "researching" in real-time.

---

## 🟨 PROMPT 3: Advanced Grounding & RAG Bridge
**Goal Summary:** Implement the `googleMaps` grounding for location intel and a retrieval bridge for historical interaction data.

### 📋 Tasks & Steps
1. **Gemini Config**: Update `conductMarketAnalysis` in `geminiService.ts` to include `googleMaps: {}` in tools.
2. **Prompt Engineering**: Instruct the model to find the prospect's closest major office and check for local industry events.
3. **Data Injection**: Pass the last 5 `Interactions` from the contact into the model's contents to act as a "Local RAG" context.

### ✅ Production-Ready Checklist
- [ ] Maps Grounding enabled in `metadata.json`.
- [ ] Lat/Lng context passed from `navigator.geolocation` (if available).
- [ ] URL Context Tool explicitly utilized for domain-specific deep-dives.