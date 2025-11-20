"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { useProjectStore } from "../store/projects";
import { mapProject } from "../supabase-mapper";
import type { DBProject } from "../supabase-types";

export function useRealtimeProjects(tenantId: string, userId: string) {
  const { setProjects, upsertProject, removeProject } = useProjectStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    realtimeManager.initialize(tenantId, userId, "User").then(() => {
      realtimeManager.subscribeToTable("projects", (payload) => {
        if (payload.eventType === "INSERT" && payload.new) {
          upsertProject(mapProject(payload.new as DBProject));
        } else if (payload.eventType === "UPDATE" && payload.new) {
          upsertProject(mapProject(payload.new as DBProject));
        } else if (payload.eventType === "DELETE" && payload.old) {
          removeProject(payload.old.id);
        }
      });

      realtimeManager.subscribeToBroadcast("project:lock", (payload) => {
        const { projectId, userId: lockUserId, action } = payload;
        if (action === "lock") {
          useProjectStore.getState().lockProject(projectId, lockUserId);
        } else if (action === "unlock") {
          useProjectStore.getState().unlockProject(projectId);
        }
      });
    });
  }, [tenantId, userId, upsertProject, removeProject]);
}

