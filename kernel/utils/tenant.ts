"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * Get Supabase client for server-side admin operations
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
 * Get all accessible tenant IDs for a user based on identity_users and tenant_members
 * Includes direct memberships and sub-tenants via tenant_links (Model-X)
 */
export async function getAccessibleTenants(authUserId: string): Promise<string[]> {
  const supabase = getSupabaseAdmin();

  // 1. Resolve identity row
  const { data: identity, error: identityError } = await supabase
    .from("identity_users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .single();

  if (identityError) {
    if (identityError.code === "PGRST116") {
      // Identity doesn't exist yet - return empty array
      return [];
    }
    throw new Error(`Identity resolution failed: ${identityError.message}`);
  }

  const identityId = identity.id;

  // 2. Resolve tenant memberships
  const { data: memberships, error: memberErr } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", identityId);

  if (memberErr) {
    throw new Error(`Tenant membership lookup failed: ${memberErr.message}`);
  }

  const memberTenantIds = memberships?.map((m) => m.tenant_id) || [];

  if (memberTenantIds.length === 0) {
    return [];
  }

  // 3. Resolve sub-tenants (Model-X hierarchy)
  const { data: links, error: linkErr } = await supabase
    .from("tenant_links")
    .select("child_tenant")
    .in("parent_tenant", memberTenantIds);

  if (linkErr) {
    throw new Error(`Tenant link lookup failed: ${linkErr.message}`);
  }

  const childTenantIds = links?.map((l) => l.child_tenant) || [];

  // 4. Consolidated tenant scope (deduplicated)
  return [...new Set([...memberTenantIds, ...childTenantIds])];
}

