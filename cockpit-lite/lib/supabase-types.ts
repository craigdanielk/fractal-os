/**
 * Supabase Database Types
 * 
 * Generated from Supabase schema to match actual database structure
 */

export interface DBClient {
  id: string;
  tenant_id: string;
  name: string;
  priority?: string | null;
  notes?: string | null;
  contract_url?: string | null;
  billing_currency?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBProject {
  id: string;
  tenant_id: string;
  client_id?: string | null;
  project_name: string;
  description?: string | null;
  project_type?: string | null;
  priority?: string | null;
  status?: string | null;
  start_date?: string | null;
  target_end_date?: string | null;
  actual_end_date?: string | null;
  budget?: number | null;
  actual_cost?: number | null;
  health_score?: string | null;
  project_owner?: string | null;
  system_reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBTask {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  task_name: string;
  task_type?: string | null;
  assignee?: string | null;
  status?: string | null;
  review_stage?: string | null;
  priority?: string | null;
  due_date?: string | null;
  estimate_hours?: number | null;
  logged_hours?: number | null;
  notes?: string | null;
  parent_task_id?: string | null;
  variant?: string | null;
  billable_hours?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DBTimeEntry {
  id: string;
  tenant_id: string;
  task_id?: string | null;
  session_name?: string | null;
  session_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  duration_hours?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBEconomicsModel {
  id: string;
  tenant_id: string;
  base_rate?: number | null;
  direct_expenses?: number | null;
  margin_target?: number | null;
  overhead_percent?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DBVendor {
  id: string;
  tenant_id: string;
  name: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  services?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBTaskVendor {
  task_id: string;
  vendor_id: string;
}

// UI-friendly mapped types
export interface Client extends Omit<DBClient, 'tenant_id'> {
  projects?: Project[];
}

export interface Project extends Omit<DBProject, 'tenant_id' | 'client_id'> {
  client?: Client | null;
  tasks?: Task[];
}

export interface Task extends Omit<DBTask, 'tenant_id' | 'project_id' | 'parent_task_id'> {
  project?: Project | null;
  parent_task?: Task | null;
  subtasks?: Task[];
  time_entries?: DBTimeEntry[];
}

export interface TimeEntry extends Omit<DBTimeEntry, 'tenant_id' | 'task_id'> {
  task?: Task | null;
}

export interface EconomicsModel extends Omit<DBEconomicsModel, 'tenant_id'> {}

export interface Vendor extends Omit<DBVendor, 'tenant_id'> {}

