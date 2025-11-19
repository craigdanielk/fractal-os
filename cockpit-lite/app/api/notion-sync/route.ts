import { NextResponse } from "next/server";
import { getDB, extract } from "@/lib/notion";

const DB = {
  clients: process.env.NOTION_CLIENTS_DB!,
  projects: process.env.NOTION_PROJECTS_DB!,
  tasks: process.env.NOTION_TASKS_DB!,
  vendors: process.env.NOTION_VENDORS_DB!,
  sessions: process.env.NOTION_SESSIONS_DB!,
};

export async function GET() {
  const [clients, projects, tasks, vendors, sessions] = await Promise.all([
    getDB(DB.clients),
    getDB(DB.projects),
    getDB(DB.tasks),
    getDB(DB.vendors),
    getDB(DB.sessions),
  ]);

  function map(result: any) {
    return result.results.map((x: any) => ({
      id: x.id,
      props: Object.fromEntries(
        Object.entries(x.properties).map(([k, v]) => [k, extract(v)])
      ),
    }));
  }

  return NextResponse.json({
    clients: map(clients),
    projects: map(projects),
    tasks: map(tasks),
    vendors: map(vendors),
    sessions: map(sessions),
  });
}

