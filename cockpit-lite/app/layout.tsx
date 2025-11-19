import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata = {
  title: "FractalOS Cockpit Lite",
  description: "Unified cockpit interface",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = cookies().get("tenant_id")?.value || "fractal-root";
  
  // Get session for tenant-aware auth (mock for now)
  const session = {
    user: {
      tenant_id: tenant,
      role: "user"
    }
  };
  
  console.log("Tenant-aware auth active. Tenant ID:", session?.user?.tenant_id);

  return (
    <html lang="en">
      <body data-tenant={tenant} className="min-h-screen flex bg-gradient-to-br from-[#e6ecf0] to-[#cfd9df] text-black">
        <aside className="sidebar fixed left-0 top-0 h-full w-64 p-6 backdrop-blur-xl bg-white/20 border-r border-white/30 hidden md:flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-6">FRACTΛL</h1>

          <Link className="nav-item" href="/dashboard">Dashboard</Link>
          <Link className="nav-item" href="/projects">Projects</Link>
          <Link className="nav-item" href="/tasks">Tasks</Link>
          <Link className="nav-item" href="/time">Time</Link>
          <Link className="nav-item" href="/economics">Economics</Link>
        </aside>

        <main className="flex-1 md:ml-64 p-6">{children}</main>
      </body>
    </html>
  );
}
