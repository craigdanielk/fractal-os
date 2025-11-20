import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid().nullable().optional(),
  parent_task_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high"]).nullable().optional(),
  due_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true, created_at: true, updated_at: true }).extend({
  project_id: z.string().uuid().nullable().optional(),
  parent_task_id: z.string().uuid().nullable().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type TaskInput = z.infer<typeof CreateTaskSchema>;
export type TaskUpdate = z.infer<typeof UpdateTaskSchema>;

