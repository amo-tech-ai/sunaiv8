
# 🚀 Sun AI Agency — Production Setup Plan

**Goal:** Transition the platform from LocalStorage (Demo Mode) to a Scalable Cloud Backend (Supabase + Vercel) while maintaining the current high-fidelity UI.

---

## 1. Backend Architecture (Supabase)

The application currently uses `hooks/usePersistentState.ts` to sync with `localStorage`. This will be replaced by a Supabase client.

### Core Tables Schema
```sql
-- 1. Contacts (CRM)
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  name text,
  company text,
  role text,
  status text, -- 'Active' | 'Lead' | 'Archive'
  pipeline_stage text, -- 'Discovery' | 'Proposal'
  score int,
  ai_enrichment jsonb, -- Stores { bio, market_pos }
  created_at timestamptz default now()
);

-- 2. Projects (Portfolio)
create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text,
  client text,
  status text, -- 'On Track' | 'At Risk'
  wbs_json jsonb, -- Stores the AI-generated roadmap
  risk_analysis jsonb, -- Stores the Project Manager Agent output
  created_at timestamptz default now()
);

-- 3. Tasks (Execution)
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text,
  project_id uuid references projects(id),
  status text, -- 'Backlog' | 'Done'
  priority text,
  ai_generated boolean default false
);

-- 4. Audit Logs (Controller Gate)
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  action text,
  actor text, -- 'Julian Smith'
  context text,
  timestamp timestamptz default now()
);
```

---

## 2. Frontend Wiring Plan

### Step A: Install Dependencies
```bash
npm install @supabase/supabase-js
```

### Step B: Create Client Singleton
Create `services/supabaseClient.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Step C: Replace `usePersistentState`
Update `hooks/usePersistentState.ts` to implement a sync strategy:
1.  **On Mount:** Fetch initial data from Supabase.
2.  **On Change:** Optimistically update local state, then push to Supabase (debounce 1s).
3.  **Real-time:** Subscribe to Supabase `postgres_changes` to handle multi-user edits.

---

## 3. Environment Variables Strategy

For production deployment (Vercel), configure the following:

| Variable | Purpose | Security Note |
| :--- | :--- | :--- |
| `API_KEY` | Gemini 3 API access | Server-side ONLY (Next.js API Routes recommended) |
| `NEXT_PUBLIC_SUPABASE_URL` | DB Connection | Public safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | RLS Policies | Public safe |

**CRITICAL SECURITY UPGRADE:**
Currently, `process.env.API_KEY` is accessed in the client for the demo. In production, you **MUST** move all `geminiService.ts` calls to Next.js Edge Functions or API Routes to hide the Google GenAI Key.

**Refactor Pattern:**
*   **Current:** `Client Component` -> `new GoogleGenAI(key)` -> `Google API`
*   **Production:** `Client Component` -> `fetch('/api/agent/research')` -> `Server Route (Holds Key)` -> `Google API`

---

## 4. Next Implementation Steps (Sequential)

1.  **Database Migration:** Run the SQL schema in Supabase.
2.  **Auth Integration:** Add Supabase Auth (Google Login) to `App.tsx` (Replace hardcoded user).
3.  **API Route Proxy:** Move `services/geminiService.ts` logic into `/app/api/` endpoints.
4.  **Real-time Polish:** Enable Supabase Realtime for the "Tasks Board" so multiple agents/users see cards move instantly.
5.  **Storage:** Connect `storage` bucket for the "Creative Agent" image assets instead of base64 strings.

---

## 5. Deployment Checklist

- [ ] **Linting:** Ensure no `any` types in critical data paths.
- [ ] **Build:** Run `npm run build` to verify no circular dependencies.
- [ ] **Environment:** Set up Vercel Project with Env Vars.
- [ ] **DNS:** Map custom domain (e.g., `dashboard.sunai.agency`).
- [ ] **Monitoring:** Set up LogRocket or Sentry for error tracking (use the existing ErrorBoundary).

---
**Status:** Planning Complete.
**Ready for:** Phase 1 (Database Migration).
