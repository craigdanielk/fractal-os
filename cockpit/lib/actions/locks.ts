"use server";

import { getSupabaseServer } from "../supabase-client";
import { getCurrentAuthUserId } from "../auth/user";
import { getCurrentTenant } from "../auth/tenant";

export type LockRecordType = "task" | "project" | "economics" | "time";

/**
 * Lock a record for editing
 */
export async function lockRecord(
  recordType: LockRecordType,
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUserId = await getCurrentAuthUserId();
    if (!authUserId) {
      return { success: false, error: "Not authenticated" };
    }

    const tenantContext = await getCurrentTenant();
    if (!tenantContext) {
      return { success: false, error: "No tenant context" };
    }

    const supabase = getSupabaseServer();

    // Clean up expired locks first
    await supabase
      .from("editing_locks")
      .delete()
      .lt("expires_at", new Date().toISOString());

    // Try to acquire lock
    const { error } = await supabase
      .from("editing_locks")
      .insert({
        tenant_id: tenantContext.tenantId,
        record_type: recordType,
        record_id: recordId,
        locked_by: authUserId,
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds
      });

    if (error) {
      if (error.code === "23505") {
        // Lock already exists
        return { success: false, error: "Record is locked by another user" };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Unlock a record
 */
export async function unlockRecord(
  recordType: LockRecordType,
  recordId: string
): Promise<{ success: boolean }> {
  try {
    const authUserId = await getCurrentAuthUserId();
    if (!authUserId) {
      return { success: false };
    }

    const tenantContext = await getCurrentTenant();
    if (!tenantContext) {
      return { success: false };
    }

    const supabase = getSupabaseServer();

    await supabase
      .from("editing_locks")
      .delete()
      .eq("tenant_id", tenantContext.tenantId)
      .eq("record_type", recordType)
      .eq("record_id", recordId)
      .eq("locked_by", authUserId);

    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Send heartbeat to extend lock
 */
export async function heartbeat(
  recordType: LockRecordType,
  recordId: string
): Promise<{ success: boolean }> {
  try {
    const authUserId = await getCurrentAuthUserId();
    if (!authUserId) {
      return { success: false };
    }

    const tenantContext = await getCurrentTenant();
    if (!tenantContext) {
      return { success: false };
    }

    const supabase = getSupabaseServer();

    const { error } = await supabase
      .from("editing_locks")
      .update({
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(),
      })
      .eq("tenant_id", tenantContext.tenantId)
      .eq("record_type", recordType)
      .eq("record_id", recordId)
      .eq("locked_by", authUserId);

    return { success: !error };
  } catch {
    return { success: false };
  }
}

