import { DB } from "./schema";
import { query } from "./notion";

export interface TimeEntry {
  id: string;
  title: string;
  raw: any;
}

function getNumber(prop: any) {
  return prop?.number || 0;
}

function getDate(prop: any) {
  return prop?.date?.start || null;
}

function getRelation(prop: any) {
  return prop?.relation?.map((r: any) => r.id) || [];
}

export async function getSessions(): Promise<TimeEntry[]> {
  const res = await query(DB.TIME, undefined, [
    { property: "Session Date", direction: "descending" },
  ]);

  return res.results.map((page: any) => {
    const props = page.properties || {};
    const { mapProps } = require("../lib/prop-mapper");
    const mapped = mapProps(DB.TIME, props);

    return {
      id: page.id,
      title: mapped["Session Name"]?.value?.title?.[0]?.plain_text ?? "Untitled",
      raw: mapped,
    };
  });
}

