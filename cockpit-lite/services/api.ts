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



export async function apiFetch(path: string, options: any = {}) {

const tenant =

typeof window !== "undefined" ? localStorage.getItem("tenant_id") : null;

const sessionRes = await fetch("/api/auth/session");

const sessionData = sessionRes.ok ? await sessionRes.json() : null;

const { getAuthHeaders } = await import("@/lib/auth");

const authHeaders = sessionData?.user ? await getAuthHeaders(sessionData.user) : {};

const headers = {

"Content-Type": "application/json",

...(tenant && { "X-Tenant-ID": tenant }),

...authHeaders,

...(options.headers || {}),

};



const res = await fetch(`/api/${path}`, { ...options, headers });



if (!res.ok) {

const msg = await res.text();

throw new Error(msg);

}



return res.json();

}



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

