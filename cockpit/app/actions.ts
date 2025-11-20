"use server";

import { createTimeEntry, getTimeEntryById, getTimeEntries } from "@/services/time";
import { getEconomics } from "@/services/economics";
import { getProjects } from "@/services/projects";
import { getTasks, getTaskById, createTask } from "@/services/tasks";
import { createProject } from "@/services/projects";

export async function logTimeAction(data: {
  taskId: string;
  hours: number;
  notes?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}) {
  return createTimeEntry({
    task_id: data.taskId,
    duration_hours: data.hours,
    notes: data.notes,
    session_date: data.date || new Date().toISOString().split("T")[0],
    start_time: data.startTime || null,
    end_time: data.endTime || null,
  });
}

export async function getTimeEntriesAction() {
  return getTimeEntries();
}

export async function getTimeEntryByIdAction(id: string) {
  return getTimeEntryById(id);
}

export async function getEconomicsAction() {
  return getEconomics();
}

export async function getProjectsAction() {
  return getProjects();
}

export async function getTasksAction() {
  return getTasks();
}

export async function getTaskByIdAction(id: string) {
  return getTaskById(id);
}

export async function getProjectByIdAction(id: string) {
  const { getProjectById } = await import("@/services/projects");
  return getProjectById(id);
}

export async function createTaskAction(data: { name: string; project_id?: string | null }) {
  return createTask(data);
}

export async function createProjectAction(data: { name: string; client_id?: string | null }) {
  return createProject(data);
}
