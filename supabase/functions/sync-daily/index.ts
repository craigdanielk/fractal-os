import { serve } from "std/server";

import { runDailyDeepSync } from "./logic";



serve(async () => {

  await runDailyDeepSync();

  return new Response("ok");

});

