"use client";

import { useEffect, useState } from "react";

const modes = ["light", "dark", "blue"] as const;

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.className = `theme-${saved}`;
    }
  }, []);

  const cycle = () => {
    const index = modes.indexOf(theme as any);
    const next = modes[(index + 1) % modes.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.className = `theme-${next}`;
  };

  return (
    <button onClick={cycle} className="theme-toggle">
      {theme === "light" && "Light"}
      {theme === "dark" && "Dark"}
      {theme === "blue" && "Blue"}
    </button>
  );
}

