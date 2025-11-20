"use client";

import { useEffect, useState } from "react";
import { usePresence } from "../lib/hooks/usePresence";
import { useRealtimeTasks } from "../lib/hooks/useRealtimeTasks";
import { useRealtimeProjects } from "../lib/hooks/useRealtimeProjects";
import { useRealtimeEconomics } from "../lib/hooks/useRealtimeEconomics";
import { useCrossTabSync } from "../lib/hooks/useCrossTabSync";
import { CollabProvider } from "../lib/collab/CollabProvider";
import { getCurrentTenant } from "../lib/auth/tenant";
import { getCurrentAuthUserId } from "../lib/auth/user";
import { startHeartbeat, stopHeartbeat } from "../lib/telemetry";

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    async function init() {
      const tenantContext = await getCurrentTenant();
      const authUserId = await getCurrentAuthUserId();
      
      if (tenantContext && authUserId) {
        setTenantId(tenantContext.tenantId);
        setUserId(authUserId);
        setUserName(tenantContext.userId); // Use userId as name for now
        
        // Start telemetry heartbeat
        startHeartbeat({
          tenantId: tenantContext.tenantId,
          userId: authUserId,
        });
      }
    }
    init();
    
    return () => {
      stopHeartbeat();
    };
  }, []);

  if (!tenantId || !userId) {
    return <>{children}</>;
  }

  return (
    <CollabProvider tenantId={tenantId} userId={userId} userName={userName}>
      <RealtimeHooks tenantId={tenantId} userId={userId} userName={userName} />
      {children}
    </CollabProvider>
  );
}

function RealtimeHooks({
  tenantId,
  userId,
  userName,
}: {
  tenantId: string;
  userId: string;
  userName: string;
}) {
  usePresence(tenantId, userId, userName);
  useRealtimeTasks(tenantId, userId);
  useRealtimeProjects(tenantId, userId);
  useRealtimeEconomics(tenantId, userId);
  useCrossTabSync(tenantId);

  return null;
}

