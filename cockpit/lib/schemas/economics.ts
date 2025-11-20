import { z } from "zod";

export const EconomicsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).nullable().optional(),
  base_rate: z.number().nullable().optional(),
  direct_expenses: z.number().nullable().optional(),
  margin_targets: z.number().nullable().optional(),
  overhead_pct: z.number().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateEconomicsSchema = EconomicsSchema.omit({ id: true, created_at: true, updated_at: true });

export const UpdateEconomicsSchema = CreateEconomicsSchema.partial();

export type EconomicsInput = z.infer<typeof CreateEconomicsSchema>;
export type EconomicsUpdate = z.infer<typeof UpdateEconomicsSchema>;

