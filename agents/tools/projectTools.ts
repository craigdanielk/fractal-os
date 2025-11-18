

/**
 * Project Tools
 *
 * Lightweight helper utilities used by agents when operating
 * on project data. These tools never contain business logic —
 * they only prepare, validate, and transform payloads for use
 * with Kernel project commands.
 */

import type { Project } from "../../kernel/schemas";
import { validateString, validateId } from "../../kernel/utils/validation";

/**
 * Prepare a new project payload for Kernel consumption.
 */
export function prepareNewProject(data: Partial<Project>) {
  return {
    name: validateString(data.name, "Project.name"),
    clientId: validateId(data.clientId, "Project.clientId"),
    revenue: data.revenue ?? 0,
    createdAt: new Date().toISOString()
  };
}

/**
 * Prepare an update payload for an existing project.
 */
export function prepareProjectUpdate(project: Project, updates: Partial<Project>) {
  return {
    ...project,
    ...updates,
    name: updates.name ? validateString(updates.name, "Project.name") : project.name,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Simple filter for locating a project by ID.
 * This avoids agents guessing or inventing IDs.
 */
export function findProjectById(projects: Project[], id: string): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}