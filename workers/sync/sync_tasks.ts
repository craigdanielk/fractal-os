import { nextEvent } from "../../queue/events";

import { writeToSupabase } from "../../kernel/db/write";



export async function syncTasks(tenantId: string) {

  let evt;

  while ((evt = nextEvent(tenantId, "tasks"))) {

    await writeToSupabase("tasks", evt);

  }

}

