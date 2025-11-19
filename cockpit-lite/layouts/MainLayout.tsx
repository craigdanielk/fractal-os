/**
 * MainLayout
 *
 * Deterministic layout shell for Cockpit Lite.
 * Provides:
 *  - top navigation with active route indicators
 *  - consistent spacing + typography
 *  - responsive design (mobile + desktop)
 *  - stable anchor points for future module expansion
 */

"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/ui/theme";
import { syncAll, setOnlineState } from "../services/sync";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
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
    <div
      style={{
        minHeight: "100vh",
        background: theme.palettes[theme.mode].bg,
        transition: "0.35s ease all",
        padding: theme.spacing.lg,
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          <Link href="/dashboard" style={theme.navButton(theme.palettes[theme.mode])}>
            Dashboard
          </Link>
          <Link href="/tasks" style={theme.navButton(theme.palettes[theme.mode])}>
            Tasks
          </Link>
          <Link href="/time" style={theme.navButton(theme.palettes[theme.mode])}>
            Time
          </Link>
          <Link href="/economics" style={theme.navButton(theme.palettes[theme.mode])}>
            Economics
          </Link>
        </div>

        <button
          onClick={() => {
            const modes = ["light", "dark", "blue"];
            const index = modes.indexOf(theme.mode);
            theme.mode = modes[(index + 1) % modes.length];
            document.body.dataset.theme = theme.mode;
          }}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "14px",
            border: `1px solid ${theme.palettes[theme.mode].border}`,
            background: theme.palettes[theme.mode].glass,
            backdropFilter: theme.palettes[theme.mode].blur,
            cursor: "pointer",
          }}
        >
          {theme.mode === "light" ? "🌞 Light" : theme.mode === "dark" ? "🌙 Dark" : "💎 Blue"}
        </button>
      </nav>

      <main style={{ marginTop: theme.spacing.md }}>
        {children}
      </main>
    </div>
  );
}

