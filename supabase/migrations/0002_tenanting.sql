-- Tenant Registry

create table if not exists tenants (

id uuid primary key default gen_random_uuid(),

slug text unique not null,

name text not null,

created_at timestamptz default now()

);



-- Clients

alter table clients add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Projects

alter table projects add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Tasks

alter table tasks add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Time Entries

alter table time_entries add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Vendors

alter table vendors add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Economics Model

alter table economics_model add column if not exists tenant_id uuid not null default '00000000-0000-0000-0000-000000000000' references tenants(id);



-- Policies (read only tenant)

alter publication supabase_realtime add table clients, projects, tasks, time_entries, vendors, economics_model;

