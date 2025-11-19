"use server";

import { supabase } from "@/lib/supabase";
import { CURRENT_TENANT } from "@/lib/tenant";

export async function logTimeAction(data: { taskId: string; projectId: string; hours: number; notes?: string; date?: string }) {
    const { data: entry, error } = await supabase
        .from("time_entries")
        .insert([{
            task_id: data.taskId,
            project_id: data.projectId,
            duration_hours: data.hours,
            notes: data.notes,
            session_date: data.date || new Date().toISOString().split('T')[0],
            tenant_id: CURRENT_TENANT
        }])
        .select()
        .single();
    
    if (error) throw error;
    return entry;
}
