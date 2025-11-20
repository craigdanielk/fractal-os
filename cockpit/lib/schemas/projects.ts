import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]).optional(),
  health_score: z.number().min(0).max(100).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateProjectSchema = ProjectSchema.omit({ id: true, created_at: true, updated_at: true }).extend({
  client_id: z.string().uuid().nullable().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type ProjectInput = z.infer<typeof CreateProjectSchema>;
export type ProjectUpdate = z.infer<typeof UpdateProjectSchema>;

