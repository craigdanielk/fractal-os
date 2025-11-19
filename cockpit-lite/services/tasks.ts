import { supabase } from "../lib/supabase";

import { CURRENT_TENANT } from "../lib/tenant";



export async function getTasks(tenantId: string = CURRENT_TENANT) {

  const { data, error } = await supabase

    .from("tasks")

    .select("*")

    .eq("tenant_id", tenantId)

    .order("updated_at", { ascending: false });



  if (error) throw error;

  return data || [];

}

