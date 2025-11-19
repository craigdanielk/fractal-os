import { supabase } from "../utils/supabase.client";

import { LiveState } from "./state";



export function initRealtimeWorkers() {

  // Projects

  supabase

    .channel("projects")

    .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {

      LiveState.invalidate("projects");

    })

    .subscribe();



  // Tasks

  supabase

    .channel("tasks")

    .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {

      LiveState.invalidate("tasks");

    })

    .subscribe();



  // Time

  supabase

    .channel("time_entries")

    .on("postgres_changes", { event: "*", schema: "public", table: "time_entries" }, (payload) => {

      LiveState.invalidate("time");

    })

    .subscribe();

}

