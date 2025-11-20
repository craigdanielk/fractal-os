import { getCurrentAuthUserId } from "../lib/auth/user";
import { getSupabaseServer } from "../lib/supabase-client-server";
import type { DBTask, Task } from "../lib/supabase-types";
import { mapTask } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

/**
 * Get all tasks for accessible tenants
 */
export async function getTasks(): Promise<Task[]> {
  const cached = cacheGet("tasks:list");
  if (cached) return cached;

  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  
  const mapped = (data || []).map((t) => mapTask(t));
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("tasks", mapped);
      } else {
        const cached = await cacheGetAll("tasks");
        if (cached.length > 0) return cached.map((t: any) => mapTask(t));
      }
    } catch (e) {
      // Offline cache not available, continue with fetched data
    }
  }
  
  cacheSet("tasks:list", mapped);
  return mapped;
}

/**
 * Get a single task by ID (must be in accessible tenants)
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapTask(data) : null;
}

/**
 * Get tasks for a specific project
 */
export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((t) => mapTask(t));
}

/**
 * Get subtasks for a parent task
 */
export async function getSubtasks(parentTaskId: string): Promise<Task[]> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("parent_task_id", parentTaskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map((t) => mapTask(t));
}

/**
 * Create a new task (in current tenant)
 */
export async function createTask(input: Partial<DBTask>): Promise<Task> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

/**
 * Update an existing task (must be in accessible tenants)
 */
export async function updateTask(id: string, input: Partial<DBTask>): Promise<Task> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

/**
 * Delete a task (must be in accessible tenants)
 */
export async function deleteTask(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
