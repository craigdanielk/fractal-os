/**
 * MainLayout
 *
 * Deterministic layout shell for Cockpit Lite.
 * Provides:
 *  - top navigation
 *  - consistent spacing + typography
 *  - stable anchor points for future module expansion
 */

import { ReactNode } from "react";
import Link from "next/link";
import { theme } from "@/ui/theme";

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
        margin: "0 auto",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: theme.spacing.md,
        }}
      >
        <Link href="/dashboard" style={theme.navLink}>
          Dashboard
        </Link>
        <Link href="/tasks" style={theme.navLink}>
          Tasks
        </Link>
        <Link href="/time" style={theme.navLink}>
          Time
        </Link>
        <Link href="/economics" style={theme.navLink}>
          Economics
        </Link>
      </nav>

      <main
        style={{
          paddingTop: theme.spacing.md,
        }}
      >
        {children}
      </main>
    </div>
  );
}

