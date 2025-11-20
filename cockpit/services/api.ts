"use server";

import { getTasks, createTask } from "./tasks";
import { getProjects, createProject } from "./projects";
import { getTimeEntries, createTimeEntry } from "./time";
import { getEconomics, createEconomics } from "./economics";

export const API = {
  tasks: {
    list: async () => getTasks(),
    create: async (data: any) => createTask(data),
  },
  projects: {
    list: async () => getProjects(),
    create: async (data: any) => createProject(data),
  },
  time: {
    list: async () => getTimeEntries(),
    create: async (data: any) => createTimeEntry(data),
  },
  economics: {
    list: async () => getEconomics(),
    create: async (data: any) => createEconomics(data),
  }
};

// Backward compatibility exports
export const api = {
  getTasks: () => API.tasks.list(),
  getProjects: () => API.projects.list(),
  getSessions: () => API.time.list(),
  getEconomics: () => API.economics.list(),
  logTime: (data: any) => API.time.create(data),
  createTask: (data: any) => API.tasks.create(data),
  tasks: () => API.tasks.list(),
  projects: () => API.projects.list(),
  sessions: () => API.time.list(),
  economics: () => API.economics.list(),
};

export default api;
