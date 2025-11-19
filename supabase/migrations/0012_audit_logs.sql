-- Audit Logs Table
-- Stores audit trail for all system events

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  payload jsonb default '{}',
  ts timestamptz default now(),
  user_id uuid references auth.users(id),
  tenant_id uuid,
  created_at timestamptz default now()
);

-- Index for querying by event type
create index if not exists idx_audit_logs_event on audit_logs(event);

-- Index for querying by timestamp
create index if not exists idx_audit_logs_ts on audit_logs(ts desc);

-- Index for querying by tenant
create index if not exists idx_audit_logs_tenant on audit_logs(tenant_id);

-- Index for querying by user
create index if not exists idx_audit_logs_user on audit_logs(user_id);

-- Enable RLS
alter table audit_logs enable row level security;

-- Users can only see their own audit logs or logs from their tenant
create policy "audit_logs_tenant_access" on audit_logs
  for select using (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

-- Only service role can insert audit logs (via backend)
-- Regular users cannot insert directly
create policy "audit_logs_insert_service" on audit_logs
  for insert with check (false);

