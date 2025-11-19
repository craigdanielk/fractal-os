-- Phase 10: RLS Policies Scaffolding
-- Enable Row Level Security on all core tables

-- Enable RLS
alter table clients enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table time_entries enable row level security;

-- Clients see only their own rows
create policy "clients_self" on clients
  for select using ( auth.uid() = owner_id );

-- Projects belong to a client
create policy "projects_by_client" on projects
  for select using (
    auth.uid() = owner_id OR client_id IN (
      select id from clients where owner_id = auth.uid()
    )
  );

-- Tasks connected to projects
create policy "tasks_by_project" on tasks
  for select using (
    project_id IN (
      select id from projects where owner_id = auth.uid()
    )
  );

-- Time entries under tasks
create policy "time_by_task" on time_entries
  for select using (
    task_id IN (
      select id from tasks where project_id IN (
        select id from projects where owner_id = auth.uid()
      )
    )
  );

