-- Tenants

create table if not exists tenants (

id uuid primary key default gen_random_uuid(),

name text not null,

type text not null check (type in ('root','agency','client')),

parent_id uuid references tenants(id) on delete cascade,

created_at timestamptz default now()

);



-- Users ↔ Tenants

create table if not exists tenant_users (

tenant_id uuid references tenants(id) on delete cascade,

user_id uuid not null,

role text not null check (role in ('root','agency_admin','client_admin','member')),

primary key(tenant_id, user_id)

);



-- Module Registry

create table if not exists module_registry (

id uuid primary key default gen_random_uuid(),

module_key text unique not null,

module_name text not null,

description text

);



-- Tenant Module Assignments

create table if not exists tenant_modules (

tenant_id uuid references tenants(id) on delete cascade,

module_id uuid references module_registry(id) on delete cascade,

inherited boolean default false,

primary key(tenant_id, module_id)

);



-- Tenant Settings

create table if not exists tenant_settings (

tenant_id uuid primary key references tenants(id) on delete cascade,

economics_model jsonb,

preferences jsonb

);



-- Hierarchy

create table if not exists tenant_hierarchy (

child_id uuid references tenants(id) on delete cascade,

parent_id uuid references tenants(id) on delete cascade,

primary key(child_id, parent_id)

);

