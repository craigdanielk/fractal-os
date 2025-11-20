import { getCurrentAuthUserId } from "../lib/auth/user";
import { dbQuery } from "../../../kernel/utils/safe-query";
import type { DBVendor, Vendor } from "../lib/supabase-types";
import { mapVendor } from "../lib/supabase-mapper";

/**
 * Get all vendors for accessible tenants
 */
export async function getVendors(): Promise<Vendor[]> {
  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await dbQuery("vendors", authUserId, {
    selectOnly: true,
    order: { column: "created_at", asc: true },
  });

  if (error) throw error;
  return (data || []).map(mapVendor);
}

/**
 * Get a single vendor by ID (must be in accessible tenants)
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("vendors")
    .select("*")
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapVendor(data) : null;
}

/**
 * Create a new vendor (in current tenant)
 */
export async function createVendor(input: Partial<DBVendor>): Promise<Vendor> {
  const client = await getScopedSupabaseClient();
  const currentTenantId = client.getCurrentTenantId();
  
  const { data, error } = await client
    .from("vendors")
    .insert([{ ...input, tenant_id: currentTenantId }])
    .select()
    .single();

  if (error) throw error;
  return mapVendor(data);
}

/**
 * Update an existing vendor (must be in accessible tenants)
 */
export async function updateVendor(id: string, input: Partial<DBVendor>): Promise<Vendor> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("vendors")
    .update(input)
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .select()
    .single();

  if (error) throw error;
  return mapVendor(data);
}

/**
 * Delete a vendor (must be in accessible tenants)
 */
export async function deleteVendor(id: string): Promise<void> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { error } = await client
    .from("vendors")
    .delete()
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds);

  if (error) throw error;
}
