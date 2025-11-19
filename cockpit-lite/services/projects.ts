import { DB } from "./schema";
import { query } from "./notion";

// Projects v1.0 schema
export interface Project {
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
  return res.results.map((page: any) => {
    const props = page.properties || {};
    const { mapProps } = require("../lib/prop-mapper");
    const mapped = mapProps(DB.projects, props);

    return {
      id: page.id,
      title: mapped["Name"]?.value?.title?.[0]?.plain_text ?? "Untitled",
      raw: mapped,
    };
  });
}

