
# 🚀 Sun AI Agency — Next Steps Roadmap

**Current Status:** The Core Dashboard, Wizard, and Intelligence Screen are **Production Ready**. 
The system now uses real Gemini 3 Pro intelligence with Thinking Configs and Structured Outputs.

---

## 📅 Phase 1: Automation & Workflows (Immediate)

The Intelligence Screen generates "Proposed Automations". Now we need to execute them.

| Feature | Description | Implementation Strategy |
| :--- | :--- | :--- |
| **Workflow Engine** | Execute `trigger -> action` logic. | Create `services/workflowEngine.ts`. Use Gemini Function Calling to map natural language triggers to internal API calls (e.g., `sendEmail`, `updateStatus`). |
| **Agent Instantiation** | Spin up persistent agents. | When a user "Adds an Agent" from the Intelligence Screen, create a record in `activeAgents` state. Display these in a new "Team" view. |
| **Zapier/n8n Hook** | Connect to external tools. | Add a "Webhook" tool to the `Orchestrator` agent to allow it to ping external automation platforms. |

---

## 📅 Phase 2: Logic & Reasoning Enhancements

| Feature | Description | Implementation Strategy |
| :--- | :--- | :--- |
| **Project Simulator** | Predict future risks. | Create a "Simulate" tab in the Right Panel. Use Gemini 3 Pro to fast-forward the project timeline based on current velocity and flag potential bottlenecks. |
| **Code Sandbox** | Safe code execution. | The Analyst Agent uses Python. Build a UI to *view* and *approve* the Python code before it runs, enhancing the "Controller Gate" pattern. |
| **Memory Graph** | Long-term context. | Implement a simple vector store (client-side via TensorFlow.js or server-side via Supabase pgvector) to let agents remember past project decisions. |

---

## 📅 Phase 3: UX Polish & "Quiet AI"

| Feature | Description | Implementation Strategy |
| :--- | :--- | :--- |
| **Thinking Visibility** | Show the AI's thought process. | The `ProjectIntelligencePanel` waits for the AI. Add a collapsible "Thinking Trace" log to show *why* the AI made a decision (using the `thinkingConfig` output if available). |
| **Optimistic UI** | Instant feedback. | When adding tasks/agents, update the UI immediately while the background sync happens. |
| **Mobile Mode** | On-the-go management. | Refine the 3-panel layout for mobile. The Intelligence Screen should probably be a bottom-sheet drawer on mobile. |

---

## 📝 Suggested File Creations

1.  `services/workflowEngine.ts` - For handling automation logic.
2.  `components/AgentTeamView.tsx` - To visualize active agents.
3.  `hooks/useMemory.ts` - For simple context retrieval.

---

**Master Goal:** Move from "Planning" to "Autonomous Execution" while keeping the human firmly in the loop.
