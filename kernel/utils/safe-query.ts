"use server";

import { createClient } from "@supabase/supabase-js";
import { getAccessibleTenants } from "./tenant";

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

interface QueryOptions {
  selectOnly?: boolean;
  columns?: string;
  noTenantFilter?: boolean;
  eq?: Record<string, any>;
  order?: {
    column: string;
    asc?: boolean;
  };
  insert?: any | any[];
  forceTenantId?: string;
  update?: Record<string, any>;
  where?: Record<string, any>;
  delete?: boolean;
}

/**
 * Unified tenant-scoped query engine
 * Automatically filters queries to accessible tenants based on identity_users/tenant_members
 */
export async function dbQuery(
  table: string,
  authUserId: string,
  opts: QueryOptions = {}
) {
  const supabase = getSupabaseAdmin();
  const tenants = await getAccessibleTenants(authUserId);

  if (tenants.length === 0 && !opts.noTenantFilter) {
    throw new Error("User is not assigned to any tenant.");
  }

  // Default SELECT
  if (opts.selectOnly) {
    let q = supabase.from(table).select(opts.columns ?? "*");

    // Inject automatic tenant filter
    if (opts.noTenantFilter !== true && tenants.length > 0) {
      q = q.in("tenant_id", tenants);
    }

    if (opts.eq) {
      Object.entries(opts.eq).forEach(([k, v]) => {
        q = q.eq(k, v);
      });
    }

    if (opts.order) {
      q = q.order(opts.order.column, { ascending: opts.order.asc ?? true });
    }

    return q;
  }

  // INSERT
  if (opts.insert) {
    const rows = Array.isArray(opts.insert) ? opts.insert : [opts.insert];

    const injected = rows.map((r) => ({
      ...r,
      tenant_id: opts.forceTenantId ?? tenants[0], // default to first accessible tenant
    }));

    return supabase.from(table).insert(injected).select();
  }

  // UPDATE
  if (opts.update) {
    if (!opts.where) {
      throw new Error("UPDATE requires opts.where");
    }

    let q = supabase.from(table).update(opts.update);

    if (!opts.noTenantFilter && tenants.length > 0) {
      q = q.in("tenant_id", tenants);
    }

    Object.entries(opts.where).forEach(([k, v]) => {
      q = q.eq(k, v);
    });

    return q.select();
  }

  // DELETE
  if (opts.delete) {
    if (!opts.where) {
      throw new Error("DELETE requires opts.where");
    }

    let q = supabase.from(table).delete();

    if (!opts.noTenantFilter && tenants.length > 0) {
      q = q.in("tenant_id", tenants);
    }

    Object.entries(opts.where).forEach(([k, v]) => {
      q = q.eq(k, v);
    });

    return q;
  }

  throw new Error("Invalid dbQuery options. Must specify selectOnly, insert, update, or delete.");
}

