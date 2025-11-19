import { QueueRecord } from "./types";



const queues: Record<string, QueueRecord[]> = {};



export function enqueueEvent(evt: QueueRecord | any) {

  const key = `${evt.tenantId}:${evt.table}`;

  if (!queues[key]) queues[key] = [];

  queues[key].push({ ...evt, retries: 0 });

}



export function nextEvent(tenantId: string, table: string) {

  const key = `${tenantId}:${table}`;

  const queue = queues[key];

  if (!queue || queue.length === 0) return null;

  return queue.shift();

}

