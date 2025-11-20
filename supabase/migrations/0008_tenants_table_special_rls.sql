-- =============================
-- TENANTS TABLE SPECIAL RLS FIX
-- =============================

-- Remove existing policies
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
      AND tablename = 'tenants'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenants;', pol.policyname);
  END LOOP;
END
$$;

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read their tenant row
CREATE POLICY tenants_select ON public.tenants
FOR SELECT
USING (
  id = (current_setting('request.jwt.claims', true)::json->>'tenant_id')
);

-- Allow update ONLY if tenant matches
CREATE POLICY tenants_update ON public.tenants
FOR UPDATE
USING (
  id = (current_setting('request.jwt.claims', true)::json->>'tenant_id')
)
WITH CHECK (
  id = (current_setting('request.jwt.claims', true)::json->>'tenant_id')
);

-- INSERT and DELETE should be blocked for tenants table
CREATE POLICY tenants_no_insert ON public.tenants
FOR INSERT
WITH CHECK (false);

CREATE POLICY tenants_no_delete ON public.tenants
FOR DELETE
USING (false);

