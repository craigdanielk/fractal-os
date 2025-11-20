"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useEconomicsStore } from "../store/economics";
import { mapEconomics } from "../supabase-mapper";
import type { DBEconomics } from "../supabase-types";

export function useRealtimeEconomics(userId: string) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let unsubscribeTable: (() => void) | null = null;
    let unsubscribeBroadcast: (() => void) | null = null;

    realtimeManager.initialize(userId, "User").then(() => {
      unsubscribeTable = realtimeManager.subscribeToTable("economics", (payload) => {
        const store = useEconomicsStore.getState();
        if (payload.eventType === "INSERT" && payload.new) {
          store.upsertModel(mapEconomics(payload.new as DBEconomics));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          store.upsertModel(mapEconomics(payload.new as DBEconomics));
        } else if (payload.eventType === "DELETE" && payload.old) {
          store.removeModel(payload.old.id);
        }
      });

      // Broadcast economics updates
      unsubscribeBroadcast = realtimeManager.subscribeToBroadcast("economics:updated", (payload) => {
        const store = useEconomicsStore.getState();
        if (payload.model) {
          store.upsertModel(mapEconomics(payload.model as DBEconomics));
        }
      });
    });

    return () => {
      unsubscribeTable?.();
      unsubscribeBroadcast?.();
    };
  }, [userId]);
}

