/****
 * Task Schema
 *
 * Defines the structure of a Task in FractalOS.
 * Used by:
 *  - Cockpit task views
 *  - Kernel commands
 *  - Economics engine (via time aggregation)
 *  - Agents performing typed operations
 */

export interface Task {
  id: string;
  name: string;
  projectId: string;
  description?: string;
  status: "open" | "in_progress" | "blocked" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const taskSchema = {
  table: "tasks",
  primaryKey: "id",
  fields: {
    id: "string",
    name: "string",
    projectId: "string",
    description: "string?",
    status: "string",
    createdAt: "string",
    updatedAt: "string"
  }
};

export function createTask(data: Partial<Task>): Task {
  const now = new Date().toISOString();
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || "Untitled Task",
    projectId: data.projectId || "",
    description: data.description || "",
    status: data.status || "open",
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}