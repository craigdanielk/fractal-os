"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("fractal-theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("fractal-theme", theme);
  }, [theme]);

  return (
    <div className="flex gap-2">
      {["light", "dark", "soft"].map(t => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded border ${theme === t ? "bg-black text-white" : ""}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
