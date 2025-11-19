-- Enable RLS

alter table tenants enable row level security;

alter table tenant_users enable row level security;

alter table tenant_modules enable row level security;

alter table tenant_settings enable row level security;



-- Session Tenant

create or replace function current_tenant()

returns uuid as $$

select nullif(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::uuid;

$$ language sql stable;



-- Tenants visible only if:

-- 1) user is root OR

-- 2) user belongs to that tenant OR

-- 3) user belongs to parent tenant (agency → clients)



create policy "tenant access"

on tenants

for select using (

(current_tenant() = id)

or (id in (select child_id from tenant_hierarchy where parent_id = current_tenant()))

or (exists (select 1 from tenant_users tu where tu.tenant_id = id and tu.user_id = auth.uid()))

);



-- Tenant Users

create policy "tenant-user access"

on tenant_users

for select using (tenant_id = current_tenant());



-- Tenant Modules

create policy "tenant-module read"

on tenant_modules

for select using (tenant_id = current_tenant());

