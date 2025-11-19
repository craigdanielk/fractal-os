-- Phase 15: Model-X Secure Multi-Tenant Boundary Layer
-- ========================================================

-- 1. Update tenants table with owner and parent hierarchy
alter table tenants 
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null,
  add column if not exists parent_id uuid references tenants(id) on delete cascade;

-- Create indexes for tenant hierarchy queries
create index if not exists idx_tenants_parent on tenants(parent_id);
create index if not exists idx_tenants_owner on tenants(owner_user_id);

-- 2. Add parent_tenant_id to clients table (for client-has-clients)
alter table clients 
  add column if not exists parent_tenant_id uuid references tenants(id) on delete set null;

create index if not exists idx_clients_parent_tenant on clients(parent_tenant_id);

-- 3. Ensure auth.users has tenant_id and role columns (from Phase 11)
alter table auth.users 
  add column if not exists tenant_id uuid references tenants(id) on delete set null,
  add column if not exists role text default 'client' check (role in ('admin', 'agency', 'client'));

create index if not exists idx_users_tenant on auth.users(tenant_id);

-- 4. Create helper function to get accessible tenant IDs (recursive)
create or replace function get_accessible_tenant_ids(user_tenant_id uuid, user_role text)
returns table(tenant_id uuid) as $$
begin
  -- Admin can access all tenants
  if user_role = 'admin' then
    return query select id from tenants;
    return;
  end if;
  
  -- Agency can access their tenant + all sub-tenants
  if user_role = 'agency' then
    return query
      with recursive tenant_tree as (
        -- Start with user's tenant
        select id, parent_id from tenants where id = user_tenant_id
        union all
        -- Recursively get all children
        select t.id, t.parent_id 
        from tenants t
        inner join tenant_tree tt on t.parent_id = tt.id
      )
      select id from tenant_tree;
    return;
  end if;
  
  -- Client can only access their own tenant
  if user_role = 'client' then
    return query select user_tenant_id;
    return;
  end if;
  
  -- Default: no access
  return;
end;
$$ language plpgsql security definer;

-- 5. Create function to check if user can access a tenant
create or replace function can_access_tenant(check_tenant_id uuid)
returns boolean as $$
declare
  user_tenant_id uuid;
  user_role text;
begin
  -- Get user's tenant and role from JWT
  user_tenant_id := nullif(current_setting('request.jwt.claims.tenant_id', true), '')::uuid;
  user_role := nullif(current_setting('request.jwt.claims.role', true), '');
  
  if user_tenant_id is null or user_role is null then
    return false;
  end if;
  
  -- Admin can access all
  if user_role = 'admin' then
    return true;
  end if;
  
  -- Check if tenant is accessible
  return exists (
    select 1 from get_accessible_tenant_ids(user_tenant_id, user_role) 
    where tenant_id = check_tenant_id
  );
end;
$$ language plpgsql security definer;

