// services/notion.ts

import { Client } from "@notionhq/client";

import { DB } from "./schema"; // your DB map

import "server-only";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET
});

// Simple in-memory cache for title property IDs
const titleCache: Record<string, string> = {};

async function getTitlePropertyId(dbId: string): Promise<string> {
  if (titleCache[dbId]) return titleCache[dbId];

  try {
    const schema = await notion.databases.retrieve({ database_id: dbId });
    const props = schema.properties;

    for (const [propName, propData] of Object.entries(props)) {
      // @ts-ignore
      if (propData.type === "title") {
        // @ts-ignore
        const id = propData.id;
        titleCache[dbId] = id;
        return id;
      }
    }

    throw new Error(`No title property found for database ${dbId}`);
  } catch (error: any) {
    if (error.code === "object_not_found") {
      throw new Error(`Database ${dbId} not found. Check that the database ID is correct and the integration has access.`);
    }
    if (error.code === "unauthorized") {
      throw new Error(`Unauthorized access to database ${dbId}. Check your NOTION_INTEGRATION_SECRET and ensure the integration has access to this database.`);
    }
    throw new Error(`Failed to retrieve database schema for ${dbId}: ${error.message || error}`);
  }
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

export async function query(
  dbId: string | undefined,
  filter?: any,
  sorts: any[] = []
) {
  if (!dbId) {
    const key = Object.entries(DB).find(([_, value]) => !value)?.[0];
    throw new Error(
      `Database ID for "${key || "UNKNOWN"}" is undefined. Check your .env.local.`
    );
  }

  try {
    return await notion.databases.query({
      database_id: dbId,
      filter: filter || undefined,
      sorts,
      page_size: 100,
    });
  } catch (error: any) {
    if (error.code === "object_not_found") {
      throw new Error(`Database ${dbId} not found. Check that the database ID is correct and the integration has access.`);
    }
    if (error.code === "unauthorized") {
      throw new Error(`Unauthorized access to database ${dbId}. Check your NOTION_INTEGRATION_SECRET and ensure the integration has access to this database.`);
    }
    throw new Error(`Failed to query database ${dbId}: ${error.message || error}`);
  }
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
