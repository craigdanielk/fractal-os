import { ReactNode } from "react";

export default function GlassPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        background: "var(--glass-bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--glass-border)",
        padding: "2rem",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </div>
  );
}
