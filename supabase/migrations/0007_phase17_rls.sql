-- ============================================================
-- PHASE 17 — Model-X RLS Policies (Simplified Owner-Based)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- ===========================
-- Tenants Table
-- ===========================
DROP POLICY IF EXISTS "tenant select" ON tenants;
CREATE POLICY "tenant select"
ON tenants
FOR SELECT
USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "tenant modify" ON tenants;
CREATE POLICY "tenant modify"
ON tenants
FOR ALL
USING (owner_user_id = auth.uid());

-- ===========================
-- Projects
-- ===========================
DROP POLICY IF EXISTS "projects read" ON projects;
CREATE POLICY "projects read"
ON projects
FOR SELECT
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "projects write" ON projects;
CREATE POLICY "projects write"
ON projects
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()))
FOR UPDATE USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "projects delete" ON projects;
CREATE POLICY "projects delete"
ON projects
FOR DELETE
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

-- ===========================
-- Tasks
-- ===========================
DROP POLICY IF EXISTS "tasks read" ON tasks;
CREATE POLICY "tasks read"
ON tasks
FOR SELECT
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "tasks write" ON tasks;
CREATE POLICY "tasks write"
ON tasks
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()))
FOR UPDATE USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "tasks delete" ON tasks;
CREATE POLICY "tasks delete"
ON tasks
FOR DELETE
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

-- ===========================
-- Time Entries
-- ===========================
DROP POLICY IF EXISTS "time entries read" ON time_entries;
CREATE POLICY "time entries read"
ON time_entries
FOR SELECT
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "time entries write" ON time_entries;
CREATE POLICY "time entries write"
ON time_entries
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()))
FOR UPDATE USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "time entries delete" ON time_entries;
CREATE POLICY "time entries delete"
ON time_entries
FOR DELETE
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

-- ===========================
-- Vendors
-- ===========================
DROP POLICY IF EXISTS "vendors read" ON vendors;
CREATE POLICY "vendors read"
ON vendors
FOR SELECT
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "vendors write" ON vendors;
CREATE POLICY "vendors write"
ON vendors
FOR INSERT WITH CHECK (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()))
FOR UPDATE USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "vendors delete" ON vendors;
CREATE POLICY "vendors delete"
ON vendors
FOR DELETE
USING (tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid()));

-- ============================================================
-- END PHASE 17
-- ============================================================

