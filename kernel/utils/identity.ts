"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * Get Supabase client for server-side admin operations
 * Uses service role key for admin operations
 */
function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Ensure an identity_user record exists for the given auth user
 * Creates one if it doesn't exist
 */
export async function ensureIdentity(authUserId: string, email: string): Promise<string> {
  const supabase = getSupabaseAdmin();

  // Check if identity already exists
  const { data: existing, error: checkError } = await supabase
    .from("identity_users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(`Identity lookup failed: ${checkError.message}`);
  }

  if (existing) {
    return existing.id;
  }

  // Create new identity
  const { data, error } = await supabase
    .from("identity_users")
    .insert({ auth_user_id: authUserId, email })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Identity creation failed: ${error.message}`);
  }

  return data.id;
}

/**
 * Get identity user ID from auth user ID
 */
export async function getIdentityUserId(authUserId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("identity_users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Identity lookup failed: ${error.message}`);
  }

  return data?.id || null;
}

/**
 * Create tenant membership for a user
 */
export async function createTenantMembership(
  tenantId: string,
  identityUserId: string,
  role: "owner" | "admin" | "manager" | "viewer" = "viewer"
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("tenant_members")
    .insert({
      tenant_id: tenantId,
      user_id: identityUserId,
      role,
    });

  if (error) {
    // Ignore duplicate key errors (already a member)
    if (error.code === "23505") {
      return;
    }
    throw new Error(`Tenant membership creation failed: ${error.message}`);
  }
}
