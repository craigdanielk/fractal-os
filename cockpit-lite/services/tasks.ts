import { DB } from "./schema";
import { query } from "./notion";

export interface Task {
  id: string;
  title: string;
  raw: any;
}

function getText(prop: any) {
  if (!prop) return "";
  if (prop.title) return prop.title[0]?.plain_text || "";
  if (prop.rich_text) return prop.rich_text[0]?.plain_text || "";
  return "";
}

function getSelect(prop: any) {
  return prop?.status?.name || prop?.select?.name || "";
}

function getDate(prop: any) {
  return prop?.date?.start || null;
}

function getRelation(prop: any) {
  return prop?.relation?.map((r: any) => r.id) || [];
}

export async function getTasks(): Promise<Task[]> {
  const res = await query(DB.tasks);
  return res.results.map((page: any) => {
    const props = page.properties || {};
    const { mapProps } = require("../lib/prop-mapper");
    const mapped = mapProps(DB.tasks, props);

    return {
      id: page.id,
      title: mapped["Name"]?.value?.title?.[0]?.plain_text ?? "Untitled",
      raw: mapped,
    };
  });
}

