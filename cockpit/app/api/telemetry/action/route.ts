import { NextRequest, NextResponse } from "next/server";

/**
 * Telemetry Action Endpoint
 * Receives action logs from the client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log to console (in production, send to logging service)
    console.log("[Telemetry Action]", {
      action: body.action,
      timestamp: body.timestamp,
      module: body.module,
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telemetry action error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

