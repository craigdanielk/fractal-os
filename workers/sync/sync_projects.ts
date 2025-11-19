import { nextEvent } from "../../queue/events";

import { writeToSupabase } from "../../kernel/db/write";



export async function syncProjects(tenantId: string) {

  let evt;

  while ((evt = nextEvent(tenantId, "projects"))) {

    await writeToSupabase("projects", evt);

  }

}

