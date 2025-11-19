import { nextEvent } from "../../queue/events";

import { writeToSupabase } from "../../kernel/db/write";



export async function syncEconomics(tenantId: string) {

  let evt;

  while ((evt = nextEvent(tenantId, "economics_model"))) {

    await writeToSupabase("economics_model", evt);

  }

}

