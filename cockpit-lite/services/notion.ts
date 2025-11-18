/**
 * Notion Service
 * 
 * Handles all Notion API interactions
 */

import { Client } from "@notionhq/client";
import {
  mapNotionTaskToFractal,
  mapNotionProjectToFractal,
  mapNotionTimeToFractal,
} from "@/lib/notion-mapper";
import type { Task, Project, Client, TimeEntry, EconomicsModel } from "@/lib/types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DB_IDS = {
  tasks: process.env.NOTION_TASKS_DB_ID || "",
  projects: process.env.NOTION_PROJECTS_DB_ID || "",
  clients: process.env.NOTION_CLIENTS_DB_ID || "",
  time: process.env.NOTION_TIME_DB_ID || "",
  economics: process.env.NOTION_ECONOMICS_DB_ID || "",
};

export async function fetchTasks(): Promise<Task[]> {
  if (!DB_IDS.tasks) return [];
  
  const response = await notion.databases.query({
    database_id: DB_IDS.tasks,
  });

  return response.results.map((item: any) =>
    mapNotionTaskToFractal(item as any)
  );
}

export async function fetchProjects(): Promise<Project[]> {
  if (!DB_IDS.projects) return [];
  
  const response = await notion.databases.query({
    database_id: DB_IDS.projects,
  });

  return response.results.map((item: any) =>
    mapNotionProjectToFractal(item as any)
  );
}

export async function fetchClients(): Promise<Client[]> {
  if (!DB_IDS.clients) return [];
  
  const response = await notion.databases.query({
    database_id: DB_IDS.clients,
  });

  return response.results.map((item: any) => ({
    id: item.id,
    name: (item as any).properties.Name?.title?.[0]?.plain_text || "Unnamed Client",
    description: (item as any).properties.Description?.rich_text?.[0]?.plain_text || "",
    industry: (item as any).properties.Industry?.select?.name || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function fetchTimeEntries(): Promise<TimeEntry[]> {
  if (!DB_IDS.time) return [];
  
  const response = await notion.databases.query({
    database_id: DB_IDS.time,
  });

  return response.results.map((item: any) =>
    mapNotionTimeToFractal(item as any)
  );
}

export async function fetchEconomicsModel(): Promise<EconomicsModel[]> {
  if (!DB_IDS.economics) return [];
  
  const response = await notion.databases.query({
    database_id: DB_IDS.economics,
  });

  return response.results.map((item: any) => ({
    id: item.id,
    name: (item as any).properties.Name?.title?.[0]?.plain_text || "Default Economics Model",
    hourlyRates: {},
    overheadCost: 0,
    directExpenses: 0,
    marginTargets: { min: 0.1, ideal: 0.3 },
    modelType: "agency",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function createTimeEntry(data: Partial<TimeEntry>): Promise<TimeEntry> {
  if (!DB_IDS.time) {
    throw new Error("NOTION_TIME_DB_ID not configured");
  }

  const response = await notion.pages.create({
    parent: { database_id: DB_IDS.time },
    properties: {
      Task: {
        relation: data.taskId ? [{ id: data.taskId }] : [],
      },
      Project: {
        relation: data.projectId ? [{ id: data.projectId }] : [],
      },
      Hours: {
        number: data.hours || 0,
      },
      Notes: {
        rich_text: data.notes ? [{ text: { content: data.notes } }] : [],
      },
    },
  });

  return mapNotionTimeToFractal(response as any);
}

export async function createTask(data: {
  name: string;
  projectId: string;
  description?: string;
}): Promise<Task> {
  if (!DB_IDS.tasks) {
    throw new Error("NOTION_TASKS_DB_ID not configured");
  }

  const response = await notion.pages.create({
    parent: { database_id: DB_IDS.tasks },
    properties: {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      Project: {
        relation: data.projectId ? [{ id: data.projectId }] : [],
      },
      Description: {
        rich_text: data.description
          ? [{ text: { content: data.description } }]
          : [],
      },
    },
  });

  return mapNotionTaskToFractal(response as any);
}

