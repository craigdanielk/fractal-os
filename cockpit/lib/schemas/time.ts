import { z } from "zod";

export const TimeEntrySchema = z.object({
  id: z.string().uuid(),
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
  duration_hours: z.number().min(0),
  notes: z.string().nullable().optional(),
  session_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateTimeEntrySchema = TimeEntrySchema.omit({ id: true, user_id: true, created_at: true, updated_at: true });

export const UpdateTimeEntrySchema = CreateTimeEntrySchema.partial();

export type TimeEntryInput = z.infer<typeof CreateTimeEntrySchema>;
export type TimeEntryUpdate = z.infer<typeof UpdateTimeEntrySchema>;

