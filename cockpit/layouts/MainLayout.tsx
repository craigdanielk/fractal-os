/****
 * MainLayout
 *
 * Deterministic layout shell for Cockpit Lite.
 * Provides:
 *  - top navigation
 *  - consistent spacing + typography
 *  - stable anchor points for future module expansion
 */

import { ReactNode } from "react";
import { theme } from "../ui/theme";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        color: theme.colors.text,
        padding: theme.spacing.lg,
        maxWidth: 1200,
        margin: "0 auto"
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: theme.spacing.md
        }}
      >
        <a style={theme.navLink} href="/dashboard">Dashboard</a>
        <a style={theme.navLink} href="/tasks">Tasks</a>
        <a style={theme.navLink} href="/time">Time</a>
        <a style={theme.navLink} href="/economics">Economics</a>
      </nav>

      <main
        style={{
          paddingTop: theme.spacing.md
        }}
      >
        {children}
      </main>
    </div>
  );
}