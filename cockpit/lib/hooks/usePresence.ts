"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { usePresenceStore } from "../store/presence";

export function usePresence(
  tenantId: string,
  userId: string,
  userName: string
) {
  const { setUsers, updateUser, removeUser } = usePresenceStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    realtimeManager.initialize(tenantId, userId, userName).then(() => {
      // Subscribe to presence changes
      realtimeManager.subscribeToPresence((state) => {
        const users = Object.values(state).flat() as any[];
        setUsers(users);
      });

      // Update presence when module/activity changes
      const updatePresence = (module: string | null, activity: "viewing" | "editing" | "idle") => {
        realtimeManager.updatePresence({ module, activity });
      };

      // Expose update function globally for components
      (window as any).updatePresence = updatePresence;
    });

    return () => {
      delete (window as any).updatePresence;
    };
  }, [tenantId, userId, userName, setUsers]);
}

