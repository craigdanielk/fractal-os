/**
 * API Service Layer
 * 
 * Provides typed access to all data operations
 * Now uses Supabase via Data provider
 */

import { Data } from "@/lib/data";
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
  getTasks: () => Data.tasks.list(),
  getProjects: () => Data.projects.list(),
  getSessions: () => Data.time.list(),
  getEconomics: () => Data.economics.list(),

  // Write operations
  logTime: (data: any) => Data.time.create(data),
  createTask: (data: any) => Data.tasks.create(data),

  // Convenience aliases
  tasks: () => Data.tasks.list(),
  projects: () => Data.projects.list(),
  sessions: () => Data.time.list(),
  economics: () => Data.economics.list(),
};

// Default export for backward compatibility
export default api;

