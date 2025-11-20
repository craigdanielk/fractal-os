"use client";

import { useEffect } from "react";
import { usePresence } from "../lib/hooks/usePresence";
import { useRealtimeTasks } from "../lib/hooks/useRealtimeTasks";
import { useRealtimeProjects } from "../lib/hooks/useRealtimeProjects";
import { useRealtimeEconomics } from "../lib/hooks/useRealtimeEconomics";
import { useCrossTabSync } from "../lib/hooks/useCrossTabSync";
import { CollabProvider } from "../lib/collab/CollabProvider";
import { startHeartbeat, stopHeartbeat } from "../lib/telemetry";

interface RealtimeProviderProps {
  children: React.ReactNode;
  userId: string;
  userName?: string;
}

export function RealtimeProvider({ 
  children, 
  userId, 
  userName = "User" 
}: RealtimeProviderProps) {
  useEffect(() => {
    // Start telemetry heartbeat
    startHeartbeat({
      userId,
    });
    
    return () => {
      stopHeartbeat();
    };
  }, [userId]);

  if (!userId) {
    return <>{children}</>;
  }

  return (
    <CollabProvider userId={userId} userName={userName}>
      <RealtimeHooks userId={userId} userName={userName} />
      {children}
    </CollabProvider>
  );
}

function RealtimeHooks({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  usePresence(userId, userName);
  useRealtimeTasks(userId);
  useRealtimeProjects(userId);
  useRealtimeEconomics(userId);
  useCrossTabSync();

  return null;
}

