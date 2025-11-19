"use server";

import { getSupabaseServer } from "../supabase-client";
import { cookies } from "next/headers";

export type UserRole = "admin" | "agency" | "client";

export interface TenantContext {
  tenantId: string;
  role: UserRole;
  userId: string;
  accessibleTenantIds: string[];
}

/**
 * Get the current user's tenant context
 * Returns null if not authenticated
 */
export async function getCurrentTenant(): Promise<TenantContext | null> {
  try {
    const supabase = getSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // In development, return a mock context
      // TODO: Replace with actual Supabase auth session
      if (process.env.NODE_ENV === "development") {
        return {
          tenantId: "00000000-0000-0000-0000-000000000000",
          role: "admin",
          userId: "dev-user",
          accessibleTenantIds: [],
        };
      }
      return null;
    }

    // Get tenant_id from user metadata or lookup
    let tenantId = user.user_metadata?.tenant_id || user.raw_app_meta_data?.tenant_id;
    let role = (user.user_metadata?.role || user.raw_app_meta_data?.role) as UserRole;

    // Fallback: lookup tenant by owner_user_id
    if (!tenantId) {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("owner_user_id", user.id)
        .single();
      
      if (tenant) {
        tenantId = tenant.id;
      }
    }

    // Default role if not set
    if (!role) {
      role = "client";
    }

    if (!tenantId) {
      return null;
    }

    // Get accessible tenant IDs based on role
    const accessibleTenantIds = await getAccessibleTenantIds(tenantId, role);

    return {
      tenantId,
      role,
      userId: user.id,
      accessibleTenantIds,
    };
  } catch (error) {
    console.error("Error getting current tenant:", error);
    return null;
  }
}

/**
 * Get all tenant IDs accessible to a user based on their role and tenant
 */
export async function getAccessibleTenantIds(
  userTenantId: string,
  userRole: UserRole
): Promise<string[]> {
  const supabase = getSupabaseServer();
  
  if (userRole === "admin") {
    // Admin can access all tenants
    const { data, error } = await supabase.from("tenants").select("id");
    if (error) throw error;
    return data?.map((t) => t.id) || [];
  }

  if (userRole === "agency") {
    // Agency can access their tenant + all sub-tenants (recursive)
    const tenantIds = new Set<string>([userTenantId]);
    
    // Recursively fetch all child tenants
    const fetchChildren = async (parentId: string) => {
      const { data, error } = await supabase
        .from("tenants")
        .select("id")
        .eq("parent_id", parentId);
      
      if (error) throw error;
      
      for (const tenant of data || []) {
        if (!tenantIds.has(tenant.id)) {
          tenantIds.add(tenant.id);
          await fetchChildren(tenant.id); // Recursive
        }
      }
    };
    
    await fetchChildren(userTenantId);
    return Array.from(tenantIds);
  }

  if (userRole === "client") {
    // Client can only access their own tenant
    return [userTenantId];
  }

  return [];
}

/**
 * Check if a user can access a specific tenant
 */
export async function canAccessTenant(
  tenantId: string,
  userTenantId: string,
  userRole: UserRole
): Promise<boolean> {
  const accessibleIds = await getAccessibleTenantIds(userTenantId, userRole);
  return accessibleIds.includes(tenantId);
}

