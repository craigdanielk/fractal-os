import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getCurrentTenant } from "./auth/tenant";

/**
 * Get Supabase server client with SSR support
 * Uses cookies for session management
 */
export function getSupabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Cookie can't be set in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {
            // Cookie can't be removed in middleware
          }
        },
      },
    }
  );
}

/**
 * Get a Supabase client scoped to the current user's accessible tenants
 * This client automatically filters queries to accessible tenant IDs
 */
export async function getScopedSupabaseClient() {
  const tenantContext = await getCurrentTenant();
  
  if (!tenantContext) {
    throw new Error("Not authenticated. Please log in.");
  }

  const client = getSupabaseServer();

  // Return client with helper methods
  return {
    ...client,
    getAccessibleTenantIds: () => tenantContext.accessibleTenantIds,
    getCurrentTenantId: () => tenantContext.tenantId,
    getRole: () => tenantContext.role,
  };
}

/**
 * Create a query builder that automatically scopes to accessible tenants
 */
export async function scopedQuery<T>(
  table: string,
  queryFn: (query: any) => any
): Promise<T[]> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  let query = client.from(table).select("*");
  
  // Apply tenant filter
  if (accessibleTenantIds.length > 0) {
    query = query.in("tenant_id", accessibleTenantIds);
  } else {
    // No accessible tenants, return empty
    return [];
  }
  
  // Apply custom query function
  query = queryFn(query);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return (data || []) as T[];
}
