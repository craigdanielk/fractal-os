

/**
 * Economics Commands
 *
 * These commands expose deterministic, pure operations used by:
 *  - the Cockpit economics dashboard
 *  - the Economics Engine
 *  - Agents performing economics analysis
 *
 * Rules:
 *  - No business logic outside Kernel
 *  - No database writes (handled by services)
 *  - Functions must be idempotent
 */

import { EconomicsModel } from "../schemas/economics.schema";
import { TimeEntry, Project, Client } from "../schemas";
import { calculateLabourCost, calculateContribution } from "../utils/helpers";

export const economicsCommands = {
  /**
   * Compute labour cost for a batch of time entries.
   */
  computeLabourCost: (
    entries: TimeEntry[],
    model: EconomicsModel
  ): number => {
    return calculateLabourCost(entries, model);
  },

  /**
   * Compute full contribution for a project.
   */
  computeProjectContribution: (
    project: Project,
    entries: TimeEntry[],
    model: EconomicsModel
  ) => {
    const labourCost = calculateLabourCost(entries, model);

    return calculateContribution({
      project,
      labourCost,
      overheadCost: model.overheadCost || 0,
      directExpenses: model.directExpenses || 0
    });
  },

  /**
   * Compute client-level aggregated contribution.
   */
  computeClientContribution: (
    client: Client,
    projects: Project[],
    timeEntries: TimeEntry[],
    model: EconomicsModel
  ) => {
    const clientProjects = projects.filter((p) => p.clientId === client.id);
    const projectIds = clientProjects.map((p) => p.id);

    const entries = timeEntries.filter((e) =>
      projectIds.includes(e.projectId)
    );

    const labourCost = calculateLabourCost(entries, model);

    const revenue = clientProjects.reduce(
      (acc, p) => acc + (p.revenue || 0),
      0
    );

    return calculateContribution({
      project: null,
      labourCost,
      overheadCost: model.overheadCost || 0,
      directExpenses: model.directExpenses || 0,
      revenue
    });
  }
};