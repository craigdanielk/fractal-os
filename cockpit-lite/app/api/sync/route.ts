import { NextResponse } from "next/server";

/**
 * Sync API route - triggers client-side sync
 * Actual sync happens client-side using IndexedDB
 */
export async function GET() {
  // Return success - client will handle actual sync
  return NextResponse.json({ ok: true, message: "Sync triggered" });
}

