import { supabase } from "../lib/supabase";

import { CURRENT_TENANT } from "../lib/tenant";



export async function getTimeEntries(tenantId: string = CURRENT_TENANT) {

  const { data, error } = await supabase

    .from("time_entries")

    .select("*")

    .eq("tenant_id", tenantId)

    .order("session_date", { ascending: false });



  if (error) throw error;

  return data || [];

}

