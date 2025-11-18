

/**
 * Task Commands
 *
 * Deterministic, typed operations for:
 *  - task creation
 *  - task updates
 *  - task completion
 *  - task time aggregation
 *
 * These functions never write to the database directly.
 * They only construct validated objects or computed values.
 */

import { Task } from "../schemas/task.schema";
import { TimeEntry } from "../schemas/time_entry.schema";

export const taskCommands = {
  /**
   * Create a new task.
   *
   * Does NOT persist to DB — only constructs the object.
   */
  createTask: (data: Partial<Task>): Task => {
    if (!data.name) throw new Error("Task creation failed: missing 'name'.");
    if (!data.projectId)
      throw new Error("Task creation failed: missing 'projectId'.");

    return {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      projectId: data.projectId,
      description: data.description || "",
      status: data.status || "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Update task fields in a controlled manner.
   */
  updateTask: (task: Task, updates: Partial<Task>): Task => {
    return {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Mark a task as completed.
   */
  completeTask: (task: Task): Task => {
    return {
      ...task,
      status: "completed",
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Compute total hours logged for a task.
   */
  computeTaskHours: (entries: TimeEntry[]): number => {
    return entries.reduce((sum, e) => sum + (e.hours || 0), 0);
  }
};