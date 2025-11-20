"use server";

import { createTimeEntry } from "@/services/time";

export async function logTimeAction(data: {
  taskId: string;
  hours: number;
  notes?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}) {
  return createTimeEntry({
    task_id: data.taskId,
    duration_hours: data.hours,
    notes: data.notes,
    session_date: data.date || new Date().toISOString().split("T")[0],
    start_time: data.startTime || null,
    end_time: data.endTime || null,
  });
}
