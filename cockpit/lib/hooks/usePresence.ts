"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";
import { usePresenceStore } from "../store/presence";

export function usePresence(
  userId: string,
  userName: string
) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let unsubscribePresence: (() => void) | null = null;

    realtimeManager.initialize(userId, userName).then(() => {
      // Subscribe to presence changes via broadcast
      unsubscribePresence = realtimeManager.subscribeToBroadcast("presence", (state) => {
        const store = usePresenceStore.getState();
        const users = Object.values(state).flat() as any[];
        store.setUsers(users);
      });

      // Update presence when module/activity changes
      const updatePresence = (module: string | null, activity: "viewing" | "editing" | "idle") => {
        realtimeManager.updatePresence({ module, activity });
      };

      // Expose update function globally for components
      (window as any).updatePresence = updatePresence;
    });

    return () => {
      unsubscribePresence?.();
      delete (window as any).updatePresence;
    };
  }, [userId, userName]);
}

