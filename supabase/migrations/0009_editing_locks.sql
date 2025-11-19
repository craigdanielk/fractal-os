-- ============================================================
-- PHASE 20 — Editing Locks Table
-- ============================================================

CREATE TABLE IF NOT EXISTS editing_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  record_type text NOT NULL CHECK (record_type IN ('task', 'project', 'economics', 'time')),
  record_id uuid NOT NULL,
  locked_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  locked_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 seconds'),
  UNIQUE (tenant_id, record_type, record_id)
);

CREATE INDEX IF NOT EXISTS idx_editing_locks_tenant_record ON editing_locks(tenant_id, record_type, record_id);
CREATE INDEX IF NOT EXISTS idx_editing_locks_locked_by ON editing_locks(locked_by);
CREATE INDEX IF NOT EXISTS idx_editing_locks_expires_at ON editing_locks(expires_at);

-- Auto-cleanup expired locks
CREATE OR REPLACE FUNCTION cleanup_expired_locks()
RETURNS void AS $$
BEGIN
  DELETE FROM editing_locks WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE editing_locks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "editing_locks read" ON editing_locks;
CREATE POLICY "editing_locks read"
ON editing_locks FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members tm
    JOIN identity_users iu ON tm.user_id = iu.id
    WHERE iu.auth_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "editing_locks write" ON editing_locks;
CREATE POLICY "editing_locks write"
ON editing_locks FOR INSERT
WITH CHECK (
  locked_by = auth.uid()
  AND tenant_id IN (
    SELECT tenant_id FROM tenant_members tm
    JOIN identity_users iu ON tm.user_id = iu.id
    WHERE iu.auth_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "editing_locks update" ON editing_locks;
CREATE POLICY "editing_locks update"
ON editing_locks FOR UPDATE
USING (locked_by = auth.uid());

DROP POLICY IF EXISTS "editing_locks delete" ON editing_locks;
CREATE POLICY "editing_locks delete"
ON editing_locks FOR DELETE
USING (locked_by = auth.uid());

