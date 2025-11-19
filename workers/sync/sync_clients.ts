import { nextEvent } from "../../queue/events";

import { writeToSupabase } from "../../kernel/db/write";



export async function syncClients(tenantId: string) {

  let evt;

  while ((evt = nextEvent(tenantId, "clients"))) {

    await writeToSupabase("clients", evt);

  }

}

