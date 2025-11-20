import { getCurrentAuthUserId } from "../lib/auth/user";
import { getSupabaseServer } from "../lib/supabase-client-server";
import type { DBEconomics, Economics } from "../lib/supabase-types";
import { mapEconomics } from "../lib/supabase-mapper";
import { cacheGet, cacheSet } from "../lib/cache";

/**
 * Get economics model (always visible, no tenant restriction)
 */
export async function getEconomics(): Promise<Economics[]> {
  const cached = cacheGet("economics:list");
  if (cached) return cached;

  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("economics")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  const mapped = (data || []).map((e) => mapEconomics(e));
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("economics", mapped);
      } else {
        const cached = await cacheGetAll("economics");
        if (cached.length > 0) return cached.map((e: any) => mapEconomics(e));
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
export async function getCurrentEconomics(): Promise<Economics | null> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("economics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapEconomics(data) : null;
}

/**
 * Create a new economics model (admin/agency only)
 */
export async function createEconomics(input: Partial<DBEconomics>): Promise<Economics> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("economics")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return mapEconomics(data);
}

/**
 * Update an existing economics model (admin/agency only)
 */
export async function updateEconomics(id: string, input: Partial<DBEconomics>): Promise<Economics> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("economics")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapEconomics(data);
}

/**
 * Delete an economics model (admin/agency only)
 */
export async function deleteEconomics(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase
    .from("economics")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
