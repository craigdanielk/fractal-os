"use server";

import { createTimeEntry } from "@/services/notion";

export async function logTimeAction(data: { taskId: string; projectId: string; hours: number; notes?: string; date?: string }) {
    return await createTimeEntry(data);
}
