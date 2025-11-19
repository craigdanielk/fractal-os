import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Callback = (payload: any) => void;
const channels: Record<string, Callback[]> = {};

export function subscribe(table: string, cb: Callback) {
  if (!channels[table]) channels[table] = [];

  channels[table].push(cb);

  return supabase
    .channel(`realtime:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        for (const fn of channels[table]) fn(payload);
      }
    )
    .subscribe();
}

export function triggerLocal(table: string, payload: any) {
  if (!channels[table]) return;
  for (const fn of channels[table]) fn(payload);
}
