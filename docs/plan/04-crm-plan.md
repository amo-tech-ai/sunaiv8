
# Sun AI Agency — CRM Module Plan

**Version:** 1.1 (Production Final)
**Focus:** CRM Module Strategy & Architecture
**Layout Model:** LEFT = Context · MAIN = Work · RIGHT = Intelligence
**Principle:** AI proposes, human approves.

---

## ✅ Final Verification Checklist

| Protocol | Status | Verification Steps |
| :--- | :---: | :--- |
| **Pipeline Logic** | 🟢 | Ensure leads move stages correctly via RightPanel dropdown. |
| **Audit Fidelity** | 🟢 | Check Settings page to verify all AI actions are logged with actor context. |
| **Quiet AI Fidelity** | 🟢 | Verify intelligence tab remains idle until explicitly clicked. |
| **Wizard Integration** | 🟢 | Test adding a lead; verify it appears in "Discovery" column immediately. |
| **Search Grounding** | 🟢 | Ask Assistant "What is the latest trend for E-commerce chatbots?" (requires Search tool). |

---

## 1. CRM Screens Inventory

| Screen Type | Screen | Purpose | Status |
| :--- | :--- | :--- | :---: |
| **Dashboard** | CRM Pipeline | Multi-column deal management with value totals. | 🟢 |
| **Detail** | Contact Drawer | Stakeholder bio, relationship health, stage actions. | 🟢 |
| **Wizard** | Add Lead | Step-based onboarding with enrichment. | 🟢 |
| **Assistant** | CRM Query | Workspace-grounded natural language search. | 🟢 |

---

## 2. Advanced AI Workflows (Implemented)

### Buying Intent Agent
Utilizes Gemini 3 Pro to scan stakeholder bios and activity logs. Returns a structured intent signal (Low/Medium/High) to the Intelligence panel.

### Controller Gate (Audit Log)
All proposed AI actions (e.g., "Draft Nudge Email") are held in a pending state. Approval triggers a simulated execution and writes a permanent record to the `AuditLog`.

---

## 3. Testing Strategy
1. **Sanity:** Create 5 leads via Wizard.
2. **Stress:** Rapidly switch focus between CRM leads and Projects.
3. **Accuracy:** Compare Gemini's "Suggested Action" against mock bio pain points.
4. **Resiliency:** Disable API key and check for graceful Intelligence panel error states.
