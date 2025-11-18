/ **
 * Time Entry Schema
 *
 * Tracks time spent by the operator or team members on tasks and projects.
 * Forms the backbone of the Economics Engine.
 *
 * Used by:
 *  - Task & Project time aggregation
 *  - Economics Engine (labour cost calculations)
 *  - Cockpit weekly overview
 *  - Agents (context + analysis)
 */

export interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  userId?: string;
  hours: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const timeEntrySchema = {
  table: "time_entries",
  primaryKey: "id",
  fields: {
    id: "string",
    taskId: "string",
    projectId: "string",
    userId: "string?",
    hours: "number",
    notes: "string?",
    createdAt: "string",
    updatedAt: "string"
  }
};

export function createTimeEntry(data: Partial<TimeEntry>): TimeEntry {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    taskId: data.taskId || "",
    projectId: data.projectId || "",
    userId: data.userId || "",
    hours: data.hours ?? 0,
    notes: data.notes || "",
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}
