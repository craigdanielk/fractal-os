/**
 * API Middleware for Tenant Scoping
 * 
 * Use this in Next.js API routes to extract and validate tenant from headers
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Extract tenant from request headers
 */
export function getTenantFromRequest(req: NextRequest): string | null {
  return req.headers.get("x-tenant-id") || null;
}

/**
 * Middleware function to validate tenant in API routes
 */
export function withTenant(
  handler: (req: NextRequest, tenant: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const tenant = getTenantFromRequest(req);
    
    if (!tenant) {
      return NextResponse.json(
        { error: "Missing X-Tenant-ID header" },
        { status: 400 }
      );
    }
    
    return handler(req, tenant);
  };
}

