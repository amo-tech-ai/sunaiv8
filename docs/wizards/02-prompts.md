
# 🧙‍♂️ Project Wizard — Multistep Build Prompts

This document contains the sequential prompts required to build the **Project Wizard** module. Use these prompts in order to ensure a stable, state-driven implementation.

## 📊 Implementation Progress Tracker

| Sequence | Feature / Module | Scope | Status |
| :--- | :--- | :--- | :---: |
| **01** | **Skeleton & State** | `WizardLayout`, `useWizardState`, Routing | 🔴 |
| **02** | **Identity & Scope (Steps 1-2)** | Form Inputs, Live Blueprint Preview | 🔴 |
| **03** | **Constraints & Gate (Steps 3-4)** | Budget Logic, "Controller Gate" | 🔴 |
| **04** | **AI Orchestrator (Step 5)** | Gemini 3 Integration, Thinking UI | 🔴 |
| **05** | **Proposal & Commit (Step 6)** | Proposal UI, Database Write | 🔴 |

---

## 🟦 PROMPT 1: Skeleton & State Management
**Goal:** Establish the Wizard container, state model, and navigation structure.

### 📋 Requirements
1.  **File Creation:**
    *   Create `components/wizard/WizardLayout.tsx`: The main wrapper.
    *   Create `hooks/useWizard.ts`: Custom hook managing the `WizardBlueprint` object.
2.  **State Model:**
    *   Define `WizardBlueprint` interface (id, basics, scope, constraints, status).
    *   Initialize with default values.
3.  **UI Layout:**
    *   **Left Panel:** Vertical Stepper (Steps 1-6) with "Locked" states for future steps.
    *   **Center Panel:** Render area for current step content.
    *   **Right Panel:** "Live Blueprint" view (Read-only JSON summary that updates in real-time).
4.  **Navigation:**
    *   Implement `nextStep()` and `prevStep()` logic.
    *   Block navigation if validation fails (e.g., Name is empty).

**Constraint:** Do not build the specific form fields yet. Just the layout structure and navigation buttons.

---

## 🟩 PROMPT 2: Identity & Scope (Steps 1 & 2)
**Goal:** Implement the data entry screens for project definition.

### 📋 Requirements
1.  **Step 1 (Basics):**
    *   Inputs: Project Name, Client Name (Autocomplete from Contacts), Website URL.
    *   *Micro-interaction:* If Website is entered, trigger a mock "Scanning..." state in the Right Panel.
2.  **Step 2 (Scope):**
    *   **App Type:** Card selection grid (SaaS, E-commerce, Internal Tool, AI Wrapper).
    *   **Industry:** Dropdown.
    *   **Goal:** Textarea ("What is the primary success metric?").
3.  **Live Preview:**
    *   Ensure the Right Panel updates immediately as the user types.
    *   Show a "Drafting..." badge in the corner of the preview.

**Constraint:** No AI generation yet. Just deterministic data capture.

---

## 🟨 PROMPT 3: Constraints & Controller Gate (Steps 3 & 4)
**Goal:** Define boundaries and implement the human approval mechanism.

### 📋 Requirements
1.  **Step 3 (Feasibility):**
    *   **Budget:** Range slider ($10k - $250k).
    *   **Timeline:** "Urgency" Toggle (Standard vs. Rush).
    *   **Tech Stack:** Multi-select chips (React, Python, Node, etc.).
2.  **Step 4 (Review - The Gate):**
    *   Render a high-fidelity summary of Steps 1-3.
    *   Add "Edit" buttons for each section.
    *   **Action:** A large, high-contrast button: "🔒 Lock & Generate Architecture".
    *   *Logic:* Clicking this sets `status: 'processing'` and advances to Step 5.

**Constraint:** The "Generate" button must be the only way to trigger the AI.

---

## 🟧 PROMPT 4: AI Architecting (Step 5)
**Goal:** Visualize the AI swarm working in real-time.

### 📋 Requirements
1.  **UI:** A "Terminal" or "System Status" view. No user inputs allowed.
2.  **Animation Sequence:**
    *   "Orchestrator: Analyzing scope..." (2s)
    *   "Researcher: Verifying market trends via Google Search..." (3s)
    *   "Planner: Drafting WBS with Gemini 3 Pro..." (4s)
    *   "Analyst: Calculating ROI with Python Code Execution..." (3s)
3.  **Service Integration:**
    *   Call `generateProjectRoadmap` (Planner Agent).
    *   Call `estimateProjectBudget` (Analyst Agent).
4.  **Thinking Visibility:**
    *   Show a scrolling log of the "Reasoning Trace" returned by the model.

**Constraint:** Ensure the UI handles API latency gracefully (loading skeletons).

---

## 🟥 PROMPT 5: Proposal & Commit (Step 6)
**Goal:** Present the final artifact and commit to the database.

### 📋 Requirements
1.  **Proposal Card:**
    *   Display the generated **Executive Summary**, **Timeline (Gantt)**, and **Budget Estimate**.
    *   Show a "Confidence Score" (e.g., 92%) based on the inputs.
2.  **Actions:**
    *   **"Approve & Launch":** Converts the Blueprint into a real `Project` and `ActionItem`s in the global state. Redirects to `/projects`.
    *   **"Refine":** Opens a text prompt to tweak the plan (e.g., "Make it 6 weeks instead of 4").
3.  **Audit Log:**
    *   Record the creation event in the System Audit Log.

**Constraint:** This step must write to `localStorage` (via `usePersistentState`).

---

## ✅ UX Best Practices Checklist
*   [ ] **Autosave:** All inputs save to local state immediately.
*   [ ] **Quiet AI:** AI only runs in Step 5.
*   [ ] **Right Panel Truth:** The preview panel never guesses; it only shows what is typed.
*   [ ] **Validation:** "Next" button disabled until required fields are filled.
