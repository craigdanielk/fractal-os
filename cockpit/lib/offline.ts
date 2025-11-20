import Dexie from "dexie";

export const db = new Dexie("fractal_offline_cache");

db.version(1).stores({
  projects: "id, tenant_id, updated_at",
  tasks: "id, project_id, tenant_id, updated_at",
  time_entries: "id, task_id, tenant_id, updated_at",
  economics: "id, tenant_id, updated_at",
  sync_queue: "++local_id, type, entity, payload, timestamp",
});

export async function cachePut(table: string, item: any) {
  await (db as any)[table].put(item);
}

export async function cacheBulkPut(table: string, items: any[]) {
  await (db as any)[table].bulkPut(items);
}

export async function cacheGetAll(table: string) {
  return await (db as any)[table].toArray();
}

export async function queueMutation(type: string, entity: string, payload: any) {
  await (db as any).sync_queue.add({
    type,
    entity,
    payload,
    timestamp: Date.now(),
  });
}

export async function drainQueue(syncFn: (entry: any) => Promise<void>) {
  const queue = await db.sync_queue.toArray();
  for (const entry of queue) {
    await syncFn(entry);
    await db.sync_queue.delete(entry.local_id);
  }
}

