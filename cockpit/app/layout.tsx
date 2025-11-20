import "./globals.css";
import { cookies } from "next/headers";
import { RealtimeProvider } from "@/components/RealtimeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SyncBanner } from "@/components/SyncBanner";
import MainLayout from "@/layouts/MainLayout";
import { validateEnv } from "@/lib/env";

// Validate environment on boot
if (typeof window === "undefined") {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw error;
  }
}

export const metadata = {
  title: "FRACTΛL",
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-tenant={tenant} className="min-h-screen flex bg-black text-white font-sans">
        <ErrorBoundary>
          <SyncBanner />
          <RealtimeProvider>
            <MainLayout>{children}</MainLayout>
          </RealtimeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
