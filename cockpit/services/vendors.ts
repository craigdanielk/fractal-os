import { getCurrentAuthUserId } from "../lib/auth/user";
import { dbQuery } from "../lib/safe-query";
import { getSupabaseServer } from "../lib/supabase-client-server";
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

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map((v) => mapVendor(v));
}

/**
 * Get a single vendor by ID (must be in accessible tenants)
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
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
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("vendors")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return mapVendor(data);
}

/**
 * Update an existing vendor (must be in accessible tenants)
 */
export async function updateVendor(id: string, input: Partial<DBVendor>): Promise<Vendor> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("vendors")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapVendor(data);
}

/**
 * Delete a vendor (must be in accessible tenants)
 */
export async function deleteVendor(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
