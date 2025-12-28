# App.tsx Refactoring Strategy

**Current State:** ~410 lines, 13 state variables, 13 handlers, multiple responsibilities  
**Goal:** Break into smaller, focused modules  
**Approach:** Incremental refactoring, no breaking changes

---

## Problem Summary

**App.tsx is doing too much:**
- State management (13 useState hooks)
- Persistence logic (4 useEffect hooks)
- Business logic (13 handler functions)
- Routing logic
- AI orchestration
- UI rendering

**Issues:**
- Hard to maintain as it grows
- Hard to reuse logic across different panels
- Violates single responsibility principle
- High cognitive load for developers

---

## Simple Refactoring Plan

### Phase 1: Extract Custom Hooks (Start Here)

**1. Create `hooks/usePersistentState.ts`**
- Consolidate localStorage persistence.
- Handle errors and storage quota.
- Reusable for contacts, projects, tasks, audit logs.

**2. Create `hooks/useFocus.ts`**
- Manage focus state and history (LRU logic).
- Extract focus-related logic from the main component.

**3. Create `hooks/useOrchestrator.ts`**
- Manage agent status (Research, Planning, Automation).
- Extract orchestrator status strings and loading states.

**4. Create `hooks/useNotifications.ts`**
- Manage global notification state.
- Handle auto-dismissal logic.

### Phase 2: Extract Business Logic

**1. Create `services/contactService.ts`**
- Contact CRUD operations.
- Lead stage updates.
- Contact enrichment logic.

**2. Create `services/taskService.ts`**
- Task CRUD operations.
- Task status updates.

**3. Create `services/orchestratorService.ts`**
- Extract `handleDeepResearchLead` logic.
- Manage multi-agent coordination and data passing.

### Phase 3: Modularize App.tsx

**1. Update App.tsx**
- Use the extracted hooks.
- Use extracted services.
- Reduce component size to ~100 lines focused on top-level layout and routing.

---

## Implementation Order

1. **Phase 1: Foundation (Custom Hooks)**
   - `usePersistentState` → Replaces 4 `useEffect` blocks.
   - `useFocus` → Simplifies the history and focus state.
   - `useOrchestrator` → Isolates background agent states.
   - `useNotifications` → Isolates toast logic.

2. **Phase 2: Logic Extraction (Services)**
   - `contactService` → Business logic for CRM.
   - `taskService` → Business logic for Tasks.
   - `orchestratorService` → AI multi-agent logic.

3. **Phase 3: Clean up**
   - Final pass on `App.tsx` to ensure it only handles layout orchestration.

---

## Expected Results

**Before:** 410 lines, monolithic.  
**After:** 
- `App.tsx`: ~100 lines (Layout & Routing).
- `hooks/`: Specialized state hooks.
- `services/`: Specialized business logic.

**Benefits:**
- ✅ **Testable**: Services and hooks can be tested in isolation.
- ✅ **Maintainable**: Clear separation of concerns.
- ✅ **Performant**: Avoids unnecessary re-renders in the main component.
- ✅ **Readable**: Flatter component structure.

---

**Safety Note:** This refactor is designed to be incremental. We can move one hook at a time without breaking the rest of the application. The shared `types.ts` ensures that data structures remain consistent throughout the process.
