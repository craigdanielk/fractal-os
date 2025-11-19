"use client";

import { useEffect, useRef } from "react";
import { lockRecord, unlockRecord, heartbeat } from "../actions/locks";
import { realtimeManager } from "../realtime";

interface UseLockOptions {
  recordType: "task" | "project" | "economics" | "time";
  recordId: string;
  enabled?: boolean;
}

export function useLock({ recordType, recordId, enabled = true }: UseLockOptions) {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !recordId) return;

    // Acquire lock
    lockRecord(recordType, recordId).then((result) => {
      if (result.success) {
        // Broadcast lock acquisition
        realtimeManager.sendBroadcast(`${recordType}:lock`, {
          [`${recordType}Id`]: recordId,
          userId: "current-user", // TODO: Get from auth
          action: "lock",
        });

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          heartbeat(recordType, recordId);
        }, 5000);
      }
    });

    return () => {
      // Release lock
      unlockRecord(recordType, recordId).then(() => {
        realtimeManager.sendBroadcast(`${recordType}:lock`, {
          [`${recordType}Id`]: recordId,
          userId: "current-user",
          action: "unlock",
        });
      });

      // Clear heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [recordType, recordId, enabled]);
}

