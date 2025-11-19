import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";



if (!process.env.SUPABASE_DB_URL) {

  throw new Error("Missing SUPABASE_DB_URL");

}



const queryClient = postgres(process.env.SUPABASE_DB_URL, { prepare: false });

export const db = drizzle(queryClient);
