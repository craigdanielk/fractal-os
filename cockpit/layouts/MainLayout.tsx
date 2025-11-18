

/**
 * MainLayout
 *
 * Provides consistent page structure for the Cockpit:
 *  - Top navigation
 *  - Content container
 *
 * This is intentionally minimal for the Lite Cockpit.
 */

import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "1.5rem" }}>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem"
        }}
      >
        <a href="/dashboard">Dashboard</a>
        <a href="/tasks">Tasks</a>
        <a href="/time">Time</a>
        <a href="/economics">Economics</a>
      </nav>

      <main>{children}</main>
    </div>
  );
}