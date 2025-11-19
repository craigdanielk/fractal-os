/*******************************
 * Cockpit Service Layer (Notion‑bound)
 *
 * Phase‑1: routes proxy through Kernel → Notion Adapter.
 *******************************/

import {
  Task,
  Project,
  Client,
  TimeEntry,
  EconomicsModel
} from "../../kernel/schemas";
import {
  notionGetTasks,
  notionGetProjects,
  notionGetClients,
  notionGetTimeEntries,
  notionGetEconomicsModel,
  notionCreateTimeEntry
} from "../../kernel/utils/notion.adapter";

export const api = {
  /* ------------------------------
     Read Operations
  -------------------------------*/

  tasks: async (): Promise<Task[]> => {
    return notionGetTasks();
  },

  projects: async (): Promise<Project[]> => {
    return notionGetProjects();
  },

  clients: async (): Promise<Client[]> => {
    return notionGetClients();
  },

  timeEntries: async (): Promise<TimeEntry[]> => {
    return notionGetTimeEntries();
  },

  economicsModel: async (): Promise<EconomicsModel[]> => {
    return notionGetEconomicsModel();
  },

  /* ------------------------------
     Write Operations (Phase‑1)
  -------------------------------*/

  logTime: async (data: Partial<TimeEntry>): Promise<TimeEntry> => {
    return notionCreateTimeEntry(data);
  }
};

export default api;