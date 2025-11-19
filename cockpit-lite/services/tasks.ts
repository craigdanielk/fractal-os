import { getCurrentAuthUserId } from "../lib/auth/user";
import { dbQuery } from "../../../kernel/utils/safe-query";
import type { DBTask, Task } from "../lib/supabase-types";
import { mapTask } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

/**
 * Get all tasks for accessible tenants
 */
export async function getTasks(): Promise<Task[]> {
  // Initialize realtime subscription (client-side only)
  if (typeof window !== "undefined") {
    const { subscribe, triggerLocal } = await import("../lib/realtime");
    subscribe("tasks", () => {
      cacheInvalidate("tasks:");
      triggerLocal("tasks", {});
    });
  }

  const cached = cacheGet("tasks:list");
  if (cached) return cached;

  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await dbQuery("tasks", authUserId, {
    selectOnly: true,
    order: { column: "updated_at", asc: false },
  });

  if (error) throw error;
  
  const mapped = (data || []).map(mapTask);
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("tasks", mapped);
      } else {
        const cached = await cacheGetAll("tasks");
        if (cached.length > 0) return cached.map(mapTask);
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
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
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
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .in("tenant_id", accessibleTenantIds)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapTask);
}

/**
 * Get subtasks for a parent task
 */
export async function getSubtasks(parentTaskId: string): Promise<Task[]> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("parent_task_id", parentTaskId)
    .in("tenant_id", accessibleTenantIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapTask);
}

/**
 * Create a new task (in current tenant)
 */
export async function createTask(input: Partial<DBTask>): Promise<Task> {
  const client = await getScopedSupabaseClient();
  const currentTenantId = client.getCurrentTenantId();
  
  const { data, error } = await client
    .from("tasks")
    .insert([{ ...input, tenant_id: currentTenantId }])
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

/**
 * Update an existing task (must be in accessible tenants)
 */
export async function updateTask(id: string, input: Partial<DBTask>): Promise<Task> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("tasks")
    .update(input)
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

/**
 * Delete a task (must be in accessible tenants)
 */
export async function deleteTask(id: string): Promise<void> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { error } = await client
    .from("tasks")
    .delete()
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds);

  if (error) throw error;
}
