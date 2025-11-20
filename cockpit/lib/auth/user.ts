"use server";

import { getSupabaseServer } from "../supabase-client-server";
import { headers } from "next/headers";

/**
 * Get the current authenticated user ID
 * Returns null if not authenticated
 */
export async function getCurrentAuthUserId(): Promise<string | null> {
  try {
    // Check for dev mode headers first
    const headersList = headers();
    const devMode = headersList.get("x-dev-mode");
    
    if (devMode === "true") {
      return headersList.get("x-dev-user-id") || "dev-user-0001";
    }

    const supabase = getSupabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.error("Error getting auth user ID:", error);
    return null;
  }
}

