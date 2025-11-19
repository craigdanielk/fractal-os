import { ingest } from "../../kernel/events";



export function bootstrapRealtime(client: any, tenantId: string) {

  const tables = ["clients", "projects", "tasks", "time_entries", "economics_model"];



  tables.forEach(table => {

    client

      .channel(`realtime:${table}:${tenantId}`)

      .on("postgres_changes", { event: "*", schema: "public", table }, payload => {

        ingest({

          tenantId,

          table,

          type: payload.eventType,

          old: payload.old,

          new: payload.new,

          ts: Date.now(),

        });

      })

      .subscribe();

  });

}

