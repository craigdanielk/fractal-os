import { FractalEvent, NormalizedEvent } from "./types";



export function normalizeDelta(evt: FractalEvent): NormalizedEvent | null {

  if (evt.type === "DELETE") {

    return {

      tenantId: evt.tenantId,

      table: evt.table,

      action: "delete",

      diff: {},

      id: evt.old?.id,

      ts: evt.ts,

    };

  }



  const diff: any = {};

  const old = evt.old || {};

  const neu = evt.new || {};

  Object.keys(neu).forEach(key => {

    if (JSON.stringify(old[key]) !== JSON.stringify(neu[key])) {

      diff[key] = neu[key];

    }

  });



  if (Object.keys(diff).length === 0) return null;



  return {

    tenantId: evt.tenantId,

    table: evt.table,

    action: evt.type === "INSERT" ? "create" : "update",

    diff,

    id: neu.id,

    ts: evt.ts,

  };

}

