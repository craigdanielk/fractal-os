import { ReactNode } from "react";

export default function GlassPanel({ children }: { children: ReactNode }) {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6">
      {children}
    </div>
  );
}
