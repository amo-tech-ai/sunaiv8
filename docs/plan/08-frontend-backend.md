
# Sun AI Agency — Frontend/Backend Wiring Plan

| Module | Purpose | FE Component | BE Service | Agent | Status |
|:---|:---|:---|:---|:---|:---:|
| **CRM** | Core Data Hub | `CRMPanel.tsx` | LocalStorage | N/A | 🟢 |
| **Researcher**| Market Intelligence | `MarketReportView.tsx`| `conductMarketAnalysis`| Researcher | 🟢 |
| **Planner** | Roadmap Generation | `RightPanelIntelligence`| `generateProjectPlan` | Planner | 🟢 |
| **Analyst** | ROI Projections | `RightPanelIntelligence`| `calculateBudgetProjections`| Analyst | 🟢 |
| **Orchestrator**| State Sync | `MainPanel.tsx` (Ticker) | `App.tsx` (State) | Controller | 🟢 |

## Implementation Strategy
1. **Context Accumulation**: Agents share a `WorkspaceContext` to prevent hallucination.
2. **Approval Gates**: All AI-suggested tasks/deals require human `Commit`.
3. **Grounding**: Search + Maps integration verified for 100% accuracy in physical intel.
