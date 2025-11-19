-- Enable RLS

alter table tenants enable row level security;

alter table clients enable row level security;

alter table projects enable row level security;

alter table tasks enable row level security;

alter table time_entries enable row level security;

alter table vendors enable row level security;

alter table economics_model enable row level security;



-- Public readable tenant registry (safe)

create policy "tenant_registry_public_read"

on tenants

for select

using (true);



-- Block all writes except service role

create policy "tenant_registry_write_block"

on tenants

for all

using (false)

with check (false);



-- Tenant-scoped read

create policy "tenant_read"

on clients

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_read_proj"

on projects

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_read_tasks"

on tasks

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_read_time"

on time_entries

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_read_vendors"

on vendors

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_read_economics"

on economics_model

for select

using (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



-- Tenant-scoped write

create policy "tenant_write_clients"

on clients

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_write_projects"

on projects

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_write_tasks"

on tasks

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_write_time"

on time_entries

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_write_vendors"

on vendors

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));



create policy "tenant_write_economics"

on economics_model

for insert, update

with check (tenant_id::text = current_setting('request.jwt.claims.tenant_id', true));

