import { getSupabaseServer } from "../lib/supabase-client-server";
import type { DBTimeEntry, TimeEntry } from "../lib/supabase-types";
import { mapTimeEntry } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

/**
 * Get all time entries for accessible tenants
 */
export async function getTimeEntries(): Promise<TimeEntry[]> {
  const cached = cacheGet("time:list");
  if (cached) return cached;

  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .order("session_date", { ascending: false });

  if (error) throw error;
  
  const mapped = (data || []).map((e) => mapTimeEntry(e));
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("time_entries", mapped);
      } else {
        const cached = await cacheGetAll("time_entries");
        if (cached.length > 0) return cached.map((e: any) => mapTimeEntry(e));
      }
    } catch (e) {
      // Offline cache not available, continue with fetched data
    }
  }
  
  cacheSet("time:list", mapped);
  return mapped;
}

/**
 * Get a single time entry by ID (must be in accessible tenants)
 */
export async function getTimeEntryById(id: string): Promise<TimeEntry | null> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapTimeEntry(data) : null;
}

/**
 * Get time entries for a specific task
 */
export async function getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .eq("task_id", taskId)
    .order("session_date", { ascending: false });

  if (error) throw error;
  return (data || []).map((e) => mapTimeEntry(e));
}

/**
 * Create a new time entry (in current tenant)
 */
export async function createTimeEntry(input: Partial<DBTimeEntry>): Promise<TimeEntry> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("time_entries")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return mapTimeEntry(data);
}

/**
 * Update an existing time entry (must be in accessible tenants)
 */
export async function updateTimeEntry(id: string, input: Partial<DBTimeEntry>): Promise<TimeEntry> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("time_entries")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapTimeEntry(data);
}

/**
 * Delete a time entry (must be in accessible tenants)
 */
export async function deleteTimeEntry(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
