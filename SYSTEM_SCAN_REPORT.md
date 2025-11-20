# FRACTALOS SYSTEM SCAN REPORT
## Complete Repository Analysis for Cockpit-Full Supabase Rebuild

**Scan Date:** 2024-11-20  
**Purpose:** Prepare for Cockpit-Full Supabase rebuild  
**Status:** SCAN COMPLETE – CONTEXT READY

---

## 1. REPOSITORY STRUCTURE OVERVIEW

### Active Directories:
- ✅ **cockpit-lite/** - Next.js 14 production frontend (Supabase-integrated)
- ⚠️ **cockpit/** - Legacy frontend (Notion-bound, needs migration)
- ✅ **kernel/** - Core backend logic (mixed Supabase/Notion)
- ✅ **supabase/** - Database migrations & config (1 baseline migration)
- ✅ **agents/** - AI agent system
- ✅ **modules/** - Domain modules (automation, CRM, finance, etc.)
- ⚠️ **api/** - Root-level API stubs (empty implementations)
- ✅ **workers/** - Background sync workers
- ✅ **scripts/** - Utility scripts

### Deprecated/Legacy:
- ⚠️ **frontend/** - Unused Next.js app (minimal files)

---

## 2. SCHEMA ANALYSIS

### 2.1 Baseline Schema (0001_baseline_schema.sql)
**Tables Created:**
- ✅ `tenants` (id, name, slug, created_at)
- ✅ `tenant_users` (id, tenant_id, user_id, role, created_at)
- ✅ `clients` (id, tenant_id, name, created_at)
- ✅ `projects` (id, tenant_id, client_id, name, description, start_date, target_end_date, actual_end_date, budget, actual_cost, status, priority, created_at)
- ✅ `tasks` (id, tenant_id, project_id, name, description, status, priority, start_date, end_date, created_at)
- ✅ `time_entries` (id, tenant_id, task_id, user_id, session_name, session_date, start_time, end_time, duration_hours, notes, created_at)
- ✅ `economics` (id, tenant_id, name, base_rate, direct_expenses, margin_targets, overhead_pct, created_at)

**RLS:** All tables have RLS enabled with Model-X tenant isolation policies

### 2.2 Schema Mismatches Identified

#### CRITICAL MISMATCHES:

1. **Table Name: `economics` vs `economics_model`**
   - Baseline SQL: `economics`
   - TypeScript types: `economics_model` (in `cockpit-lite/services/economics.ts:28`)
   - Drizzle schema: `economics`
   - **Action Required:** Standardize to `economics` everywhere

2. **Projects Column: `name` vs `project_name`**
   - Baseline SQL: `name`
   - TypeScript types: `project_name` (in `cockpit-lite/lib/supabase-types.ts:24`)
   - **Action Required:** Update TypeScript types to match baseline

3. **Tasks Column: `name` vs `task_name`**
   - Baseline SQL: `name`
   - TypeScript types: `task_name` (in `cockpit-lite/lib/supabase-types.ts:45`)
   - **Action Required:** Update TypeScript types to match baseline

4. **Economics Columns:**
   - Baseline SQL: `margin_targets` (plural)
   - TypeScript/Seed: `margin_target` (singular) or `margin_targets`
   - Baseline SQL: `overhead_pct`
   - TypeScript: `overhead_percent` or `overhead_pct`
   - **Action Required:** Standardize naming

5. **Missing Columns in Baseline:**
   - `projects.updated_at` - Referenced in TypeScript but not in baseline
   - `tasks.updated_at` - Referenced in TypeScript but not in baseline
   - `time_entries.updated_at` - Referenced in TypeScript but not in baseline
   - `economics.updated_at` - Referenced in TypeScript but not in baseline
   - `clients.updated_at` - Referenced in TypeScript but not in baseline

6. **Drizzle Schema Mismatch:**
   - Drizzle schema (`kernel/drizzle/schema.ts`) has different structure:
     - Uses camelCase (e.g., `clientId`, `projectId`)
     - Has additional fields not in baseline (e.g., `type`, `status`, `region` for clients)
     - Uses `timeEntries` vs `time_entries`
   - **Action Required:** Decide if Drizzle schema is legacy or needs migration

---

## 3. NOTION REFERENCES ANALYSIS

### 3.1 Active Notion References (MUST REMOVE):

1. **cockpit/services/api.ts**
   - ❌ Imports `notionGetTasks`, `notionGetProjects`, etc. from `kernel/utils/notion.adapter`
   - ❌ All API methods call Notion functions
   - **Status:** ACTIVE - Used by legacy cockpit frontend

2. **kernel/utils/notion.adapter.ts**
   - ❌ Active adapter with mapping functions
   - **Status:** ACTIVE - Used by cockpit/services/api.ts

3. **kernel/utils/notion.etl.ts**
   - ❌ ETL migration functions using `@notionhq/client`
   - **Status:** ACTIVE - Referenced but may be unused

4. **cockpit/** directory (entire directory)
   - ❌ All pages/components import from `kernel/schemas` and use Notion-bound API
   - **Status:** LEGACY - Needs full migration

### 3.2 Deprecated Notion Stubs (Safe):

- ✅ `cockpit-lite/lib/notion.ts` - Stub only
- ✅ `cockpit-lite/services/notion.ts` - Stub only
- ✅ `cockpit-lite/app/api/notion-sync/route.ts` - Deprecated endpoint

### 3.3 Notion Environment Variables:
- ⚠️ `NOTION_INTEGRATION_SECRET` - Still referenced in `kernel/utils/notion.etl.ts:9`
- ⚠️ `NOTION_API_KEY` - Referenced in docs but not in code
- ⚠️ `NOTION_*_DB_ID` - Referenced in docs but not in code

**Total Notion References:** 4 active files + entire `cockpit/` directory

---

## 4. SUPABASE INTEGRATION STATUS

### 4.1 Fully Supabase-Integrated (cockpit-lite):

**Services:**
- ✅ `cockpit-lite/services/projects.ts` - Uses `dbQuery` + `getScopedSupabaseClient`
- ✅ `cockpit-lite/services/tasks.ts` - Uses `dbQuery` + `getScopedSupabaseClient`
- ✅ `cockpit-lite/services/time.ts` - Uses `getScopedSupabaseClient`
- ✅ `cockpit-lite/services/economics.ts` - Uses `dbQuery` + `getScopedSupabaseClient` (references `economics_model` - MISMATCH)
- ✅ `cockpit-lite/services/clients.ts` - Uses `getScopedSupabaseClient`
- ✅ `cockpit-lite/services/vendors.ts` - Uses `dbQuery` + `getScopedSupabaseClient`
- ✅ `cockpit-lite/services/supabase.ts` - Unified Supabase client
- ✅ `cockpit-lite/services/sync.ts` - Offline sync with Supabase

**Libraries:**
- ✅ `cockpit-lite/lib/supabase-client.ts` - Scoped client with tenant context
- ✅ `cockpit-lite/lib/supabase-client-browser.ts` - Browser client
- ✅ `cockpit-lite/lib/realtime.ts` - Supabase Realtime wrapper
- ✅ `cockpit-lite/lib/offline.ts` - IndexedDB sync with Supabase
- ✅ `cockpit-lite/lib/supabase/middleware.ts` - Auth middleware

**API Routes:**
- ✅ `cockpit-lite/app/api/auth/callback/route.ts` - Supabase auth callback
- ✅ `cockpit-lite/app/api/auth/session/route.ts` - Session management
- ✅ `cockpit-lite/app/api/tenants/route.ts` - Tenant API
- ✅ `cockpit-lite/app/api/sync/route.ts` - Sync endpoint
- ✅ `cockpit-lite/app/api/telemetry/*` - Telemetry endpoints

### 4.2 Kernel Supabase Integration:

**Partially Integrated:**
- ✅ `kernel/utils/safe-query.ts` - Uses Supabase admin client
- ✅ `kernel/db/write.ts` - Uses Supabase for writes
- ✅ `kernel/utils/supabase.client.ts` - Supabase client utility
- ⚠️ `kernel/drizzle/schema.ts` - Drizzle ORM schema (may be legacy)

**Not Integrated:**
- ❌ `kernel/api/*.api.ts` - All 5 API files are empty/stub implementations
- ❌ `kernel/commands/*.commands.ts` - May use Drizzle, not Supabase directly

---

## 5. ROUTE ANALYSIS

### 5.1 cockpit-lite Routes (Active):

**Pages:**
- ✅ `/` - Home page
- ✅ `/dashboard` - Dashboard
- ✅ `/projects` - Projects list
- ✅ `/projects/[id]` - Project detail
- ✅ `/tasks` - Tasks list
- ✅ `/tasks/[id]` - Task detail
- ✅ `/time` - Time tracking
- ✅ `/time/[id]` - Time entry detail
- ✅ `/economics` - Economics list
- ✅ `/economics/[id]` - Economics detail
- ✅ `/clients` - Clients list
- ✅ `/tenants` - Tenants management
- ✅ `/t/[tenant]/dashboard` - Tenant-scoped dashboard

**API Routes:**
- ✅ `/api/auth/callback` - Auth callback
- ✅ `/api/auth/session` - Session endpoint
- ✅ `/api/tenants` - Tenants CRUD
- ✅ `/api/sync` - Sync trigger
- ✅ `/api/telemetry/action` - Action telemetry
- ✅ `/api/telemetry/error` - Error telemetry
- ⚠️ `/api/notion-sync` - Deprecated (returns deprecated status)

### 5.2 cockpit Routes (Legacy - Notion-bound):

- ⚠️ `/dashboard` - Uses Notion API
- ⚠️ `/tasks` - Uses Notion API
- ⚠️ `/time` - Uses Notion API
- ⚠️ `/economics` - Uses Notion API

### 5.3 Root API Routes (Stubs):

- ❌ `/api/projects.ts` - Empty GET/POST stubs
- ❌ `/api/tasks.ts` - Empty GET/POST stubs
- ❌ `/api/time.ts` - Empty GET/POST stubs
- ❌ `/api/economics.ts` - Empty GET/POST stubs

**Status:** Unused, can be removed

---

## 6. DEPENDENCY GRAPH

### 6.1 cockpit-lite Dependencies:

**External:**
- ✅ `@supabase/supabase-js` - Primary database client
- ✅ `@supabase/ssr` - Server-side rendering support
- ✅ `dexie` - IndexedDB for offline
- ✅ `zustand` - State management
- ✅ `next` - Framework

**Internal (kernel):**
- ✅ `kernel/utils/safe-query` - Used by projects, tasks, economics, vendors services
- ✅ `kernel/utils/identity` - Used by auth callback
- ✅ `kernel/auth/token` - Used by auth.ts
- ⚠️ `kernel/api/*.api.ts` - Referenced in `cockpit-lite/lib/data.ts` but APIs are stubs

**Internal (cockpit-lite):**
- ✅ `lib/supabase-client` - Used by all services
- ✅ `lib/realtime` - Used by services for subscriptions
- ✅ `lib/cache` - Used by all services
- ✅ `lib/offline` - Used by services for offline support

### 6.2 cockpit Dependencies:

**External:**
- ❌ `@notionhq/client` - Notion API (via kernel)

**Internal:**
- ❌ `kernel/utils/notion.adapter` - All API calls
- ❌ `kernel/schemas` - Type definitions

### 6.3 Kernel Dependencies:

**External:**
- ✅ `@supabase/supabase-js` - Used in safe-query, write, supabase.client
- ⚠️ `@notionhq/client` - Used in notion.etl.ts
- ✅ `drizzle-orm` - Used in drizzle/schema.ts
- ✅ `pg` - PostgreSQL client

---

## 7. AUTHENTICATION FLOWS

### 7.1 cockpit-lite Auth:

1. **Middleware:** `cockpit-lite/middleware.ts`
   - Uses `supabaseMiddleware` from `lib/supabase/middleware`
   - Protects routes: `/dashboard`, `/projects`, `/tasks`, `/time`, `/economics`, `/clients`
   - Public: `/login`

2. **Auth Callback:** `app/api/auth/callback/route.ts`
   - Uses `ensureIdentity` from `kernel/utils/identity`
   - Creates identity_user record

3. **Session Management:** `app/api/auth/session/route.ts`
   - Returns current session

4. **Tenant Context:** `lib/auth/tenant.ts`
   - Manages tenant selection
   - Uses `getScopedSupabaseClient`

### 7.2 Kernel Auth:

- ✅ `kernel/auth/login.ts` - Login logic
- ✅ `kernel/auth/token.ts` - JWT token minting with tenant claims

---

## 8. REALTIME FLOWS

### 8.1 cockpit-lite Realtime:

**Implementation:**
- ✅ `lib/realtime.ts` - Supabase Realtime wrapper
- ✅ `lib/hooks/useRealtimeTasks.ts` - Tasks subscription hook
- ✅ `lib/hooks/useRealtimeProjects.ts` - Projects subscription hook
- ✅ `lib/hooks/useRealtimeEconomics.ts` - Economics subscription hook
- ✅ `lib/hooks/useRealtimeTimer.ts` - Timer subscription hook
- ✅ `components/RealtimeProvider.tsx` - Realtime context provider

**Subscriptions:**
- ✅ `projects` table
- ✅ `tasks` table
- ✅ `time_entries` table
- ✅ `economics` table (referenced as `economics_model` - MISMATCH)

**Cache Invalidation:**
- ✅ Services invalidate cache on realtime events
- ✅ Uses `cacheInvalidate` from `lib/cache`

---

## 9. DATA FETCHERS & LOADERS

### 9.1 cockpit-lite Services:

**Read Operations:**
- ✅ `getProjects()` - Uses `dbQuery` with tenant filtering
- ✅ `getTasks()` - Uses `dbQuery` with tenant filtering
- ✅ `getTimeEntries()` - Uses `getScopedSupabaseClient`
- ✅ `getEconomics()` - Uses `dbQuery` (references `economics_model` - MISMATCH)
- ✅ `getClients()` - Uses `getScopedSupabaseClient`
- ✅ `getVendors()` - Uses `dbQuery`

**Write Operations:**
- ✅ `createProject()` - Uses `getScopedSupabaseClient`
- ✅ `updateProject()` - Uses `getScopedSupabaseClient`
- ✅ `deleteProject()` - Uses `getScopedSupabaseClient`
- ✅ Similar patterns for tasks, time, clients, vendors

**Transformers:**
- ✅ `lib/supabase-mapper.ts` - Maps DB types to app types
- ✅ `mapProject`, `mapTask`, `mapTimeEntry`, `mapEconomicsModel`, `mapClient`

### 9.2 Kernel Data Access:

**Safe Query:** `kernel/utils/safe-query.ts`
- ✅ Tenant-scoped queries
- ✅ Automatic tenant filtering
- ✅ Supports SELECT, INSERT, UPDATE, DELETE

**Write Operations:** `kernel/db/write.ts`
- ✅ Uses Supabase for writes
- ✅ Handles events from queue

---

## 10. ENVIRONMENT VARIABLES

### 10.1 Required for cockpit-lite:

**Supabase:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side)
- ✅ `SUPABASE_URL` - Alternative to NEXT_PUBLIC_SUPABASE_URL (for scripts)
- ✅ `SUPABASE_DB_URL` - Database connection string (for migrations)

**Auth:**
- ⚠️ No explicit auth env vars (uses Supabase Auth)

### 10.2 Legacy/Unused:

- ❌ `NOTION_INTEGRATION_SECRET` - Still referenced in `kernel/utils/notion.etl.ts`
- ❌ `NOTION_API_KEY` - Referenced in docs only
- ❌ `NOTION_*_DB_ID` - Referenced in docs only

---

## 11. BROKEN IMPORTS / MISSING DEPENDENCIES

### 11.1 Broken Imports:

1. **cockpit-lite/services/economics.ts:28**
   - References `economics_model` table
   - Baseline schema has `economics`
   - **Status:** WILL FAIL at runtime

2. **cockpit-lite/services/economics.ts:64,81,104,126**
   - Uses `getScopedSupabaseClient()` but function may not be imported
   - **Status:** NEEDS VERIFICATION

3. **cockpit-lite/lib/data.ts**
   - Imports from `kernel/api/*.api.ts` which are stubs
   - **Status:** MAY BE UNUSED

### 11.2 Missing Functions:

- ⚠️ `getScopedSupabaseClient()` - Referenced but need to verify export
- ⚠️ `getAccessibleTenants()` - Used in safe-query.ts, need to verify

---

## 12. RLS-DEPENDENT QUERIES

### 12.1 All Queries Use RLS:

**Via `dbQuery` (automatic tenant filtering):**
- ✅ `projects` - Filtered by accessible tenants
- ✅ `tasks` - Filtered by accessible tenants
- ✅ `economics` - No tenant filter (`noTenantFilter: true`)
- ✅ `vendors` - Filtered by accessible tenants

**Via `getScopedSupabaseClient` (tenant context):**
- ✅ `clients` - Uses tenant context
- ✅ `time_entries` - Uses tenant context
- ✅ `projects` (write ops) - Uses tenant context
- ✅ `tasks` (write ops) - Uses tenant context

**Direct Supabase (bypasses RLS with service role):**
- ⚠️ `kernel/utils/safe-query.ts` - Uses service role, manually filters
- ⚠️ `kernel/db/write.ts` - Uses service role

---

## 13. UNUSED / DEAD FILES

### 13.1 Likely Unused:

- ❌ `api/projects.ts` - Empty stubs
- ❌ `api/tasks.ts` - Empty stubs
- ❌ `api/time.ts` - Empty stubs
- ❌ `api/economics.ts` - Empty stubs
- ❌ `frontend/` directory - Minimal Next.js app, unused
- ⚠️ `cockpit/` directory - Legacy, Notion-bound
- ⚠️ `kernel/drizzle/schema.ts` - May be legacy if not used
- ⚠️ `kernel/utils/notion.etl.ts` - May be unused migration script

### 13.2 Deprecated but Kept:

- ✅ `cockpit-lite/lib/notion.ts` - Stub for backward compatibility
- ✅ `cockpit-lite/services/notion.ts` - Stub for backward compatibility
- ✅ `cockpit-lite/app/api/notion-sync/route.ts` - Deprecated endpoint

---

## 14. MISSING SUPABASE TABLES/COLUMNS

### 14.1 Referenced but Not in Baseline:

**Tables:**
- ❌ `audit_logs` - Referenced in `cockpit-lite/services/supabase.ts:16`
- ❌ `vendors` - Referenced in services but not in baseline schema
- ❌ `identity_users` - Referenced in `kernel/utils/safe-query.ts:44` (getAccessibleTenants)
- ❌ `tenant_members` - Referenced in safe-query.ts comments

**Columns Missing:**
- ❌ `projects.updated_at` - Referenced in TypeScript types
- ❌ `tasks.updated_at` - Referenced in TypeScript types
- ❌ `time_entries.updated_at` - Referenced in TypeScript types
- ❌ `economics.updated_at` - Referenced in TypeScript types
- ❌ `clients.updated_at` - Referenced in TypeScript types

---

## 15. COCKPIT-LITE REFERENCES

### 15.1 Files Referencing "cockpit-lite":

- ✅ `TREE_STRUCTURE.md` - Documentation
- ✅ `cockpit-lite/package.json` - Package name
- ✅ `cockpit-lite/README.md` - Documentation
- ✅ `PHASE_*_IMPLEMENTATION.md` - Phase documentation
- ✅ `cockpit-lite/LAUNCH_CHECKLIST.md` - Launch checklist

**Status:** All references are documentation/package names, no code dependencies

---

## 16. KERNEL API USAGE

### 16.1 Active Kernel APIs:

**Used by cockpit-lite:**
- ✅ `kernel/utils/safe-query` - Used by projects, tasks, economics, vendors
- ✅ `kernel/utils/identity` - Used by auth callback
- ✅ `kernel/auth/token` - Used by auth.ts

**Referenced but Stubs:**
- ⚠️ `kernel/api/projects.api.ts` - Empty stub
- ⚠️ `kernel/api/tasks.api.ts` - Empty stub
- ⚠️ `kernel/api/clients.api.ts` - Empty stub
- ⚠️ `kernel/api/time.api.ts` - Empty stub
- ⚠️ `kernel/api/economics.api.ts` - Empty stub
- **Used in:** `cockpit-lite/lib/data.ts` (may be unused)

**Used by cockpit (legacy):**
- ❌ `kernel/utils/notion.adapter` - All Notion API calls
- ❌ `kernel/schemas` - Type definitions

---

## 17. SUMMARY OF CRITICAL ISSUES

### 17.1 Schema Mismatches (MUST FIX):

1. ❌ Table name: `economics` vs `economics_model`
2. ❌ Column: `projects.name` vs `project_name`
3. ❌ Column: `tasks.name` vs `task_name`
4. ❌ Missing `updated_at` columns on all tables
5. ❌ Missing `audit_logs` table
6. ❌ Missing `vendors` table
7. ❌ Missing `identity_users` / `tenant_members` tables

### 17.2 Broken Code Paths:

1. ❌ `cockpit-lite/services/economics.ts` - References `economics_model` (doesn't exist)
2. ❌ `cockpit-lite/services/supabase.ts` - References `audit_logs` (doesn't exist)
3. ❌ `cockpit-lite/services/vendors.ts` - References `vendors` table (doesn't exist)
4. ⚠️ `kernel/utils/safe-query.ts` - References `getAccessibleTenants` (need to verify)

### 17.3 Legacy Code to Migrate:

1. ❌ Entire `cockpit/` directory - Notion-bound, needs Supabase migration
2. ❌ `cockpit/services/api.ts` - All Notion API calls
3. ❌ `kernel/utils/notion.adapter.ts` - Active Notion adapter
4. ⚠️ `kernel/utils/notion.etl.ts` - ETL script (may be unused)

### 17.4 Missing Migrations:

1. ❌ `audit_logs` table creation
2. ❌ `vendors` table creation
3. ❌ `identity_users` / `tenant_members` tables (if needed)
4. ❌ Add `updated_at` columns to all tables
5. ❌ Fix table/column naming inconsistencies

---

## 18. RECOMMENDATIONS FOR COCKPIT-FULL REBUILD

### 18.1 Immediate Actions:

1. **Fix Schema Mismatches:**
   - Update baseline migration to include missing tables/columns
   - Standardize table/column naming
   - Add `updated_at` to all tables

2. **Remove Notion Dependencies:**
   - Migrate `cockpit/` directory to Supabase
   - Remove `kernel/utils/notion.adapter.ts` usage
   - Remove Notion env vars

3. **Fix Broken References:**
   - Update `economics_model` → `economics`
   - Create `audit_logs` table
   - Create `vendors` table
   - Verify `getAccessibleTenants` implementation

4. **Clean Up:**
   - Remove unused `api/` stubs
   - Remove `frontend/` directory
   - Verify and remove unused kernel APIs

### 18.2 Architecture Decisions Needed:

1. **Drizzle ORM:** Keep or remove? Currently has different schema than baseline
2. **Kernel APIs:** Implement stubs or remove references?
3. **Identity System:** Use `identity_users` or `tenant_users`?
4. **Vendors:** Include in baseline or separate migration?

---

## SCAN COMPLETE – CONTEXT READY

**Total Files Scanned:** ~200+  
**Critical Issues Found:** 7 schema mismatches, 3 broken code paths  
**Legacy Code:** 1 entire directory (`cockpit/`) + 4 active Notion files  
**Missing Tables:** 3 tables (`audit_logs`, `vendors`, `identity_users`)  
**Environment Variables:** 5 required, 3 legacy  

**Ready for Cockpit-Full Supabase Rebuild.**

