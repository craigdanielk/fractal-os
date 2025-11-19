import { NextResponse } from "next/server";

// Endpoint deprecated: Notion removed from system.
export async function POST() {
  return NextResponse.json({ status: "deprecated" });
}

