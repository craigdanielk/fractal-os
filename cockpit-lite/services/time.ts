import { DB } from "./schema";
import { query } from "./notion";

export interface TimeEntry {
  id: string;
  task: string[];
  hours: number;
  date: string | null;
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

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const res = await query(DB.time, {}, [
    { property: "Date", direction: "descending" },
  ]);

  return res.results.map((t: any) => {
    const props = t.properties;
    return {
      id: t.id,
      task: getRelation(props["Task"]),
      hours: getNumber(props["Hours"]),
      date: getDate(props["Date"]),
    };
  });
}

