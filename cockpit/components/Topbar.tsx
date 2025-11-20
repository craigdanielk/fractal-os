"use client";

import Brand from "./Brand";
import TenantSwitcher from "./TenantSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <Brand />
      <div className="flex items-center gap-4">
        <TenantSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}

