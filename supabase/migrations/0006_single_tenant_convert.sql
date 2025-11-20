-- ==========================================
-- SINGLE-TENANT CONVERSION
-- ==========================================
-- Removes all multi-tenant infrastructure
-- Converts to single-tenant mode

-- ==========================================
-- STEP 1: DROP ALL TENANT TABLES
-- ==========================================

DROP TABLE IF EXISTS tenant_users CASCADE;
DROP TABLE IF EXISTS tenant_settings CASCADE;
DROP TABLE IF EXISTS tenant_modules CASCADE;
DROP TABLE IF EXISTS tenant_hierarchy CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- ==========================================
-- STEP 2: REMOVE tenant_id COLUMNS
-- ==========================================

ALTER TABLE clients DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE projects DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE tasks DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE time_entries DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE economics DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE vendors DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE audit_logs DROP COLUMN IF EXISTS tenant_id CASCADE;

-- ==========================================
-- STEP 3: DROP ALL EXISTING POLICIES
-- ==========================================

DO $$
DECLARE 
    tbl TEXT;
    pol RECORD;
    tables TEXT[] := ARRAY[
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
        FOR pol IN
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I CASCADE;', pol.policyname, tbl);
        END LOOP;
    END LOOP;
END
$$;

-- ==========================================
-- STEP 4: APPLY LIGHT RLS (ALLOW ALL)
-- ==========================================

-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON clients FOR SELECT USING (true);
CREATE POLICY "allow_write" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON clients FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON clients FOR DELETE USING (true);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON projects FOR SELECT USING (true);
CREATE POLICY "allow_write" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON projects FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON projects FOR DELETE USING (true);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON tasks FOR SELECT USING (true);
CREATE POLICY "allow_write" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON tasks FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON tasks FOR DELETE USING (true);

-- Time Entries
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON time_entries FOR SELECT USING (true);
CREATE POLICY "allow_write" ON time_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON time_entries FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON time_entries FOR DELETE USING (true);

-- Economics
ALTER TABLE economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON economics FOR SELECT USING (true);
CREATE POLICY "allow_write" ON economics FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON economics FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON economics FOR DELETE USING (true);

-- Vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON vendors FOR SELECT USING (true);
CREATE POLICY "allow_write" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON vendors FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON vendors FOR DELETE USING (true);

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "allow_write" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON audit_logs FOR UPDATE USING (true);
CREATE POLICY "allow_delete" ON audit_logs FOR DELETE USING (true);

-- ==========================================
-- DONE
-- ==========================================

