/**
 * Kernel Utility Helpers
 *
 * Pure, deterministic helpers used across:
 *  - Economics Engine
 *  - Commands (task, project, economics)
 *  - Pattern Engine
 *  - Manifest validation
 *
 * NO side effects, NO database access, NO I/O.
 */

/* -------------------------
   Time & Economics Helpers
--------------------------*/

/**
 * Calculate labour cost from time entries + model hourly rates.
 */
export function calculateLabourCost(
  entries: { hours: number; userId?: string }[],
  model: { hourlyRates?: Record<string, number> }
): number {
  if (!model.hourlyRates) return 0;

  return entries.reduce((sum, entry) => {
    const role = entry.userId || "default";
    const rate = model.hourlyRates?.[role] ?? 0;
    return sum + entry.hours * rate;
  }, 0);
}

/**
 * Compute contribution margin.
 */
export function calculateContribution({
  project,
  revenue,
  labourCost,
  overheadCost,
  directExpenses
}: {
  project?: { revenue?: number } | null;
  revenue?: number;
  labourCost: number;
  overheadCost: number;
  directExpenses: number;
}) {
  const projectRevenue = revenue ?? project?.revenue ?? 0;

  const totalCost = labourCost + overheadCost + directExpenses;
  const contribution = projectRevenue - totalCost;

  return {
    revenue: projectRevenue,
    labourCost,
    overheadCost,
    directExpenses,
    totalCost,
    contribution,
    margin: projectRevenue > 0 ? contribution / projectRevenue : 0
  };
}

/* -------------------------
   Validation & Type Helpers
--------------------------*/

/**
 * Check if object has all required fields.
 */
export function validateRequired<T extends object>(
  obj: T,
  fields: (keyof T)[]
): string[] {
  return fields.filter((f) => !(f in obj));
}

/**
 * Deep merge utility for pattern inheritance.
 */
export function deepMerge<T extends object, U extends object>(base: T, override: U): T & U {
  return structuredClone({
    ...base,
    ...override
  });
}

/**
 * Stable ID generator (wrapper for Node crypto).
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Return a timestamp (ISO).
 */
export function now(): string {
  return new Date().toISOString();
}

/* -------------------------
   Database Helpers
--------------------------*/

/**
 * Safe insert with tenant scoping.
 * Adds tenant_id to payload before insertion.
 * Sets tenant context in database session for RLS.
 */
export async function safeInsert(table: string, payload: any, tenant: string, ctx?: { role?: string; userId?: string }) {
  const { setTenantContext } = await import("../drizzle/client");
  await setTenantContext(tenant);
  
  const finalPayload = {
    ...payload,
    tenant_id: tenant,
    ...(ctx?.role && { role: ctx.role }),
    ...(ctx?.userId && { user_id: ctx.userId }),
  };
  
  // Note: This is a generic helper. For type-safe operations, use the specific API modules.
  // This function prepares the payload with tenant_id - actual insertion should be done
  // using the appropriate Drizzle API module (e.g., ProjectAPI.create(finalPayload))
  return finalPayload;
}

/**
 * Safe update with tenant scoping.
 * Adds tenant_id to payload before update.
 * Sets tenant context in database session for RLS.
 */
export async function safeUpdate(table: string, id: string, payload: any, tenant: string, ctx?: { role?: string; userId?: string }) {
  const { setTenantContext } = await import("../drizzle/client");
  await setTenantContext(tenant);
  
  payload.tenant_id = tenant;
  if (ctx?.role) payload.role = ctx.role;
  if (ctx?.userId) payload.user_id = ctx.userId;
  
  // Note: This is a generic helper. For type-safe operations, use the specific API modules.
  // This function prepares the payload with tenant_id - actual update should be done
  // using the appropriate Drizzle API module (e.g., ProjectAPI.update(id, payload))
  return payload;
}
