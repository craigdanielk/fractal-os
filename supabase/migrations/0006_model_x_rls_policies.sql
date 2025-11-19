-- Phase 15: Model-X RLS Policies
-- ===============================

-- Drop existing policies
drop policy if exists "tenant_registry_public_read" on tenants;
drop policy if exists "tenant_registry_write_block" on tenants;
drop policy if exists "tenant_read" on clients;
drop policy if exists "tenant_read_proj" on projects;
drop policy if exists "tenant_read_tasks" on tasks;
drop policy if exists "tenant_read_time" on time_entries;
drop policy if exists "tenant_read_vendors" on vendors;
drop policy if exists "tenant_read_economics" on economics_model;
drop policy if exists "tenant_write_clients" on clients;
drop policy if exists "tenant_write_projects" on projects;
drop policy if exists "tenant_write_tasks" on tasks;
drop policy if exists "tenant_write_time" on time_entries;
drop policy if exists "tenant_write_vendors" on vendors;
drop policy if exists "tenant_write_economics" on economics_model;

-- TENANTS TABLE POLICIES
-- Admin: can read all tenants
create policy "tenants_admin_read" on tenants
  for select
  using (
    nullif(current_setting('request.jwt.claims.role', true), '') = 'admin'
  );

-- Agency: can read their tenant + sub-tenants
create policy "tenants_agency_read" on tenants
  for select
  using (
    nullif(current_setting('request.jwt.claims.role', true), '') = 'agency'
    and (
      id = nullif(current_setting('request.jwt.claims.tenant_id', true), '')::uuid
      or parent_id = nullif(current_setting('request.jwt.claims.tenant_id', true), '')::uuid
      or id in (
        select id from tenants 
        where parent_id = nullif(current_setting('request.jwt.claims.tenant_id', true), '')::uuid
      )
    )
  );

-- Client: can read only their tenant
create policy "tenants_client_read" on tenants
  for select
  using (
    nullif(current_setting('request.jwt.claims.role', true), '') = 'client'
    and id = nullif(current_setting('request.jwt.claims.tenant_id', true), '')::uuid
  );

-- CLIENTS TABLE POLICIES
create policy "clients_read" on clients
  for select
  using (can_access_tenant(tenant_id));

create policy "clients_write" on clients
  for insert, update
  with check (can_access_tenant(tenant_id));

create policy "clients_delete" on clients
  for delete
  using (can_access_tenant(tenant_id));

-- PROJECTS TABLE POLICIES
create policy "projects_read" on projects
  for select
  using (can_access_tenant(tenant_id));

create policy "projects_write" on projects
  for insert, update
  with check (can_access_tenant(tenant_id));

create policy "projects_delete" on projects
  for delete
  using (can_access_tenant(tenant_id));

-- TASKS TABLE POLICIES
create policy "tasks_read" on tasks
  for select
  using (can_access_tenant(tenant_id));

create policy "tasks_write" on tasks
  for insert, update
  with check (can_access_tenant(tenant_id));

create policy "tasks_delete" on tasks
  for delete
  using (can_access_tenant(tenant_id));

-- TIME_ENTRIES TABLE POLICIES
create policy "time_entries_read" on time_entries
  for select
  using (can_access_tenant(tenant_id));

create policy "time_entries_write" on time_entries
  for insert, update
  with check (can_access_tenant(tenant_id));

create policy "time_entries_delete" on time_entries
  for delete
  using (can_access_tenant(tenant_id));

-- VENDORS TABLE POLICIES
create policy "vendors_read" on vendors
  for select
  using (can_access_tenant(tenant_id));

create policy "vendors_write" on vendors
  for insert, update
  with check (can_access_tenant(tenant_id));

create policy "vendors_delete" on vendors
  for delete
  using (can_access_tenant(tenant_id));

-- ECONOMICS_MODEL TABLE POLICIES
-- Always visible (no tenant restriction for economics)
create policy "economics_read" on economics_model
  for select
  using (true);

create policy "economics_write" on economics_model
  for insert, update
  with check (
    nullif(current_setting('request.jwt.claims.role', true), '') in ('admin', 'agency')
  );

create policy "economics_delete" on economics_model
  for delete
  using (
    nullif(current_setting('request.jwt.claims.role', true), '') in ('admin', 'agency')
  );

