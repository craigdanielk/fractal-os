import { getCurrentAuthUserId } from "../lib/auth/user";
import { dbQuery } from "../../../kernel/utils/safe-query";
import type { DBEconomicsModel, EconomicsModel } from "../lib/supabase-types";
import { mapEconomicsModel } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

/**
 * Get economics model (always visible, no tenant restriction)
 */
export async function getEconomics(): Promise<EconomicsModel[]> {
  // Initialize realtime subscription (client-side only)
  if (typeof window !== "undefined") {
    const { subscribe, triggerLocal } = await import("../lib/realtime");
    subscribe("economics_model", () => {
      cacheInvalidate("economics:");
      triggerLocal("economics_model", {});
    });
  }

  const cached = cacheGet("economics:list");
  if (cached) return cached;

  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await dbQuery("economics_model", authUserId, {
    selectOnly: true,
    noTenantFilter: true, // Economics is always visible
    order: { column: "created_at", asc: false },
  });

  if (error) throw error;
  
  const mapped = (data || []).map(mapEconomicsModel);
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("economics", mapped);
      } else {
        const cached = await cacheGetAll("economics");
        if (cached.length > 0) return cached.map(mapEconomicsModel);
      }
    } catch (e) {
      // Offline cache not available, continue with fetched data
    }
  }
  
  cacheSet("economics:list", mapped);
  return mapped;
}

/**
 * Get the current economics model (first/latest)
 */
export async function getCurrentEconomics(): Promise<EconomicsModel | null> {
  const client = await getScopedSupabaseClient();
  
  const { data, error } = await client
    .from("economics_model")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapEconomicsModel(data) : null;
}

/**
 * Create a new economics model (admin/agency only)
 */
export async function createEconomics(input: Partial<DBEconomicsModel>): Promise<EconomicsModel> {
  const client = await getScopedSupabaseClient();
  const role = client.getRole();
  
  if (role !== "admin" && role !== "agency") {
    throw new Error("Only admins and agencies can create economics models");
  }
  
  const currentTenantId = client.getCurrentTenantId();
  
  const { data, error } = await client
    .from("economics_model")
    .insert([{ ...input, tenant_id: currentTenantId }])
    .select()
    .single();

  if (error) throw error;
  return mapEconomicsModel(data);
}

/**
 * Update an existing economics model (admin/agency only)
 */
export async function updateEconomics(id: string, input: Partial<DBEconomicsModel>): Promise<EconomicsModel> {
  const client = await getScopedSupabaseClient();
  const role = client.getRole();
  
  if (role !== "admin" && role !== "agency") {
    throw new Error("Only admins and agencies can update economics models");
  }
  
  const { data, error } = await client
    .from("economics_model")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapEconomicsModel(data);
}

/**
 * Delete an economics model (admin/agency only)
 */
export async function deleteEconomics(id: string): Promise<void> {
  const client = await getScopedSupabaseClient();
  const role = client.getRole();
  
  if (role !== "admin" && role !== "agency") {
    throw new Error("Only admins and agencies can delete economics models");
  }
  
  const { error } = await client
    .from("economics_model")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
