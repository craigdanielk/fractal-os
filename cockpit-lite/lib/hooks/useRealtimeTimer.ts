"use client";

import { useEffect, useRef } from "react";
import { realtimeManager } from "../realtime";

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  duration: number;
}

export function useRealtimeTimer(tenantId: string, userId: string) {
  const timerRef = useRef<TimerState>({
    isRunning: false,
    startTime: null,
    duration: 0,
  });

  useEffect(() => {
    realtimeManager.initialize(tenantId, userId, "User").then(() => {
      // Subscribe to time entry changes
      realtimeManager.subscribeToTable("time_entries", (payload) => {
        // Handle timer sync events
        if (payload.eventType === "INSERT" && payload.new) {
          // New time entry created
        } else if (payload.eventType === "UPDATE" && payload.new) {
          // Time entry updated
        }
      });

      // Subscribe to timer control broadcasts
      realtimeManager.subscribeToBroadcast("timer:control", (payload) => {
        const { action, userId: senderId, taskId } = payload;
        
        if (senderId === userId) return; // Ignore own actions
        
        if (action === "start") {
          timerRef.current = {
            isRunning: true,
            startTime: Date.now(),
            duration: 0,
          };
        } else if (action === "pause") {
          if (timerRef.current.isRunning) {
            timerRef.current.duration += Date.now() - (timerRef.current.startTime || 0);
            timerRef.current.isRunning = false;
            timerRef.current.startTime = null;
          }
        } else if (action === "stop") {
          timerRef.current = {
            isRunning: false,
            startTime: null,
            duration: 0,
          };
        }
      });
    });
  }, [tenantId, userId]);

  return timerRef.current;
}

