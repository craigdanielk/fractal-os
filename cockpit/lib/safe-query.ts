"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * Get Supabase client for server-side admin operations
 */
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
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
  eq?: Record<string, any>;
  order?: {
    column: string;
    asc?: boolean;
  };
  insert?: any | any[];
  update?: Record<string, any>;
  where?: Record<string, any>;
  delete?: boolean;
}

/**
 * Unified query engine (single-tenant)
 */
export async function dbQuery(
  table: string,
  authUserId: string,
  opts: QueryOptions = {}
) {
  const supabase = getSupabaseAdmin();

  // Default SELECT
  if (opts.selectOnly) {
    let q = supabase.from(table).select(opts.columns ?? "*");

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
    return supabase.from(table).insert(rows).select();
  }

  // UPDATE
  if (opts.update) {
    if (!opts.where) {
      throw new Error("UPDATE requires opts.where");
    }

    let q = supabase.from(table).update(opts.update);

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

    Object.entries(opts.where).forEach(([k, v]) => {
      q = q.eq(k, v);
    });

    return q;
  }

  throw new Error("Invalid dbQuery options. Must specify selectOnly, insert, update, or delete.");
}

