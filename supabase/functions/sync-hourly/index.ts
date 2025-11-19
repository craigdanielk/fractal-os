import { serve } from "std/server";

import { runHourlyDeltaRepair } from "./logic";



serve(async () => {

  await runHourlyDeltaRepair();

  return new Response("ok");

});

