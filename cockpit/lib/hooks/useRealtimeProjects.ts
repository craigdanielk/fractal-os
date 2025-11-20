"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useProjectStore } from "../store/projects";
import { mapProject } from "../supabase-mapper";
import type { DBProject } from "../supabase-types";

export function useRealtimeProjects(userId: string) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let unsubscribeTable: (() => void) | null = null;
    let unsubscribeLock: (() => void) | null = null;

    realtimeManager.initialize(userId, "User").then(() => {
      unsubscribeTable = realtimeManager.subscribeToTable("projects", (payload) => {
        const store = useProjectStore.getState();
        if (payload.eventType === "INSERT" && payload.new) {
          store.upsertProject(mapProject(payload.new as DBProject));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          store.upsertProject(mapProject(payload.new as DBProject));
        } else if (payload.eventType === "DELETE" && payload.old) {
          store.removeProject(payload.old.id);
        }
      });

      unsubscribeLock = realtimeManager.subscribeToBroadcast("project:lock", (payload) => {
        const store = useProjectStore.getState();
        const { projectId, userId: lockUserId, action } = payload;
        if (action === "lock") {
          store.lockProject(projectId, lockUserId);
        } else if (action === "unlock") {
          store.unlockProject(projectId);
        }
      });
    });

    return () => {
      unsubscribeTable?.();
      unsubscribeLock?.();
    };
  }, [userId]);
}

