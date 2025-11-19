"use client";

import { cacheBulkPut, cacheGetAll, queueMutation, drainQueue } from "../lib/offline";
import { supabase } from "../lib/supabase-client-browser";
import { cacheInvalidate } from "../lib/cache";

let online = true;

export function setOnlineState(state: boolean) {
  online = state;
}

export async function syncTable(table: string, supabaseTable: string) {
  if (!online) return;

  const { data, error } = await supabase.from(supabaseTable).select("*");
  if (!error && data) {
    await cacheBulkPut(table, data);
  }
}

export async function syncAll() {
  if (!online) return;

  await syncTable("projects", "projects");
  await syncTable("tasks", "tasks");
  await syncTable("time_entries", "time_entries");
  await syncTable("economics", "economics_model");
  
  // Invalidate memory cache after sync
  cacheInvalidate("projects:");
  cacheInvalidate("tasks:");
  cacheInvalidate("time:");
  cacheInvalidate("economics:");

  await drainQueue(async (entry) => {
    await supabase.from(entry.entity).insert(entry.payload);
  });
}

export async function offlineSafeInsert(entity: string, payload: any) {
  if (online) {
    await supabase.from(entity).insert(payload);
  } else {
    await queueMutation("insert", entity, payload);
  }
}
