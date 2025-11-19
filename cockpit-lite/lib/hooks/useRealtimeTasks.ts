"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useTaskStore } from "../store/tasks";
import { mapTask } from "../supabase-mapper";
import type { DBTask } from "../supabase-types";

export function useRealtimeTasks(tenantId: string, userId: string) {
  const { setTasks, upsertTask, removeTask } = useTaskStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!tenantId || !userId || initializedRef.current) return;
    initializedRef.current = true;

    let cleanup: (() => void) | null = null;

    // Initialize realtime connection
    realtimeManager.initialize(tenantId, userId, "User").then(() => {
      // Subscribe to tasks table changes
      const unsubscribeTable = realtimeManager.subscribeToTable("tasks", (payload) => {
        if (payload.eventType === "INSERT" && payload.new) {
          upsertTask(mapTask(payload.new as DBTask));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          upsertTask(mapTask(payload.new as DBTask));
        } else if (payload.eventType === "DELETE" && payload.old) {
          removeTask(payload.old.id);
        }
      });

      // Subscribe to lock changes via broadcast
      const unsubscribeLock = realtimeManager.subscribeToBroadcast("task:lock", (payload) => {
        const { taskId, userId: lockUserId, action } = payload;
        if (action === "lock") {
          useTaskStore.getState().lockTask(taskId, lockUserId);
        } else if (action === "unlock") {
          useTaskStore.getState().unlockTask(taskId);
        }
      });

      cleanup = () => {
        unsubscribeTable?.();
        unsubscribeLock?.();
      };
    });

    return () => {
      cleanup?.();
    };
  }, [tenantId, userId, upsertTask, removeTask]);
}

