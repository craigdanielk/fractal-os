-- ==========================================
-- RLS MODEL-X REAPPLY - PHASE 3
-- ==========================================
-- Pure tenant isolation with ZERO cross-table dependencies
-- NO joins, NO subqueries, NO lookups, NO recursion
-- All RBAC logic moved to application layer

-- ==========================================
-- STEP 1: HARD DROP ALL POLICIES
-- ==========================================

-- Drop all policies from all tables
DO $$
DECLARE 
    tbl TEXT;
    pol RECORD;
    tables TEXT[] := ARRAY[
        'tenants',
        'tenant_users',
        'clients',
        'projects',
        'tasks',
        'time_entries',
        'economics',
        'vendors',
        'audit_logs'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        -- Drop all policies for this table
        FOR pol IN
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I CASCADE;', pol.policyname, tbl);
        END LOOP;
        
        -- Ensure RLS is enabled
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END
$$;

-- ==========================================
-- STEP 2: TENANTS TABLE (ROOT TABLE)
-- ==========================================
-- Special case: root table with special access rules

CREATE POLICY "tenants_select" ON public.tenants
FOR SELECT
USING (
    id::text = (auth.jwt() ->> 'tenant_id')
    OR (auth.jwt() ->> 'tenant_id') = 'fractal-root'
);

CREATE POLICY "tenants_insert" ON public.tenants
FOR INSERT
WITH CHECK (
    (auth.jwt() ->> 'tenant_id') = 'fractal-root'
);

CREATE POLICY "tenants_update" ON public.tenants
FOR UPDATE
USING (
    id::text = (auth.jwt() ->> 'tenant_id')
    OR (auth.jwt() ->> 'tenant_id') = 'fractal-root'
)
WITH CHECK (
    id::text = (auth.jwt() ->> 'tenant_id')
    OR (auth.jwt() ->> 'tenant_id') = 'fractal-root'
);

CREATE POLICY "tenants_delete" ON public.tenants
FOR DELETE
USING (
    (auth.jwt() ->> 'tenant_id') = 'fractal-root'
);

-- ==========================================
-- STEP 3: TENANT_USERS TABLE (NO SELF-REFERENCE)
-- ==========================================
-- CRITICAL: No queries into tenant_users table itself
-- Uses JWT role claim directly

CREATE POLICY "tenant_users_select" ON public.tenant_users
FOR SELECT
USING (
    user_id::text = (auth.jwt() ->> 'sub')
    OR (
        (auth.jwt() ->> 'role') = 'tenant_owner'
        AND tenant_id::text = (auth.jwt() ->> 'tenant_id')
    )
);

CREATE POLICY "tenant_users_insert" ON public.tenant_users
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
    AND (auth.jwt() ->> 'role') = 'tenant_owner'
);

CREATE POLICY "tenant_users_update" ON public.tenant_users
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
    AND (auth.jwt() ->> 'role') = 'tenant_owner'
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
    AND (auth.jwt() ->> 'role') = 'tenant_owner'
);

CREATE POLICY "tenant_users_delete" ON public.tenant_users
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
    AND (auth.jwt() ->> 'role') = 'tenant_owner'
);

-- ==========================================
-- STEP 4: CLIENTS TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "clients_select" ON public.clients
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "clients_insert" ON public.clients
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "clients_update" ON public.clients
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "clients_delete" ON public.clients
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 5: PROJECTS TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "projects_select" ON public.projects
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "projects_insert" ON public.projects
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "projects_update" ON public.projects
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "projects_delete" ON public.projects
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 6: TASKS TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "tasks_select" ON public.tasks
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "tasks_insert" ON public.tasks
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "tasks_update" ON public.tasks
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "tasks_delete" ON public.tasks
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 7: TIME_ENTRIES TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "time_entries_select" ON public.time_entries
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "time_entries_insert" ON public.time_entries
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "time_entries_update" ON public.time_entries
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "time_entries_delete" ON public.time_entries
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 8: ECONOMICS TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "economics_select" ON public.economics
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "economics_insert" ON public.economics
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "economics_update" ON public.economics
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "economics_delete" ON public.economics
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 9: VENDORS TABLE (PURE TENANT ISOLATION)
-- ==========================================

CREATE POLICY "vendors_select" ON public.vendors
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "vendors_insert" ON public.vendors
FOR INSERT
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "vendors_update" ON public.vendors
FOR UPDATE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "vendors_delete" ON public.vendors
FOR DELETE
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

-- ==========================================
-- STEP 10: AUDIT_LOGS TABLE (SPECIAL CASE)
-- ==========================================
-- SELECT: tenant-scoped
-- INSERT: always allowed (system writes)
-- UPDATE/DELETE: forbidden

CREATE POLICY "audit_logs_select" ON public.audit_logs
FOR SELECT
USING (
    tenant_id::text = (auth.jwt() ->> 'tenant_id')
);

CREATE POLICY "audit_logs_insert" ON public.audit_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "audit_logs_no_update" ON public.audit_logs
FOR UPDATE
USING (false);

CREATE POLICY "audit_logs_no_delete" ON public.audit_logs
FOR DELETE
USING (false);

-- ==========================================
-- VALIDATION QUERIES
-- ==========================================
-- Run these after migration to verify:
-- 
-- SELECT polname, tablename, cmd 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, polname;
-- 
-- SELECT auth.jwt();
-- 
-- SELECT tenant_id FROM projects LIMIT 1;

-- ==========================================
-- DONE
-- ==========================================

