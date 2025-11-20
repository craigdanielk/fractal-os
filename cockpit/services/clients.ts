import { getSupabaseServer } from "../lib/supabase-client-server";
import type { DBClient, Client } from "../lib/supabase-types";
import { mapClient } from "../lib/supabase-mapper";

/**
 * Get all clients for accessible tenants
 */
export async function getClients(): Promise<Client[]> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map((c) => mapClient(c));
}

/**
 * Get a single client by ID (must be in accessible tenants)
 */
export async function getClientById(id: string): Promise<Client | null> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
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
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("clients")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
}

/**
 * Update an existing client (must be in accessible tenants)
 */
export async function updateClient(id: string, input: Partial<DBClient>): Promise<Client> {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
}

/**
 * Delete a client (must be in accessible tenants)
 */
export async function deleteClient(id: string): Promise<void> {
  const supabase = getSupabaseServer();
  
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
