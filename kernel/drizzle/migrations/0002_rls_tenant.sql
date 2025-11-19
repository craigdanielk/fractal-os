alter table clients add column if not exists tenant_id uuid not null;

alter table projects add column if not exists tenant_id uuid not null;

alter table tasks add column if not exists tenant_id uuid not null;

alter table time_entries add column if not exists tenant_id uuid not null;

alter table clients enable row level security;

alter table projects enable row level security;

alter table tasks enable row level security;

alter table time_entries enable row level security;

create policy "tenant_read" on clients

  for select using (tenant_id = auth.uid());

create policy "tenant_insert" on clients

  for insert with check (tenant_id = auth.uid());

