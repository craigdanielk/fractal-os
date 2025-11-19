/**
 * API Service Layer
 * 
 * Provides typed access to all data operations
 */

import { getTasks } from "./tasks";
import { getProjects } from "./projects";
import { getSessions } from "./time";
import { getEconomics } from "./economics";
import { createTimeEntry, createTask } from "./notion";
import type {
  Task,
  Project,
  Client,
  TimeEntry,
  EconomicsModel,
  EconomicsOverview,
} from "@/lib/types";



export const api = {
  // Read operations
  getTasks,
  getProjects,
  getSessions,
  getEconomics,

  // Write operations
  logTime: createTimeEntry,
  createTask,

  // Convenience aliases
  tasks: getTasks,
  projects: getProjects,
  sessions: getSessions,
  economics: getEconomics,
};

// Default export for backward compatibility
export default api;

