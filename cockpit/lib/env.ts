import { z } from "zod";

export const env = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_DB_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string()
}).parse(process.env);

export function validateEnv() {
  // Zod already validates on parse, this is just for compatibility
  return env;
}

