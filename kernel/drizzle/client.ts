import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";



if (!process.env.SUPABASE_DB_URL) {

  throw new Error("Missing SUPABASE_DB_URL");

}



const queryClient = postgres(process.env.SUPABASE_DB_URL, { prepare: false });

export const db = drizzle(queryClient);



/**

 * Set tenant context for RLS policies

 * This sets the tenant_id as a session variable for RLS policies to check

 * Note: For Supabase, this should be set via JWT claims. For direct DB connections,

 * we use a custom GUC variable that RLS policies can read.

 */

export async function setTenantContext(tenantId: string) {

  await queryClient`SET LOCAL app.tenant_id = ${tenantId}`;

}
