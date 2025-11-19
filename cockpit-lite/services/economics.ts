import { supabase } from "../lib/supabase";

import { CURRENT_TENANT } from "../lib/tenant";



export async function getEconomics(tenantId: string = CURRENT_TENANT) {

  const { data, error } = await supabase

    .from("economics_model")

    .select("*")

    .eq("tenant_id", tenantId);



  if (error) throw error;

  return data || [];

}

