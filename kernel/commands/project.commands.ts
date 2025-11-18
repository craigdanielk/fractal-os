

/**
 * Project Commands
 *
 * Deterministic, typed operations related to:
 *  - project creation
 *  - project updates
 *  - project state transitions
 *  - project economics preparation
 *
 * No database writes occur here. These functions produce
 * validated, structured objects that Cockpit or services
 * can store through Kernel APIs.
 */

import { Project } from "../schemas/project.schema";
import { TimeEntry } from "../schemas/time_entry.schema";
import { EconomicsModel } from "../schemas/economics.schema";
import { calculateLabourCost } from "../utils/helpers";

export const projectCommands = {
  /**
   * Create a new project object.
   *
   * Does NOT persist. Only constructs a validated object.
   */
  createProject: (data: Partial<Project>): Project => {
    if (!data.name) throw new Error("Project creation failed: missing 'name'.");
    if (!data.clientId)
      throw new Error("Project creation failed: missing 'clientId'.");

    return {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      clientId: data.clientId,
      description: data.description || "",
      revenue: data.revenue || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || "active"
    };
  },

  /**
   * Update any project field in a controlled manner.
   */
  updateProject: (project: Project, updates: Partial<Project>): Project => {
    return {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Compute labour cost for a project using provided time entries.
   */
  computeProjectLabourCost: (
    entries: TimeEntry[],
    model: EconomicsModel
  ): number => {
    return calculateLabourCost(entries, model);
  },

  /**
   * Transition project status through allowed states.
   */
  transitionStatus: (
    project: Project,
    newStatus: Project["status"]
  ): Project => {
    const allowed = ["active", "paused", "completed", "archived"];

    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid project status: ${newStatus}`);
    }

    return {
      ...project,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
  }
};