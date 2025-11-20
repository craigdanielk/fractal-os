/**
 * Supabase Database Types
 * 
 * Generated from Supabase schema to match actual database structure
 */

export interface DBClient {
  id: string;
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
  client_id?: string | null;
  name: string;
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
  project_id?: string | null;
  name: string;
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

export interface DBEconomics {
  id: string;
  name?: string | null;
  base_rate?: number | null;
  direct_expenses?: number | null;
  margin_targets?: number | null;
  overhead_pct?: number | null;
  created_at: string;
  updated_at: string;
}

// Legacy alias for backward compatibility
export type DBEconomicsModel = DBEconomics;

export interface DBVendor {
  id: string;
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
  // Legacy field names for backward compatibility (will be removed)
  task_name?: string;
  task_type?: string | null;
}

export interface TimeEntry extends Omit<DBTimeEntry, 'tenant_id' | 'task_id'> {
  task?: Task | null;
}

export interface Economics extends Omit<DBEconomics, 'tenant_id'> {}

// Legacy alias for backward compatibility
export type EconomicsModel = Economics;

export interface Vendor extends Omit<DBVendor, 'tenant_id'> {}

