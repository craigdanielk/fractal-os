// services/notion.ts

import { Client } from "@notionhq/client";

import { DB } from "./schema"; // your DB map

import "server-only";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET
});

// Simple in-memory cache for title property IDs
import { readSchema, loadSchema } from "../lib/schema-loader";

const titleCache: Record<string, string> = {};

async function getTitlePropertyId(dbId: string): Promise<string> {
  const cached = readSchema();
  if (cached && cached[dbId]) {
    const props = cached[dbId].properties;
    const titleProp = Object.entries(props).find(([_, p]: any) => p.type === "title");
    if (titleProp) return titleProp[1].id;
  }

  // fallback dynamic fetch
  const liveSchema = await loadSchema(dbId);
  const titleProp = Object.entries(liveSchema.properties).find(([_, p]: any) => p.type === "title") as [string, any] | undefined;
  if (titleProp) return titleProp[1].id;

  throw new Error(`No title property found for database ${dbId}`);
}

// Validate required env vars at startup
export function validateEnv() {
  const required = [
    "NOTION_INTEGRATION_SECRET",
    "NOTION_CLIENTS_DB_ID",
    "NOTION_PROJECTS_DB_ID",
    "NOTION_TASKS_DB_ID",
    "NOTION_TIME_DB_ID",
    "NOTION_ECONOMICS_DB_ID",
    "NOTION_VENDORS_DB_ID"
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

export async function query(dbId: string | undefined, filter?: any, sorts: any[] = []) {
  if (!dbId) throw new Error(`Database ID undefined for query()`);

  const cached = readSchema();
  if (!cached || !cached[dbId]) {
    console.warn(`Schema for ${dbId} missing — fetching live…`);
    await loadSchema(dbId);
  }

  return await notion.databases.query({
    database_id: dbId,
    filter: filter ?? undefined,
    sorts: sorts ?? [],
    page_size: 100
  });
}

export async function getById(dbId: string, pageId: string) {
  return notion.pages.retrieve({ page_id: pageId });
}

export async function create(
  dbId: string,
  data: Record<string, any>
) {
  const titleId = await getTitlePropertyId(dbId);

  return notion.pages.create({
    parent: { database_id: dbId },
    properties: {
      [titleId]: {
        title: [{ type: "text", text: { content: data.title || "Untitled" } }]
      },
      ...data.props
    }
  });
}

export async function update(pageId: string, data: Record<string, any>) {
  return notion.pages.update({
    page_id: pageId,
    properties: data
  });
}

export async function createTimeEntry(entry: { taskId: string; projectId: string; hours: number; notes?: string; date?: string }) {
  return create(DB.TIME!, {
    title: "Session",
    props: {
      "Task": { relation: [{ id: entry.taskId }] },
      "Project": { relation: [{ id: entry.projectId }] },
      "Hours": { number: entry.hours },
      "Session Date": { date: { start: entry.date || new Date().toISOString() } },
      "Notes": { rich_text: [{ text: { content: entry.notes || "" } }] }
    }
  });
}

export async function createTask(task: { name: string; projectId: string; status?: string; dueDate?: string }) {
  return create(DB.tasks!, {
    title: task.name,
    props: {
      "Project": { relation: [{ id: task.projectId }] },
      "Status": { status: { name: task.status || "Not Started" } },
      "Due Date": task.dueDate ? { date: { start: task.dueDate } } : undefined
    }
  });
}
