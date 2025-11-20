-- ============================================
-- SCHEMA ALIGNMENT MIGRATION (0002)
-- Fixes naming inconsistencies and adds missing columns/tables
-- ============================================

-- ECONOMICS
ALTER TABLE economics RENAME COLUMN margin_target TO margin_targets;
ALTER TABLE economics RENAME COLUMN overhead_percent TO overhead_pct;
ALTER TABLE economics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- PROJECTS
ALTER TABLE projects RENAME COLUMN project_name TO name;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- TASKS
ALTER TABLE tasks RENAME COLUMN task_name TO name;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- TIME ENTRIES
ALTER TABLE time_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- CLIENTS
ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- VENDORS (CREATE IF NOT EXISTING)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendors_tenant_idx ON vendors(tenant_id);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_tenant_idx ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON audit_logs(user_id);

-- IDENTITY USERS
CREATE TABLE IF NOT EXISTS identity_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors
CREATE POLICY "vendors_tenant_isolation"
ON vendors
FOR ALL
USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

-- RLS Policies for audit_logs (admin/owner only)
CREATE POLICY "audit_logs_read_admin"
ON audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_users.tenant_id = audit_logs.tenant_id
    AND tenant_users.user_id = auth.uid()
    AND tenant_users.role IN ('owner', 'admin')
  )
);

CREATE POLICY "audit_logs_insert_service"
ON audit_logs
FOR INSERT
WITH CHECK (true);

