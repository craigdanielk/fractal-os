import { pgTable, text, uuid, timestamp, numeric, integer } from "drizzle-orm/pg-core";



/* ===========================================

   FRACTALOS CORE — SUPABASE DB (PHASE 1)

   Mirrors the 5 Notion DBs (Clients, Projects,

   Tasks, Time, Economics)

=========================================== */



// ---------------------

// CLIENTS

// ---------------------

export const clients = pgTable("clients", {

  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  type: text("type"),

  status: text("status"),

  region: text("region"),

  contactPerson: text("contact_person"),

  contactEmail: text("contact_email"),

  contactNumber: text("contact_number"),

  website: text("website"),

  accountManager: text("account_manager"),

  defaultRate: numeric("default_rate"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),

});



// ---------------------

// PROJECTS

// ---------------------

export const projects = pgTable("projects", {

  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  projectType: text("project_type"),

  priority: text("priority"),

  healthScore: text("health_score"),

  startDate: timestamp("start_date"),

  targetEndDate: timestamp("target_end_date"),

  actualEndDate: timestamp("actual_end_date"),

  budget: numeric("budget"),

  actualCost: numeric("actual_cost"),

  notes: text("notes"),

  successCriteria: text("success_criteria"),

  systemReference: text("system_reference"),

  progress: numeric("progress"),

  clientId: uuid("client_id").references(() => clients.id),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),

});



// ---------------------

// TASKS

// ---------------------

export const tasks = pgTable("tasks", {

  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  status: text("status"),

  dueDate: timestamp("due_date"),

  priority: text("priority"),

  assignee: text("assignee"),

  estimateHours: numeric("estimate_hours"),

  projectId: uuid("project_id").references(() => projects.id),

  parentTaskId: uuid("parent_task_id"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),

});



// ---------------------

// TIME ENTRIES

// ---------------------

export const timeEntries = pgTable("time_entries", {

  id: uuid("id").defaultRandom().primaryKey(),

  sessionName: text("session_name"),

  sessionDate: timestamp("session_date"),

  startTime: timestamp("start_time"),

  endTime: timestamp("end_time"),

  durationHours: numeric("duration_hours"),

  userEmail: text("user_email"),

  taskId: uuid("task_id").references(() => tasks.id),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),

});



// ---------------------

// ECONOMICS MODEL

// ---------------------

export const economics = pgTable("economics", {

  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  baseRate: numeric("base_rate"),

  directExpenses: numeric("direct_expenses"),

  marginTarget: numeric("margin_target"),

  overheadPercent: numeric("overhead_percent"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),

});
