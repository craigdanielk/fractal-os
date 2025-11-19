"use server";

import { getSupabaseServer } from "./supabase-client";

/**
 * Resolve the current user's tenant ID
 * Throws if not authenticated
 */
export async function resolveTenant(): Promise<string> {
  const supabase = getSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Unauthenticated");
  }

  // Try to get tenant from user metadata first
  const userTenantId = user.user_metadata?.tenant_id || user.raw_app_meta_data?.tenant_id;
  
  if (userTenantId) {
    return userTenantId;
  }

  // Fallback: look up tenant by owner_user_id
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (tenantError || !tenant) {
    throw new Error("Tenant not found for user");
  }

  return tenant.id;
}

