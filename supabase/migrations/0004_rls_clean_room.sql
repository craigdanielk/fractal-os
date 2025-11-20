-- ==========================================
-- RLS CLEAN ROOM - PHASE 2
-- ==========================================
-- Finalizes all RLS rules with zero recursion, zero circular dependencies
-- Ensures Model-X tenant isolation with proper JWT claim extraction

-- ==========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ==========================================

-- Helper function to drop all policies for a table
CREATE OR REPLACE FUNCTION drop_all_policies(tbl TEXT) RETURNS VOID AS $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I CASCADE;', pol.policyname, tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Drop all policies from all tables
DO $$
DECLARE 
    tbl TEXT;
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
        PERFORM drop_all_policies(tbl);
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END
$$;

-- ==========================================
-- STEP 2: CREATE SAFE JWT HELPER FUNCTIONS
-- ==========================================

-- Drop and recreate helper functions to ensure clean state
DROP FUNCTION IF EXISTS get_jwt_tenant_id() CASCADE;
DROP FUNCTION IF EXISTS get_jwt_user_id() CASCADE;
DROP FUNCTION IF EXISTS is_tenant_owner(UUID) CASCADE;

-- Extract tenant_id from JWT claims
CREATE OR REPLACE FUNCTION get_jwt_tenant_id() RETURNS UUID AS $$
DECLARE
    claim_value TEXT;
BEGIN
    claim_value := current_setting('request.jwt.claims', true)::json->>'tenant_id';
    IF claim_value IS NULL OR claim_value = '' THEN
        RETURN NULL;
    END IF;
    RETURN claim_value::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Extract user_id (sub) from JWT claims
CREATE OR REPLACE FUNCTION get_jwt_user_id() RETURNS UUID AS $$
DECLARE
    claim_value TEXT;
BEGIN
    claim_value := current_setting('request.jwt.claims', true)::json->>'sub';
    IF claim_value IS NULL OR claim_value = '' THEN
        RETURN NULL;
    END IF;
    RETURN claim_value::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Extract role from JWT claims (set by backend when user is tenant owner)
CREATE OR REPLACE FUNCTION get_jwt_role() RETURNS TEXT AS $$
DECLARE
    claim_value TEXT;
BEGIN
    claim_value := current_setting('request.jwt.claims', true)::json->>'role';
    RETURN COALESCE(claim_value, '');
EXCEPTION
    WHEN OTHERS THEN
        RETURN '';
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if user is tenant owner (NON-RECURSIVE - uses JWT role claim)
-- This function MUST NOT query tenant_users table to avoid recursion
CREATE OR REPLACE FUNCTION is_tenant_owner(check_tenant_id UUID) RETURNS BOOLEAN AS $$
DECLARE
    jwt_user_id UUID;
    jwt_tenant_id UUID;
    jwt_role TEXT;
BEGIN
    jwt_user_id := get_jwt_user_id();
    jwt_tenant_id := get_jwt_tenant_id();
    jwt_role := get_jwt_role();
    
    -- If checking own tenant and role is owner, return true
    IF check_tenant_id = jwt_tenant_id AND jwt_role = 'owner' THEN
        RETURN TRUE;
    END IF;
    
    -- Otherwise, check via tenants table owner_user_id (if exists)
    -- This avoids querying tenant_users table
    RETURN EXISTS (
        SELECT 1 FROM tenants t
        WHERE t.id = check_tenant_id
          AND t.owner_user_id = jwt_user_id
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ==========================================
-- STEP 3: TENANT_USERS TABLE (NON-RECURSIVE)
-- ==========================================
-- CRITICAL: This table must NEVER query itself
-- Uses JWT role claim instead of querying tenant_users

CREATE POLICY tenant_users_select ON public.tenant_users
FOR SELECT
USING (
    user_id = get_jwt_user_id()
    OR tenant_id = get_jwt_tenant_id()
);

CREATE POLICY tenant_users_insert ON public.tenant_users
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() = 'owner'
);

