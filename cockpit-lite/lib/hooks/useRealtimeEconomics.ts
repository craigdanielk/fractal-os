"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useEconomicsStore } from "../store/economics";
import { mapEconomicsModel } from "../supabase-mapper";
import type { DBEconomicsModel } from "../supabase-types";

export function useRealtimeEconomics(tenantId: string, userId: string) {
  const { setModels, upsertModel, removeModel } = useEconomicsStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    realtimeManager.initialize(tenantId, userId, "User").then(() => {
      realtimeManager.subscribeToTable("economics_model", (payload) => {
        if (payload.eventType === "INSERT" && payload.new) {
          upsertModel(mapEconomicsModel(payload.new as DBEconomicsModel));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          upsertModel(mapEconomicsModel(payload.new as DBEconomicsModel));
        } else if (payload.eventType === "DELETE" && payload.old) {
          removeModel(payload.old.id);
        }
      });

      // Broadcast economics updates
      realtimeManager.subscribeToBroadcast("economics:updated", (payload) => {
        if (payload.model) {
          upsertModel(mapEconomicsModel(payload.model as DBEconomicsModel));
        }
      });
    });
  }, [tenantId, userId, upsertModel, removeModel]);
}

