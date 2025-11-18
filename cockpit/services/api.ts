/*******************************
 * Cockpit Service Layer
 *
 * Provides typed wrappers for Kernel API routes.
 * The Cockpit never executes business logic — it only calls Kernel endpoints.
 *******************************/

import type { Task, Project, TimeEntry, EconomicsSnapshot } from "../../kernel/schemas";

const API_BASE = "/api";

/* ------------------------------
   Basic Fetch Wrapper
-------------------------------*/

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API Error ${res.status}: ${detail}`);
  }

  return res.json() as Promise<T>;
}

/* ------------------------------
   Task Endpoints
-------------------------------*/

export const getTasks = (): Promise<Task[]> => {
  return request<Task[]>("/tasks");
};

export const createTask = (data: Partial<Task>): Promise<Task> => {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/* ------------------------------
   Project Endpoints
-------------------------------*/

export const getProjects = (): Promise<Project[]> => {
  return request<Project[]>("/projects");
};

export const createProject = (data: Partial<Project>): Promise<Project> => {
  return request<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/* ------------------------------
   Time Entry Endpoints
-------------------------------*/

export const getTimeEntries = (): Promise<TimeEntry[]> => {
  return request<TimeEntry[]>("/time");
};

export const logTime = (data: Partial<TimeEntry>): Promise<TimeEntry> => {
  return request<TimeEntry>("/time", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/* ------------------------------
   Economics Endpoints
-------------------------------*/

export const getEconomicsOverview = (): Promise<EconomicsSnapshot> => {
  return request<EconomicsSnapshot>("/economics");
};

/* ------------------------------
   Manifest & Pattern Metadata
-------------------------------*/

import manifest from "../../kernel/manifests/base.manifest.json";
export const getManifest = () => manifest;

import { patternRegistry } from "../../kernel/patterns";
export const getPatterns = () => patternRegistry;