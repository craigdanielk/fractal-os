import { supabase } from "../../lib/supabase";



export async function createTask(input: any, tenantId: string) {

  const { data, error } = await supabase

    .from("tasks")

    .insert([{ ...input, tenant_id: tenantId }])

    .select()

    .single();



  if (error) throw error;

  return data;

}



export async function updateTask(id: string, input: any, tenantId: string) {

  const { data, error } = await supabase

    .from("tasks")

    .update(input)

    .eq("id", id)

    .eq("tenant_id", tenantId)

    .select()

    .single();



  if (error) throw error;

  return data;

}

