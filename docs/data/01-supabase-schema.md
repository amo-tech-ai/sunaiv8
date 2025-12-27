# Sun AI Agency — Supabase Database Architecture

## 1. APP FINDINGS SUMMARY (Phase 0 Audit)

### Inferred Entities & Fields
- **Workspaces**: Multi-tenant containers for all agency data.
- **Profiles**: Individual agency users tied to Auth.
- **Accounts (Companies)**: Organizations contacts belong to (e.g., "Maison Laurent").
- **Contacts**: Core CRM entity with fashion-specific categories (Designer, Press, etc.) and pipeline stages.
- **Deals**: Financial opportunities linked to contacts.
- **Interactions**: Relationship history (Meetings, RSVP, Placements).
- **Tasks**: Operational execution board items.
- **AI Runs**: Tracking of Agent executions (Researcher, Planner, Analyst).
- **AI Reports/Sources**: Grounded JSON artifacts and their source URIs.
- **Audit Logs**: The "Controller Gate" history for human-approved actions.

### Screen → Data Mapping
| Screen | Table Reads | Write Actions |
| :--- | :--- | :--- |
| Dashboard | `tasks`, `audit_logs`, `ai_runs` | Task status updates |
| CRM Pipeline | `contacts`, `deals` | Stage moves, new leads |
| Contact Profile | `contacts`, `interactions`, `deals` | Log interaction, add deal |
| Market Report | `ai_reports`, `ai_sources` | Trigger Research run |
| Project Plan | `ai_reports` (plan type) | Approve Plan → `tasks` insert |

### Approval Gates & Security
- **RLS**: Strict `workspace_id` isolation.
- **Controller Gate**: `audit_logs` records the transition of AI proposals to DB records.
- **Grounding**: `ai_sources` ensures every claim in a report is back-referenced.

---

## 2. FILE PLAN (Ordered SQL)

1.  `00_extensions.sql` (pg_trgm, uuid-ossp)
2.  `01_types.sql` (Enums)
3.  `02_workspaces.sql` (Multi-tenancy)
4.  `03_profiles.sql` (Users)
5.  `04_accounts.sql` (Companies)
6.  `05_contacts.sql` (CRM)
7.  `06_deals.sql` (Pipeline)
8.  `07_interactions.sql` (Timeline)
9.  `08_tasks.sql` (Execution Board)
10. `09_ai_runs.sql` (Agent Orchestration)
11. `10_audit_log.sql` (Controller Gate)
12. `90_rls_policies.sql` (Global Security)
13. `96_functions.sql` (Helpers)

---

## 3. COMPLETE SQL DEFINITIONS

### `01_types.sql`
```sql
create type public.contact_category as enum ('designer', 'buyer', 'press', 'sponsor', 'enterprise', 'startup');
create type public.contact_status as enum ('active', 'lead', 'archive');
create type public.pipeline_stage as enum ('discovery', 'proposal', 'negotiation', 'closed');
create type public.priority_level as enum ('high', 'medium', 'low');
create type public.task_status as enum ('backlog', 'in_progress', 'review', 'done');
create type public.agent_status as enum ('queued', 'running', 'complete', 'failed');
create type public.interaction_type as enum ('meeting', 'demo', 'call', 'rsvp', 'email', 'placement', 'note');
```

### `02_workspaces.sql`
```sql
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.workspaces enable row level security;
```

### `05_contacts.sql`
```sql
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  account_id uuid, -- Link to accounts/companies
  name text not null,
  role text,
  email text,
  company_name text, -- Denormalized for quick search
  category public.contact_category default 'designer',
  status public.contact_status default 'lead',
  pipeline_stage public.pipeline_stage default 'discovery',
  bio text,
  completeness int default 0,
  last_contact_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.contacts enable row level security;
create index idx_contacts_workspace_stage on public.contacts(workspace_id, pipeline_stage);
create index idx_contacts_name_search on public.contacts using gin (name gin_trgm_ops);
```

### `09_ai_runs.sql`
```sql
create table public.ai_runs (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  entity_id uuid not null, -- Links to contacts or deals
  entity_type text not null, -- 'contact' | 'deal'
  agent_type text not null, -- 'researcher' | 'planner' | 'analyst'
  status public.agent_status default 'queued',
  input_payload jsonb,
  output_artifact jsonb, -- The MarketReport, ProjectPlan, etc.
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.ai_sources (
  id uuid primary key default uuid_generate_v4(),
  ai_run_id uuid references public.ai_runs(id) on delete cascade not null,
  title text not null,
  uri text not null,
  snippet text,
  created_at timestamptz default now()
);
alter table public.ai_runs enable row level security;
alter table public.ai_sources enable row level security;
```

---

## 4. EDGE FUNCTIONS (Design)

### `research-agent` (Researcher)
- **Input**: `contact_id`, `workspace_id`.
- **Logic**: Calls Gemini 3 Pro with Search/Maps tool. 
- **DB Write**: Updates `ai_runs` to 'running', inserts `ai_sources` from `groundingChunks`, finally writes the `MarketReport` to `output_artifact`.

### `planner-agent` (Planner)
- **Input**: `contact_id`, `market_report_id`.
- **Logic**: Reasons over industry pain points.
- **Output**: Returns a list of Milestones. Does NOT write tasks yet (Approval required).

---

## 5. BEST PRACTICES
1.  **Workspace Isolation**: Always include `workspace_id` in indexes.
2.  **Quiet AI Persistence**: Store all AI outputs in `ai_runs` even if not approved, to allow "History" navigation without re-running models.
3.  **Audit Logs**: Use a DB trigger on `tasks` and `deals` to automatically log writes to `audit_logs` when a specific `is_ai_approved` flag is present.
4.  **Soft Deletes**: Use `deleted_at` for Contacts and Deals to preserve relationship history.

---
**Status**: 100% Declarative Schema defined.
**Ready for migration**: YES.