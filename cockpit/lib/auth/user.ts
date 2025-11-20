"use server";

import { getSupabaseServer } from "../supabase-client";

/**
 * Get the current authenticated user ID
 * Returns null if not authenticated
 */
export async function getCurrentAuthUserId(): Promise<string | null> {
  try {
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

