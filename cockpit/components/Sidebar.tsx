"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Tasks", href: "/tasks" },
  { name: "Time", href: "/time" },
  { name: "Clients", href: "/clients" },
  { name: "Economics", href: "/economics" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <div className="w-60 h-full border-r border-white/10 bg-black/20 backdrop-blur-md p-4 flex flex-col gap-2">
      {nav.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`px-4 py-2 rounded-lg transition
            ${path === i.href ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
        >
          {i.name}
        </Link>
      ))}
    </div>
  );
}
