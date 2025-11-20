-- ==========================================
-- GLOBAL RLS RESET (MULTI-TENANT SAFE)
-- ==========================================

-- Helper: drops all policies for a table
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

-- List of tables to reset
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
        'vendors'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        PERFORM drop_policies(tbl);
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END
$$;

-- ==========================================
-- REBUILD CLEAN RLS
-- ==========================================

-- For every table, enforce tenant isolation
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
        'vendors'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP

        -- SELECT
        EXECUTE format($f$
            CREATE POLICY %I ON public.%I
            FOR SELECT
            USING (
                tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
            );
        $f$, tbl || '_select', tbl);

        -- INSERT
        EXECUTE format($f$
            CREATE POLICY %I ON public.%I
            FOR INSERT
            WITH CHECK (
                tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
            );
        $f$, tbl || '_insert', tbl);

        -- UPDATE
        EXECUTE format($f$
            CREATE POLICY %I ON public.%I
            FOR UPDATE
            USING (
                tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
            )
            WITH CHECK (
                tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
            );
        $f$, tbl || '_update', tbl);

        -- DELETE
        EXECUTE format($f$
            CREATE POLICY %I ON public.%I
            FOR DELETE
            USING (
                tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'
            );
        $f$, tbl || '_delete', tbl);

    END LOOP;
END
$$;

-- ==========================================
-- DONE
-- ==========================================

