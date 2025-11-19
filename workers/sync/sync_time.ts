import { nextEvent } from "../../queue/events";

import { writeToSupabase } from "../../kernel/db/write";



export async function syncTime(tenantId: string) {

  let evt;

  while ((evt = nextEvent(tenantId, "time_entries"))) {

    await writeToSupabase("time_entries", evt);

  }

}

