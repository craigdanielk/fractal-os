/**
 * API Service Layer
 * 
 * Provides typed access to all data operations
 */

import {
  fetchTasks,
  fetchProjects,
  fetchClients,
  fetchTimeEntries,
  fetchEconomicsModel,
  createTimeEntry,
  createTask,
} from "./notion";
import type {
  Task,
  Project,
  Client,
  TimeEntry,
  EconomicsModel,
  EconomicsOverview,
} from "../lib/types";

// Calculate economics overview from time entries and projects
async function calculateEconomicsOverview(): Promise<EconomicsOverview> {
  const economicsModel = await fetchEconomicsModel().catch(() => []);
  const [timeEntries, projects] = await Promise.all([
    fetchTimeEntries(),
    fetchProjects(),
  ]);

  const hourlyRate =
    economicsModel.find((m) => m.hourlyRates?.default)?.hourlyRates?.default ??
    economicsModel[0]?.hourlyRates?.default ??
    100;
  const labourCost = timeEntries.reduce(
    (sum, entry) => sum + entry.hours * hourlyRate,
    0
  );
  const revenue = projects.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const overheadCost = 0;
  const directExpenses = 0;
  const totalCost = labourCost + overheadCost + directExpenses;
  const contribution = revenue - totalCost;
  const margin = revenue > 0 ? contribution / revenue : 0;

  return {
    revenue,
    labourCost,
    overheadCost,
    directExpenses,
    totalCost,
    contribution,
    margin,
  };
}

export const api = {
  // Read operations
  getTasks: fetchTasks,
  getProjects: fetchProjects,
  getClients: fetchClients,
  getTimeEntries: fetchTimeEntries,
  getEconomicsModel: fetchEconomicsModel,
  getEconomicsOverview: calculateEconomicsOverview,

  // Write operations
  logTime: createTimeEntry,
  createTask,

  // Convenience aliases matching original cockpit API
  tasks: fetchTasks,
  projects: fetchProjects,
  clients: fetchClients,
  timeEntries: fetchTimeEntries,
  economicsModel: fetchEconomicsModel,
};

// Default export for backward compatibility
export default api;

