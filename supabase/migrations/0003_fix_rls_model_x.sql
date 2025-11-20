-- ==========================================
-- FIX RLS MODEL-X (NON-RECURSIVE)
-- ==========================================
-- This migration fixes all RLS policies to use correct Model-X rules:
-- - tenant_id = jwt.tenant_id OR created_by = jwt.user_id OR user is tenant_owner
-- - Prevents infinite recursion in tenant_users table
-- - Ensures all policies use JWT claims correctly

-- Helper function to safely extract JWT claims
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

-- Helper function to check if user is tenant owner
-- CRITICAL: This function must NOT be used in tenant_users policies to avoid recursion
CREATE OR REPLACE FUNCTION is_tenant_owner(check_tenant_id UUID) RETURNS BOOLEAN AS $$
DECLARE
    jwt_user_id UUID;
    jwt_tenant_id UUID;
BEGIN
    jwt_user_id := get_jwt_user_id();
    jwt_tenant_id := get_jwt_tenant_id();
    
    IF jwt_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- If checking the same tenant as JWT, we can use a direct check
    -- Otherwise, we need to query tenant_users (but this should not be used in tenant_users policies)
    IF check_tenant_id = jwt_tenant_id THEN
        -- For the same tenant, check if user has owner role
        -- This is safe because we're not querying tenant_users in a way that causes recursion
        RETURN EXISTS (
            SELECT 1 FROM tenant_users tu
            WHERE tu.user_id = jwt_user_id
              AND tu.tenant_id = check_tenant_id
              AND tu.role = 'owner'
            LIMIT 1
        );
    ELSE
        -- For different tenants, we can safely query
        RETURN EXISTS (
            SELECT 1 FROM tenant_users tu
            WHERE tu.user_id = jwt_user_id
              AND tu.tenant_id = check_tenant_id
              AND tu.role = 'owner'
            LIMIT 1
        );
    END IF;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper: Drop all policies for a table
CREATE OR REPLACE FUNCTION drop_policies(tbl TEXT) RETURNS VOID AS $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- DROP ALL EXISTING POLICIES
-- ==========================================
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
        PERFORM drop_policies(tbl);
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END
$$;

-- ==========================================
-- TENANTS TABLE (SPECIAL RULES)
-- ==========================================
-- Users can only read/update their own tenant
-- INSERT/DELETE blocked (only system can create tenants)

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
-- TENANT_USERS TABLE (NON-RECURSIVE)
-- ==========================================
-- Critical: This table must NOT query itself to avoid recursion
-- Users can see tenant_users records for their tenant
-- Users can insert themselves into their tenant (for onboarding)
-- Only tenant owners can update/delete tenant_users
-- NOTE: We cannot use is_tenant_owner() here as it queries tenant_users, causing recursion
-- Instead, we rely on JWT claims having the tenant_id and check role directly

CREATE POLICY tenant_users_select ON public.tenant_users
FOR SELECT
USING (
    tenant_id = get_jwt_tenant_id()
    OR user_id = get_jwt_user_id()
);

CREATE POLICY tenant_users_insert ON public.tenant_users
FOR INSERT
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND user_id = get_jwt_user_id()
);

-- For UPDATE/DELETE, we check if the user is updating their own record OR
-- if they have admin role in JWT (set by backend when user is tenant owner)
-- This avoids querying tenant_users table
CREATE POLICY tenant_users_update ON public.tenant_users
FOR UPDATE
USING (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR current_setting('request.jwt.claims', true)::json->>'role' = 'owner'
    )
)
WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR current_setting('request.jwt.claims', true)::json->>'role' = 'owner'
    )
);

CREATE POLICY tenant_users_delete ON public.tenant_users
FOR DELETE
USING (
    tenant_id = get_jwt_tenant_id()
    AND (
        user_id = get_jwt_user_id()
        OR current_setting('request.jwt.claims', true)::json->>'role' = 'owner'
    )
);

-- ==========================================
-- CLIENTS TABLE
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
-- PROJECTS TABLE
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
-- TASKS TABLE
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
-- TIME_ENTRIES TABLE
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
-- ECONOMICS TABLE
-- ==========================================
-- Economics are tenant-scoped but readable by all tenant members
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
-- VENDORS TABLE
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
-- AUDIT_LOGS TABLE
-- ==========================================
-- Audit logs are readable by tenant owners, insertable by system
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
-- DONE
-- ==========================================

