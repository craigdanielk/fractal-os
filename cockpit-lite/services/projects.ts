import { getCurrentAuthUserId } from "../lib/auth/user";
import { dbQuery } from "../../../kernel/utils/safe-query";
import type { DBProject, Project } from "../lib/supabase-types";
import { mapProject } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

/**
 * Get all projects for accessible tenants
 */
export async function getProjects(): Promise<Project[]> {
  // Initialize realtime subscription (client-side only)
  if (typeof window !== "undefined") {
    const { subscribe, triggerLocal } = await import("../lib/realtime");
    subscribe("projects", () => {
      cacheInvalidate("projects:");
      triggerLocal("projects", {});
    });
  }

  const cached = cacheGet("projects:list");
  if (cached) return cached;

  const authUserId = await getCurrentAuthUserId();
  if (!authUserId) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await dbQuery("projects", authUserId, {
    selectOnly: true,
    order: { column: "updated_at", asc: false },
  });

  if (error) throw error;
  
  const mapped = (data || []).map(mapProject);
  
  // Cache for offline mode (client-side only)
  if (typeof window !== "undefined") {
    try {
      const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
      if (mapped.length > 0) {
        await cacheBulkPut("projects", mapped);
      } else {
        const cached = await cacheGetAll("projects");
        if (cached.length > 0) return cached.map(mapProject);
      }
    } catch (e) {
      // Offline cache not available, continue with fetched data
    }
  }
  
  cacheSet("projects:list", mapped);
  return mapped;
}

/**
 * Get a single project by ID (must be in accessible tenants)
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapProject(data) : null;
}

/**
 * Get projects for a specific client
 */
export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .in("tenant_id", accessibleTenantIds)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProject);
}

/**
 * Create a new project (in current tenant)
 */
export async function createProject(input: Partial<DBProject>): Promise<Project> {
  const client = await getScopedSupabaseClient();
  const currentTenantId = client.getCurrentTenantId();
  
  const { data, error } = await client
    .from("projects")
    .insert([{ ...input, tenant_id: currentTenantId }])
    .select()
    .single();

  if (error) throw error;
  return mapProject(data);
}

/**
 * Update an existing project (must be in accessible tenants)
 */
export async function updateProject(id: string, input: Partial<DBProject>): Promise<Project> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("projects")
    .update(input)
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .select()
    .single();

  if (error) throw error;
  return mapProject(data);
}

/**
 * Delete a project (must be in accessible tenants)
 */
export async function deleteProject(id: string): Promise<void> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { error } = await client
    .from("projects")
    .delete()
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds);

  if (error) throw error;
}
