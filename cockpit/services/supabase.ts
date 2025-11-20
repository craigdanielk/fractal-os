"use client";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function logAudit(event: string, payload: any = {}) {
  try {
    // Get current user context
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      event,
      payload,
      ts: new Date().toISOString(),
      user_id: user?.id || null,
    });
  } catch (error) {
    // Silently fail audit logging to not break application flow
    console.error("Audit log failed:", error);
  }
}

