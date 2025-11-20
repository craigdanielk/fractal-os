"use client";

import { ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { syncAll, setOnlineState } from "../services/sync";

export default function MainLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Set initial online state
    setOnlineState(navigator.onLine);

    const handleOnline = async () => {
      setOnlineState(true);
      try {
        await syncAll();
        console.log("Sync completed");
      } catch (e) {
        console.error("Sync failed:", e);
      }
    };

    const handleOffline = () => {
      setOnlineState(false);
      console.log("Offline mode active");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
}
