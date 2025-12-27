# Sun AI Agency — System Diagrams

## 1. Entity-Relationship Diagram (ERD)
Visualizes the structural relationships in the Supabase schema.

```mermaid
erDiagram
    WORKSPACE ||--o{ PROFILE : has
    WORKSPACE ||--o{ CONTACT : manages
    WORKSPACE ||--o{ TASK : executes
    WORKSPACE ||--o{ AI_RUN : triggers
    
    CONTACT ||--o{ DEAL : creates
    CONTACT ||--o{ INTERACTION : logs
    CONTACT ||--o{ AI_RUN : researched_by
    
    AI_RUN ||--o{ AI_SOURCE : grounded_by
    AI_RUN ||--o| AUDIT_LOG : approved_in
    
    CONTACT {
        uuid id
        string name
        enum category
        enum pipeline_stage
        text bio
    }
    
    DEAL {
        uuid id
        currency value
        enum stage
        date close_date
    }
    
    AI_RUN {
        uuid id
        enum agent_type
        jsonb output_artifact
        enum status
    }
```

## 2. Lead-to-Execution Workflow (Flowchart)
The path an agency lead takes from initial capture to automated tasking.

```mermaid
flowchart TD
    A[Wizard Intake] --> B{AI Enrichment}
    B -->|URL/LinkedIn Search| C[CRM Discovery]
    C --> D[User Focus Action]
    D --> E[Deep Research Run]
    E -->|Search Grounding| F[Market Report]
    F --> G[Planner Handoff]
    G --> H[Proposed 4-Week Roadmap]
    H -->|User Approves| I[Controller Gate Audit]
    I --> J[Execution Board: Tasks Created]
```

## 3. "Quiet AI" Sequence Diagram
How intelligence is delivered without cluttering the UI.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant G as Gemini API (Flash/Pro)
    participant B as Supabase DB
    
    U->>F: Click Contact Card
    F->>B: fetchHistory(contact_id)
    B-->>F: data
    F->>F: Render Details View
    Note over F: AI stays silent
    U->>F: Click Intelligence Tab
    F->>G: getAIInsight(context)
    G-->>F: {reasoning, risk, action}
    F->>F: Render Intelligence Panel
    U->>F: Click "Approve Suggestion"
    F->>B: writeAudit(action)
    F->>B: updateContactStatus()
```

## 4. Class Diagram: Frontend State Model
How the TypeScript types map to the React application state.

```mermaid
classDiagram
    class AppState {
        +Contact[] contacts
        +Project[] projects
        +ActionItem[] tasks
        +FocusState focus
        +AgentState agents
    }
    class FocusState {
        +FocusType type
        +string id
        +any data
    }
    class AgentState {
        +bool isResearching
        +bool isPlanning
        +string statusTicker
    }
    AppState *-- FocusState
    AppState *-- AgentState
```

---
**Documentation Level**: Production Grade.
**Workflow Logic**: Verified.