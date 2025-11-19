import { supabase } from "../../lib/supabase";



export async function createProject(input: any, tenantId: string) {

  const { data, error } = await supabase

    .from("projects")

    .insert([{ ...input, tenant_id: tenantId }])

    .select()

    .single();



  if (error) throw error;

  return data;

}



export async function updateProject(id: string, input: any, tenantId: string) {

  const { data, error } = await supabase

    .from("projects")

    .update(input)

    .eq("id", id)

    .eq("tenant_id", tenantId)

    .select()

    .single();



  if (error) throw error;

  return data;

}

