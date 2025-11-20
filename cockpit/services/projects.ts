import { getCurrentAuthUserId } from "../lib/auth/user";
import { getSupabaseServer } from "../lib/supabase-client-server";
import type { DBProject, Project } from "../lib/supabase-types";
import { mapProject } from "../lib/supabase-mapper";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";
import { SupabaseError, ValidationError, AuthenticationError } from "../lib/errors";
import { CreateProjectSchema, UpdateProjectSchema } from "../lib/schemas/projects";

/**
 * Get all projects for accessible tenants
 */
export async function getAll(): Promise<Project[]> {
  try {
    const cached = cacheGet("projects:list");
    if (cached) return cached;

    const authUserId = await getCurrentAuthUserId();
    if (!authUserId) {
      throw new AuthenticationError("Not authenticated");
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw SupabaseError.fromPostgrestError(error);
    
    const mapped = (data || []).map((p) => mapProject(p));
    
    // Cache for offline mode (client-side only)
    if (typeof window !== "undefined") {
      try {
        const { cacheBulkPut, cacheGetAll } = await import("../lib/offline");
        if (mapped.length > 0) {
          await cacheBulkPut("projects", mapped);
        } else {
          const cached = await cacheGetAll("projects");
          if (cached.length > 0) return cached.map((p: any) => mapProject(p));
        }
      } catch (e) {
        // Offline cache not available, continue with fetched data
      }
    }
    
    cacheSet("projects:list", mapped);
    return mapped;
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof AuthenticationError) throw error;
    throw new SupabaseError(`Failed to get projects: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Backward compatibility alias
export const getProjects = getAll;

/**
 * Get a single project by ID (must be in accessible tenants)
 */
export async function getById(id: string): Promise<Project | null> {
  try {
    if (!id || typeof id !== "string") {
      throw new ValidationError("Invalid project ID");
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw SupabaseError.fromPostgrestError(error);
    }
    return data ? mapProject(data) : null;
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof ValidationError) throw error;
    throw new SupabaseError(`Failed to get project: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Backward compatibility alias
export const getProjectById = getById;

/**
 * Get projects for a specific client
 */
export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  try {
    if (!clientId || typeof clientId !== "string") {
      throw new ValidationError("Invalid client ID");
    }

    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("updated_at", { ascending: false });

    if (error) throw SupabaseError.fromPostgrestError(error);
    return (data || []).map((p) => mapProject(p));
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof ValidationError) throw error;
    throw new SupabaseError(`Failed to get projects by client: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Create a new project (in current tenant)
 */
export async function create(input: unknown): Promise<Project> {
  try {
    const validated = CreateProjectSchema.parse(input);
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from("projects")
      .insert([validated])
      .select()
      .single();

    if (error) throw SupabaseError.fromPostgrestError(error);
    
    cacheInvalidate("projects:");
    return mapProject(data);
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof ValidationError || error instanceof AuthenticationError) throw error;
    if (error instanceof Error && error.name === "ZodError") {
      throw new ValidationError("Invalid project data", (error as any).issues);
    }
    throw new SupabaseError(`Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Backward compatibility alias
export const createProject = create;

/**
 * Update an existing project (must be in accessible tenants)
 */
export async function update(id: string, input: unknown): Promise<Project> {
  try {
    if (!id || typeof id !== "string") {
      throw new ValidationError("Invalid project ID");
    }

    const validated = UpdateProjectSchema.parse(input);
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from("projects")
      .update(validated)
      .eq("id", id)
      .select()
      .single();

    if (error) throw SupabaseError.fromPostgrestError(error);
    
    cacheInvalidate("projects:");
    return mapProject(data);
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof ValidationError) throw error;
    if (error instanceof Error && error.name === "ZodError") {
      throw new ValidationError("Invalid project data", (error as any).issues);
    }
    throw new SupabaseError(`Failed to update project: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Backward compatibility alias
export const updateProject = update;

/**
 * Remove a project (must be in accessible tenants)
 */
export async function remove(id: string): Promise<void> {
  try {
    if (!id || typeof id !== "string") {
      throw new ValidationError("Invalid project ID");
    }

    const supabase = getSupabaseServer();
    
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw SupabaseError.fromPostgrestError(error);
    
    cacheInvalidate("projects:");
  } catch (error) {
    if (error instanceof SupabaseError || error instanceof ValidationError) throw error;
    throw new SupabaseError(`Failed to remove project: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Backward compatibility alias
export const deleteProject = remove;