CREATE POLICY tenant_users_update ON public.tenant_users
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() = 'owner'
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() = 'owner'
);

CREATE POLICY tenant_users_delete ON public.tenant_users
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() = 'owner'
);

-- ==========================================
-- STEP 4: TENANTS TABLE (SPECIAL RULES)
-- ==========================================
-- Users can read/update their own tenant
-- INSERT/DELETE blocked (system-only)

CREATE POLICY tenants_select ON public.tenants
FOR SELECT
USING (
    id = get_jwt_tenant_id()
    OR is_tenant_owner(id)
);

CREATE POLICY tenants_update ON public.tenants
FOR UPDATE
USING (
    id = get_jwt_tenant_id()
    OR is_tenant_owner(id)
)
WITH CHECK (
    id = get_jwt_tenant_id()
    OR is_tenant_owner(id)
);

CREATE POLICY tenants_no_insert ON public.tenants
FOR INSERT
WITH CHECK (false);

CREATE POLICY tenants_no_delete ON public.tenants
FOR DELETE
USING (false);

-- ==========================================
-- STEP 5: CLIENTS TABLE
-- ==========================================
CREATE POLICY clients_select ON public.clients
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY clients_insert ON public.clients
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY clients_update ON public.clients
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY clients_delete ON public.clients
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND is_tenant_owner(tenant_id)
);

-- ==========================================
-- STEP 6: PROJECTS TABLE
-- ==========================================
CREATE POLICY projects_select ON public.projects
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY projects_insert ON public.projects
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY projects_update ON public.projects
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY projects_delete ON public.projects
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND is_tenant_owner(tenant_id)
);

-- ==========================================
-- STEP 7: TASKS TABLE
-- ==========================================
CREATE POLICY tasks_select ON public.tasks
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY tasks_insert ON public.tasks
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY tasks_update ON public.tasks
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY tasks_delete ON public.tasks
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND (
        is_tenant_owner(tenant_id)
        OR user_id = get_jwt_user_id()
    )
);

-- ==========================================
-- STEP 8: TIME_ENTRIES TABLE
-- ==========================================
CREATE POLICY time_entries_select ON public.time_entries
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
    OR user_id = get_jwt_user_id()
);

CREATE POLICY time_entries_insert ON public.time_entries
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND user_id = get_jwt_user_id()
);

CREATE POLICY time_entries_update ON public.time_entries
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR is_tenant_owner(tenant_id)
    )
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR is_tenant_owner(tenant_id)
    )
);

CREATE POLICY time_entries_delete ON public.time_entries
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR is_tenant_owner(tenant_id)
    )
);

-- ==========================================
-- STEP 9: ECONOMICS TABLE
-- ==========================================
CREATE POLICY economics_select ON public.economics
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY economics_insert ON public.economics
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY economics_update ON public.economics
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY economics_delete ON public.economics
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND is_tenant_owner(tenant_id)
);

-- ==========================================
-- STEP 10: VENDORS TABLE
-- ==========================================
CREATE POLICY vendors_select ON public.vendors
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY vendors_insert ON public.vendors
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY vendors_update ON public.vendors
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY vendors_delete ON public.vendors
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND is_tenant_owner(tenant_id)
);

-- ==========================================
-- STEP 11: AUDIT_LOGS TABLE
-- ==========================================
CREATE POLICY audit_logs_select ON public.audit_logs
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
    AND is_tenant_owner(tenant_id)
);

CREATE POLICY audit_logs_insert ON public.audit_logs
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
);

CREATE POLICY audit_logs_no_update ON public.audit_logs
FOR UPDATE
USING (false);

CREATE POLICY audit_logs_no_delete ON public.audit_logs
FOR DELETE
USING (false);

-- ==========================================
-- STEP 12: VALIDATION QUERIES
-- ==========================================
-- Run these after migration to verify:
-- SELECT polname, tablename FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, polname;
-- SELECT current_setting('request.jwt.claims', true)::json;

-- ==========================================
-- DONE
-- ==========================================

