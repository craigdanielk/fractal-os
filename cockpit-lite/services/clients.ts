import { getScopedSupabaseClient } from "../lib/supabase-client";
import type { DBClient, Client } from "../lib/supabase-types";
import { mapClient } from "../lib/supabase-mapper";

/**
 * Get all clients for accessible tenants
 */
export async function getClients(): Promise<Client[]> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("clients")
    .select("*")
    .in("tenant_id", accessibleTenantIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapClient);
}

/**
 * Get a single client by ID (must be in accessible tenants)
 */
export async function getClientById(id: string): Promise<Client | null> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("clients")
    .select("*")
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapClient(data) : null;
}

/**
 * Create a new client (in current tenant)
 */
export async function createClient(input: Partial<DBClient>): Promise<Client> {
  const client = await getScopedSupabaseClient();
  const currentTenantId = client.getCurrentTenantId();
  
  const { data, error } = await client
    .from("clients")
    .insert([{ ...input, tenant_id: currentTenantId }])
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
}

/**
 * Update an existing client (must be in accessible tenants)
 */
export async function updateClient(id: string, input: Partial<DBClient>): Promise<Client> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { data, error } = await client
    .from("clients")
    .update(input)
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds)
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
}

/**
 * Delete a client (must be in accessible tenants)
 */
export async function deleteClient(id: string): Promise<void> {
  const client = await getScopedSupabaseClient();
  const accessibleTenantIds = client.getAccessibleTenantIds();
  
  const { error } = await client
    .from("clients")
    .delete()
    .eq("id", id)
    .in("tenant_id", accessibleTenantIds);

  if (error) throw error;
}
