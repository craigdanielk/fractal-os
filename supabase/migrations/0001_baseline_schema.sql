------------------------------------------------------------

-- FRACTALOS BASELINE SCHEMA (0001)

-- Creates all core tables required by the Cockpit + Kernel

-- Multi-tenant Model-X enforcement

------------------------------------------------------------



-------------------------

-- EXTENSIONS

-------------------------

create extension if not exists "uuid-ossp";

create extension if not exists "pgcrypto";



-------------------------

-- TENANTS

-------------------------

create table if not exists tenants (

    id uuid primary key default uuid_generate_v4(),

    name text not null,

    slug text unique not null,

    created_at timestamptz default now()

);



-------------------------

-- TENANT USERS

-------------------------

create table if not exists tenant_users (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    user_id uuid not null,

    role text not null default 'member', -- owner, admin, member

    created_at timestamptz default now()

);



create index if not exists tenant_users_tenant_idx on tenant_users(tenant_id);

create index if not exists tenant_users_user_idx on tenant_users(user_id);



-------------------------

-- CLIENTS

-------------------------

create table if not exists clients (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    name text not null,

    created_at timestamptz default now()

);



create index if not exists clients_tenant_idx on clients(tenant_id);



-------------------------

-- PROJECTS

-------------------------

create table if not exists projects (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    client_id uuid references clients(id) on delete set null,

    name text not null,

    description text,

    start_date date,

    target_end_date date,

    actual_end_date date,

    budget numeric,

    actual_cost numeric,

    status text,

    priority text,

    created_at timestamptz default now()

);



create index if not exists projects_tenant_idx on projects(tenant_id);

create index if not exists projects_client_idx on projects(client_id);



-------------------------

-- TASKS

-------------------------

create table if not exists tasks (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    project_id uuid references projects(id) on delete cascade,

    name text not null,

    description text,

    status text,

    priority text,

    start_date date,

    end_date date,

    created_at timestamptz default now()

);



create index if not exists tasks_tenant_idx on tasks(tenant_id);

create index if not exists tasks_project_idx on tasks(project_id);



-------------------------

-- TIME ENTRIES

-------------------------

create table if not exists time_entries (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    task_id uuid references tasks(id) on delete cascade,

    user_id uuid,

    session_name text,

    session_date date,

    start_time timestamptz,

    end_time timestamptz,

    duration_hours numeric,

    notes text,

    created_at timestamptz default now()

);



create index if not exists time_entries_tenant_idx on time_entries(tenant_id);

create index if not exists time_entries_task_idx on time_entries(task_id);



-------------------------

-- ECONOMICS

-------------------------

create table if not exists economics (

    id uuid primary key default uuid_generate_v4(),

    tenant_id uuid not null references tenants(id) on delete cascade,

    name text not null,

    base_rate numeric,

    direct_expenses numeric,

    margin_targets numeric,

    overhead_pct numeric,

    created_at timestamptz default now()

);



create index if not exists economics_tenant_idx on economics(tenant_id);



------------------------------------------------------------

-- RLS ENABLED

------------------------------------------------------------

alter table tenants enable row level security;

alter table tenant_users enable row level security;

alter table clients enable row level security;

alter table projects enable row level security;

alter table tasks enable row level security;

alter table time_entries enable row level security;

alter table economics enable row level security;



------------------------------------------------------------

-- RLS POLICIES (MODEL-X TENANTING)

------------------------------------------------------------



-------------------------

-- TENANTS: Only owner/admin may view

-------------------------

create policy "tenant_owner_read"

on tenants

for select

using (

  exists (

    select 1 from tenant_users

    where tenant_users.tenant_id = tenants.id

    and tenant_users.user_id = auth.uid()

    and tenant_users.role in ('owner', 'admin')

  )

);



-------------------------

-- TENANT USERS

-------------------------

create policy "tenant_users_read"

on tenant_users

for select using (

  tenant_id in (

    select tenant_id from tenant_users where user_id = auth.uid()

  )

);



-------------------------

-- ALL OTHER TABLES

-------------------------

create policy "tenant_isolation"

on clients

for all

using (tenant_id in (select tenant_id from tenant_users where user_id = auth.uid()));



create policy "tenant_isolation"

on projects

for all

using (tenant_id in (select tenant_id from tenant_users where user_id = auth.uid()));



create policy "tenant_isolation"

on tasks

for all

using (tenant_id in (select tenant_id from tenant_users where user_id = auth.uid()));



create policy "tenant_isolation"

on time_entries

for all

using (tenant_id in (select tenant_id from tenant_users where user_id = auth.uid()));



create policy "tenant_isolation"

on economics

for all

using (tenant_id in (select tenant_id from tenant_users where user_id = auth.uid()));



------------------------------------------------------------

-- END OF BASELINE

------------------------------------------------------------

