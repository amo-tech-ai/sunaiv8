# Sun AI Agency — CRM Implementation Prompts

This document contains systematic, production-ready prompts for implementing CRM features.

## 📊 Implementation Tracker

| Prompt | Goal | Status |
| :--- | :--- | :---: |
| **P1** | CRM Pipeline Screen (Main Dashboard) | 🟢 |
| **P2** | Contact Details Drawer (Right Panel) | 🟢 |
| **P3** | AI Insights (Quiet AI Relationship Health) | 🟢 |
| **P4** | Automation Proposals (Controller Gate) | 🟡 |
| **P5** | Add Lead Wizard (Structured Capture) | 🟢 |

---

## 🟦 PROMPT 1: CRM Pipeline Screen (Main Dashboard)
**Goal:** Implement the visual board layout with pipeline columns and compact deal cards.

**Tasks & Steps:**
1. Update `CRMPanel.tsx` to render 4 columns: Discovery, Proposal, Negotiation, Closed.
2. Ensure Lead Cards display: Company Name, Contact Name, Role, Deal Value, and Health Score.
3. Add a "Totals" sub-header with Pipeline Value and Active Lead count.
4. Implement `onLeadClick` to trigger the focus model.

**Success Criteria:**
- Cards are compact and follow the editorial style.
- Deal values sum correctly in the header.
- Clicking a card updates the Right Panel without full-page navigation.

---

## 🟩 PROMPT 2: Contact Details Drawer (Right Panel)
**Goal:** Implement a detailed view of the lead within the Right Panel mode.

**Tasks & Steps:**
1. Modify `RightPanel.tsx` to detect `focus.type === 'contact'`.
2. Render sections for: Role, Company Bio, Last Contact, and Deal Engagement Type.
3. Add a "Stage CTA" that changes based on the lead's current column (e.g., "Send Proposal" for Proposal stage).
4. Include a "Back to Intelligence" toggle.

**Success Criteria:**
- Switch between AI Intelligence and Contact Details is seamless.
- Metadata is grounded in the current `focus.data`.

---

## 🟨 PROMPT 3: AI Insights (Quiet AI Health)
**Goal:** Connect the CRM data to Gemini 3 Pro for strategic relationship analysis.

**Tasks & Steps:**
1. Refine `getAIInsight` in `geminiService.ts` specifically for CRM contacts.
2. Use a system instruction focusing on "Buying Intent" and "Relationship Health".
3. Return structured JSON with `summary`, `risk`, and `suggestion`.
4. Ensure the Intelligence tab in the Right Panel displays these CRM-specific insights.

**Success Criteria:**
- AI correctly identifies risk (e.g., "CTO role suggests high technical scrutiny").
- Confidence badges are displayed based on data depth.

---

## 🟥 PROMPT 4: Automation Proposals (Controller Gate)
**Goal:** Turn AI suggestions into actionable UI prompts.

**Tasks & Steps:**
1. In `RightPanel.tsx`, detect if `insight.suggestion` is actionable (e.g., starts with "Draft").
2. Render a "Proposed Action" block with an "Approve" button.
3. On "Approve", simulate the action (e.g., copy draft to clipboard or log an audit activity).
4. Ensure no action happens without the human click.

**Success Criteria:**
- Clear "Approval Gate" UI.
- Audit log reflects human-authorized actions.

---

## 🟪 PROMPT 5: Add Lead Wizard (Structured Capture)
**Goal:** Implement the project onboarding logic for new CRM opportunities.

**Tasks & Steps:**
1. Create a `WizardPanel.tsx` step for CRM leads.
2. Step 1: Core details (Company, Contact, Role).
3. Step 2: Strategic context (Pain points, Service interest).
4. Step 3: AI enrichment (Optional URL lookup).
5. Step 4: Summary & Commit.

**Success Criteria:**
- New leads appear in the "Discovery" column immediately upon completion.
- AI enrichment provides valid default values for industry and company bio.