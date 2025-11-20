import { NextRequest, NextResponse } from "next/server";

/**
 * Telemetry Error Endpoint
 * Receives error logs from the client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log to console (in production, send to error tracking service)
    console.error("[Telemetry Error]", {
      error: body.error,
      stack: body.stack,
      timestamp: body.timestamp,
      tenantId: body.tenantId,
      componentStack: body.componentStack,
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telemetry error endpoint failed:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

