import { createClient } from "@supabase/supabase-js";

import { NormalizedEvent } from "../events/types";



const supabase = createClient(

  process.env.SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

);



export async function writeToSupabase(table: string, evt: NormalizedEvent) {

  if (evt.action === "delete") {

    await supabase.from(table).delete().eq("id", evt.id);

    return;

  }



  await supabase.from(table).upsert({

    id: evt.id,

    tenant_id: evt.tenantId,

    ...evt.diff,

    updated_at: new Date(evt.ts).toISOString(),

  });

}

