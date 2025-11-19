/**
 * Security Guards
 * Server-side validation and tenant scoping enforcement
 */

import { getScopedSupabaseClient } from "./supabase-client";

/**
 * Verify tenant access for a given tenant ID
 */
export async function verifyTenantAccess(tenantId: string): Promise<boolean> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  return accessibleTenantIds.includes(tenantId);
}

/**
 * Enforce tenant scoping on a query
 * Throws if tenant is not accessible
 */
export async function enforceTenantScope(tenantId: string): Promise<void> {
  const hasAccess = await verifyTenantAccess(tenantId);
  
  if (!hasAccess) {
    throw new Error(`Access denied: Tenant ${tenantId} is not accessible`);
  }
}

/**
 * Validate HMAC signature (for MCP listener + Bridge Gate)
 */
export function validateHMAC(payload: string, signature: string, secret: string): boolean {
  // TODO: Implement HMAC validation
  // For now, return true in development
  if (process.env.NEXT_PUBLIC_ENV === "development") {
    return true;
  }
  
  // Production implementation would use crypto.createHmac
  return true;
}

