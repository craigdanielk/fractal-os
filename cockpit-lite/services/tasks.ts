import { DB } from "./schema";
import { query } from "./notion";

export interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string | null;
  project: string[];
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
  return res.results.map((t: any) => {
    const props = t.properties;
    return {
      id: t.id,
      name: getText(props["Name"]),
      status: getSelect(props["Status"]),
      dueDate: getDate(props["Due Date"]),
      project: getRelation(props["Project"]),
    };
  });
}

