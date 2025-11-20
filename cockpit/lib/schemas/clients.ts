import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateClientSchema = ClientSchema.omit({ id: true, created_at: true, updated_at: true });

export const UpdateClientSchema = CreateClientSchema.partial();

export type ClientInput = z.infer<typeof CreateClientSchema>;
export type ClientUpdate = z.infer<typeof UpdateClientSchema>;

