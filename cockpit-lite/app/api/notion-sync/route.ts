import { NextResponse } from "next/server";
import { refreshSchemas } from "../../../lib/schema-loader";

export async function GET() {
  const dbIds = [
    process.env.NOTION_CLIENTS_DB_ID!,
    process.env.NOTION_PROJECTS_DB_ID!,
    process.env.NOTION_TASKS_DB_ID!,
    process.env.NOTION_TIME_DB_ID!,
    process.env.NOTION_ECONOMICS_DB_ID!,
    process.env.NOTION_VENDORS_DB_ID!,
  ];

  const out = await refreshSchemas(dbIds);

  return NextResponse.json({
    status: "ok",
    refreshed: Object.keys(out),
  });
}
