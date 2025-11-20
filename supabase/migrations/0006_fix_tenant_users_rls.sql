-- ==========================================
-- FIX tenant_users RLS (Non-recursive)
-- ==========================================

-- 1. Drop all existing tenant_users policies
DO $$

DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'tenant_users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenant_users;', pol.policyname);
    END LOOP;
END
$$;

-- 2. Enable RLS on tenant_users
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- 3. Add clean SELECT policy (tenant isolation)
CREATE POLICY "tenant_users_select"
ON public.tenant_users
FOR SELECT
USING (
    tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
);

-- 4. Add clean INSERT policy
CREATE POLICY "tenant_users_insert"
ON public.tenant_users
FOR INSERT
WITH CHECK (
    tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
);

-- 5. Add clean UPDATE policy
CREATE POLICY "tenant_users_update"
ON public.tenant_users
FOR UPDATE
USING (
    tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
)
WITH CHECK (
    tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
);

-- 6. Add clean DELETE policy
CREATE POLICY "tenant_users_delete"
ON public.tenant_users
FOR DELETE
USING (
    tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
);

-- ==========================================
-- RLS reset complete
-- ==========================================

