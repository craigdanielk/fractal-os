/**
 * Supabase Mapper
 * 
 * Maps Supabase database records to UI-friendly types with relations
 */

import type {
  DBClient,
  DBProject,
  DBTask,
  DBTimeEntry,
  DBEconomicsModel,
  DBVendor,
  Client,
  Project,
  Task,
  TimeEntry,
  EconomicsModel,
  Vendor,
} from "./supabase-types";

/**
 * Map a database client to UI client
 */
export function mapClient(db: DBClient, projects?: DBProject[]): Client {
  return {
    id: db.id,
    name: db.name,
    priority: db.priority,
    notes: db.notes,
    contract_url: db.contract_url,
    billing_currency: db.billing_currency,
    email: db.email,
    created_at: db.created_at,
    updated_at: db.updated_at,
    projects: projects?.map(mapProject) || [],
  };
}

/**
 * Map a database project to UI project
 */
export function mapProject(db: DBProject, client?: DBClient, tasks?: DBTask[]): Project {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    project_type: db.project_type,
    priority: db.priority,
    status: db.status,
    start_date: db.start_date,
    target_end_date: db.target_end_date,
    actual_end_date: db.actual_end_date,
    budget: db.budget ? Number(db.budget) : null,
    actual_cost: db.actual_cost ? Number(db.actual_cost) : null,
    health_score: db.health_score,
    project_owner: db.project_owner,
    system_reference: db.system_reference,
    created_at: db.created_at,
    updated_at: db.updated_at,
    client: client ? mapClient(client) : null,
    tasks: tasks?.map(mapTask) || [],
  };
}

/**
 * Map a database task to UI task
 */
export function mapTask(
  db: DBTask,
  project?: DBProject,
  parentTask?: DBTask,
  subtasks?: DBTask[],
  timeEntries?: DBTimeEntry[]
): Task {
  return {
    id: db.id,
    name: db.name,
    task_type: db.task_type,
    assignee: db.assignee,
    status: db.status,
    review_stage: db.review_stage,
    priority: db.priority,
    due_date: db.due_date,
    estimate_hours: db.estimate_hours ? Number(db.estimate_hours) : null,
    logged_hours: db.logged_hours ? Number(db.logged_hours) : null,
    notes: db.notes,
    variant: db.variant,
    billable_hours: db.billable_hours ? Number(db.billable_hours) : null,
    created_at: db.created_at,
    updated_at: db.updated_at,
    project: project ? mapProject(project) : null,
    parent_task: parentTask ? mapTask(parentTask) : null,
    subtasks: subtasks?.map(mapTask) || [],
    time_entries: timeEntries || [],
  };
}

/**
 * Map a database time entry to UI time entry
 */
export function mapTimeEntry(db: DBTimeEntry, task?: DBTask): TimeEntry {
  return {
    id: db.id,
    session_name: db.session_name,
    session_date: db.session_date,
    start_time: db.start_time,
    end_time: db.end_time,
    duration_hours: db.duration_hours ? Number(db.duration_hours) : null,
    notes: db.notes,
    created_at: db.created_at,
    updated_at: db.updated_at,
    task: task ? mapTask(task) : null,
  };
}

/**
 * Map a database economics model to UI economics model
 */
export function mapEconomicsModel(db: DBEconomicsModel): EconomicsModel {
  return {
    id: db.id,
    name: db.name || null,
    base_rate: db.base_rate ? Number(db.base_rate) : null,
    direct_expenses: db.direct_expenses ? Number(db.direct_expenses) : null,
    margin_targets: db.margin_targets ? Number(db.margin_targets) : null,
    overhead_pct: db.overhead_pct ? Number(db.overhead_pct) : null,
    created_at: db.created_at,
    updated_at: db.updated_at,
  };
}

/**
 * Map a database vendor to UI vendor
 */
export function mapVendor(db: DBVendor): Vendor {
  return {
    id: db.id,
    name: db.name,
    contact_name: db.contact_name,
    contact_email: db.contact_email,
    contact_phone: db.contact_phone,
    services: db.services,
    created_at: db.created_at,
    updated_at: db.updated_at,
  };
}

