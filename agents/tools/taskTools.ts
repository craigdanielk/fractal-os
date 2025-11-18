/**
 * Task Tools
 *
 * Provides helper utilities for agent operations involving tasks.
 * No business logic is allowed — only payload preparation,
 * validation, and safe lookups. All execution flows through
 * Kernel task commands.
 */

import type { Task } from "../../kernel/schemas";
import { validateString, validateId } from "../../kernel/utils/validation";

/**
 * Prepare a new task payload for Kernel consumption.
 */
export function prepareNewTask(data: Partial<Task>) {
  return {
    title: validateString(data.title, "Task.title"),
    projectId: validateId(data.projectId, "Task.projectId"),
    status: data.status ?? "todo",
    createdAt: new Date().toISOString()
  };
}

/**
 * Prepare an update payload for an existing task.
 */
export function prepareTaskUpdate(task: Task, updates: Partial<Task>) {
  return {
    ...task,
    ...updates,
    title: updates.title ? validateString(updates.title, "Task.title") : task.title,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Safely locate a task by ID.
 */
export function findTaskById(tasks: Task[], id: string): Task | null {
  return tasks.find((t) => t.id === id) ?? null;
}
