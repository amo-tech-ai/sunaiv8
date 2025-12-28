# Sun AI Agency — Product Roadmap & Architecture (Phase 7)

## 📊 System Capability Matrix

| Feature | Screen | Core Function | Advanced AI (Gemini 3) | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Strategy Hub** | Main Dashboard | Daily task prioritization | Contextual Risk Scoring (Thinking) | 🟢 |
| **Pipeline Board** | CRM Pipeline | Deal stage management | Buying Intent Scoring (Thinking) | 🟢 |
| **Intelligence View** | Market Report | Full-screen data visualization | Grounding with Search & Maps | 🟢 |
| **Creative Studio 2.0** | Creative Tab | High-res image generation | Pro Image (1K-4K) & Veo Video | 🟡 |
| **Brief Extractor** | Wizard / Upload | Document Parsing | Extractor Agent (Structured Outputs) | 🔴 |
| **Agency Assistant** | Chatbot | Workspace RAG query | Retriever Agent (pgvector logic) | 🟢 |
| **Resource Optimizer** | Timeline View | Capacity management | Optimizer Agent (Code Execution) | 🔴 |
| **Audio Features** | N/A | DEPRECATED | N/A | ⚪ |

---

## 🏗 Next Phase: Operational Automation

### 1. Document Vault & Brief Extractor (`BriefExtractor`)
*   **Core**: Drag-and-drop PDF/Brief upload.
*   **Advanced**: **Extractor Agent** turns unstructured text into a JSON Milestone array.
*   **Status**: 🔴 (Design Proposed)

### 2. Resource Optimizer (`TimelineView`)
*   **Core**: Gantt-style timeline of active projects.
*   **Advanced**: **Optimizer Agent** uses Python code to identify resource bottlenecks.
*   **Status**: 🔴 (Design Proposed)

### 3. Creative Studio 2.0 (`CreativePanel`)
*   **Core**: Image gallery with variant history.
*   **Advanced**: **Veo Integration** for mood-film generation (requires Paid Key).
*   **Status**: 🟡 (In Progress)

---

## 📈 Overall Progress Tracker

| ID | Module | Percent Correct/Complete | Status |
| :--- | :--- | :---: | :---: |
| **F1** | 3-Panel Editorial UI | 100% | 🟢 |
| **F2** | Grounded Research Agent | 100% | 🟢 |
| **F3** | ROI Analyst (Python) | 100% | 🟢 |
| **F4** | Workspace RAG Assistant | 95% | 🟢 |
| **F5** | Pro Creative (Veo/Pro Img) | 40% | 🟡 |
| **F6** | Document Extractor (PDF) | 10% | 🔴 |
| **F7** | Resource Optimizer | 5% | 🔴 |
| **F8** | **Audio/Speech Service** | **0%** | ⚪ |

**TOTAL SYSTEM COMPLETION: 65%** (Excluding Deprecated Audio)

---

## 🧬 Agentic Workflows Logic
*   **Orchestrator**: Routing logic between Research and Planning.
*   **Scorer**: Relationship health (0-100) based on interaction frequency.
*   **Controller**: Mandatory approval gate for all AI-generated tasks.
