"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useTaskStore } from "../store/tasks";
import { mapTask } from "../supabase-mapper";
import type { DBTask } from "../supabase-types";

// Stabilize store access by using getState outside of React hooks to avoid stale closures

export function useRealtimeTasks(userId: string) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!userId || initializedRef.current) return;
    initializedRef.current = true;

    let unsubscribeTable: (() => void) | null = null;
    let unsubscribeLock: (() => void) | null = null;

    // Initialize realtime connection
    realtimeManager.initialize(userId, "User").then(() => {
      // Subscribe to tasks table changes
      unsubscribeTable = realtimeManager.subscribeToTable("tasks", (payload) => {
        const store = useTaskStore.getState();
        if (payload.eventType === "INSERT" && payload.new) {
          store.upsertTask(mapTask(payload.new as DBTask));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          store.upsertTask(mapTask(payload.new as DBTask));
        } else if (payload.eventType === "DELETE" && payload.old) {
          store.removeTask(payload.old.id);
        }
      });

      // Subscribe to lock changes via broadcast
      unsubscribeLock = realtimeManager.subscribeToBroadcast("task:lock", (payload) => {
        const store = useTaskStore.getState();
        const { taskId, userId: lockUserId, action } = payload;
        if (action === "lock") {
          store.lockTask(taskId, lockUserId);
        } else if (action === "unlock") {
          store.unlockTask(taskId);
        }
      });
    });

    return () => {
      unsubscribeTable?.();
      unsubscribeLock?.();
    };
  }, [userId]);
}
