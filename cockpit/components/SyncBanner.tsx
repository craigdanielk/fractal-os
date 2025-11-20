"use client";

import { useEffect, useState } from "react";
import { syncAll, setOnlineState } from "@/services/sync";

/**
 * Sync Banner Component
 * Shows when sync is in progress or when resuming from offline
 */
export function SyncBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setOnlineState(true);
      setIsSyncing(true);
      
      try {
        await syncAll();
        setLastSync(new Date());
      } catch (error) {
        console.error("Sync failed:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOnlineState(false);
    };

    setIsOnline(navigator.onLine);
    setOnlineState(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !isSyncing && lastSync) {
    return null; // Don't show banner when synced
  }

  if (!isOnline) {
    return (
      <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm">
        ⚠️ You're offline. Changes will be synced when you reconnect.
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="bg-blue-500 text-white px-4 py-2 text-center text-sm">
        🔄 Syncing changes...
      </div>
    );
  }

  return null;
}

