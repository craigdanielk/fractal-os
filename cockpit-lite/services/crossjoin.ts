import { supabase } from "./supabase";

export async function getProjectsWithTasks(clientId?: string) {
  let q = supabase.from("projects").select(`
      *,
      tasks:tasks(*)
  `);

  if (clientId) q = q.eq("client_id", clientId);

  const { data, error } = await q;
  if (error) throw error;
  return data;
}

