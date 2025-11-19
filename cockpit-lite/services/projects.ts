import { DB } from "./schema";
import { query } from "./notion";

// Projects v1.0 schema
export interface Project {
  id: string;
  name: string;
  status: string;
  client: string[];
  startDate: string | null;
  dueDate: string | null;
}

function getText(prop: any) {
  if (!prop) return "";
  if (prop.title) return prop.title[0]?.plain_text || "";
  if (prop.rich_text) return prop.rich_text[0]?.plain_text || "";
  return "";
}

function getSelect(prop: any) {
  return prop?.select?.name || "";
}

function getDate(prop: any) {
  return prop?.date?.start || null;
}

function getRelation(prop: any) {
  return prop?.relation?.map((r: any) => r.id) || [];
}

export async function getProjects(): Promise<Project[]> {
  const res = await query(DB.projects);
  return res.results.map((p: any) => {
    const props = p.properties;
    return {
      id: p.id,
      name: getText(props["Name"]),
      status: getSelect(props["Status"]),
      client: getRelation(props["Client"]),
      startDate: getDate(props["Start Date"]),
      dueDate: getDate(props["Due Date"]),
    };
  });
}

