-- ============================================================
-- PHASE 18 — Identity Graph + Tenant Membership Model
-- ============================================================

-- Users (reference actual Supabase auth users)
CREATE TABLE IF NOT EXISTS identity_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_identity_users_auth_user_id ON identity_users(auth_user_id);

-- Tenant Membership: maps users ↔ tenants with roles
CREATE TABLE IF NOT EXISTS tenant_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES identity_users (id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner','admin','manager','viewer')) NOT NULL DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id ON tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id ON tenant_members(user_id);

-- Sub-tenant Linking (Model-X: clients who also have clients)
CREATE TABLE IF NOT EXISTS tenant_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_tenant uuid NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  child_tenant uuid NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  link_type text CHECK (link_type IN ('client','agency','department')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (parent_tenant, child_tenant)
);

CREATE INDEX IF NOT EXISTS idx_tenant_links_parent ON tenant_links(parent_tenant);
CREATE INDEX IF NOT EXISTS idx_tenant_links_child ON tenant_links(child_tenant);

-- ============================================================
-- RLS for identity tables
-- ============================================================

ALTER TABLE identity_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_links ENABLE ROW LEVEL SECURITY;

-- identity_users
DROP POLICY IF EXISTS "identity self-select" ON identity_users;
CREATE POLICY "identity self-select"
ON identity_users FOR SELECT
USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "identity self-insert" ON identity_users;
CREATE POLICY "identity self-insert"
ON identity_users FOR INSERT
WITH CHECK (auth_user_id = auth.uid());

-- tenant_members
DROP POLICY IF EXISTS "tenant_members read" ON tenant_members;
CREATE POLICY "tenant_members read"
ON tenant_members FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_members tm
    JOIN identity_users iu ON tm.user_id = iu.id
    WHERE iu.auth_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_members write" ON tenant_members;
CREATE POLICY "tenant_members write"
ON tenant_members FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_members update" ON tenant_members;
CREATE POLICY "tenant_members update"
ON tenant_members FOR UPDATE
USING (
  tenant_id IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_members delete" ON tenant_members;
CREATE POLICY "tenant_members delete"
ON tenant_members FOR DELETE
USING (
  tenant_id IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

-- tenant_links
DROP POLICY IF EXISTS "tenant_links read" ON tenant_links;
CREATE POLICY "tenant_links read"
ON tenant_links FOR SELECT
USING (
  parent_tenant IN (
    SELECT tenant_id FROM tenant_members tm
    JOIN identity_users iu ON tm.user_id = iu.id
    WHERE iu.auth_user_id = auth.uid()
  )
  OR child_tenant IN (
    SELECT tenant_id FROM tenant_members tm
    JOIN identity_users iu ON tm.user_id = iu.id
    WHERE iu.auth_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_links write" ON tenant_links;
CREATE POLICY "tenant_links write"
ON tenant_links FOR INSERT
WITH CHECK (
  parent_tenant IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_links update" ON tenant_links;
CREATE POLICY "tenant_links update"
ON tenant_links FOR UPDATE
USING (
  parent_tenant IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "tenant_links delete" ON tenant_links;
CREATE POLICY "tenant_links delete"
ON tenant_links FOR DELETE
USING (
  parent_tenant IN (
    SELECT id FROM tenants WHERE owner_user_id = auth.uid()
  )
);

-- ============================================================
-- END PHASE 18
-- ============================================================

