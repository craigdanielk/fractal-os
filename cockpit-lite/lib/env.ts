/**
 * Environment Variable Validation
 * Validates all required environment variables at runtime
 */

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Database
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
  
  // JWT
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
  
  // Environment
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || "production",
} as const;

export function validateEnv() {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value && key !== "NEXT_PUBLIC_ENV") {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
  
  return requiredEnvVars;
}

export const env = validateEnv();

export const isProduction = env.NEXT_PUBLIC_ENV === "production";
export const isDevelopment = env.NEXT_PUBLIC_ENV === "development";

