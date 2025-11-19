CREATE TYPE status_enum AS ENUM ('not_started', 'planning', 'in_progress', 'in_review', 'completed', 'cancelled');

CREATE TYPE priority_enum AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TYPE project_type_enum AS ENUM ('client_work', 'internal', 'research', 'marketing', 'operations', 'strategic');

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  priority TEXT,
  notes TEXT,
  contract_url TEXT,
  billing_currency TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  priority TEXT,
  status TEXT,
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  budget NUMERIC,
  actual_cost NUMERIC,
  health_score TEXT,
  project_owner TEXT,
  system_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_type TEXT,
  assignee TEXT,
  status TEXT,
  review_stage TEXT,
  priority TEXT,
  due_date DATE,
  estimate_hours NUMERIC,
  logged_hours NUMERIC,
  notes TEXT,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  variant TEXT,
  billable_hours NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  session_name TEXT,
  session_date DATE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_hours NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE economics_model (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_rate NUMERIC,
  direct_expenses NUMERIC,
  margin_target NUMERIC,
  overhead_percent NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  services TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE task_vendors (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, vendor_id)
);

CREATE INDEX idx_projects_client_id ON projects(client_id);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);

CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);

CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);

CREATE INDEX idx_task_vendors_task_id ON task_vendors(task_id);

CREATE INDEX idx_task_vendors_vendor_id ON task_vendors(vendor_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_economics_model_updated_at BEFORE UPDATE ON economics_model
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION calculate_duration_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL THEN
    NEW.duration_hours = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_time_entry_duration BEFORE INSERT OR UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_duration_hours();

INSERT INTO economics_model (base_rate, direct_expenses, margin_target, overhead_percent) VALUES (0, 0, 0, 0);

