import "./globals.css";
import { RealtimeProvider } from "@/components/RealtimeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SyncBanner } from "@/components/SyncBanner";
import MainLayout from "@/layouts/MainLayout";
import { validateEnv } from "@/lib/env";
import { getCurrentAuthUserId } from "@/lib/auth/user";

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
  const userId = await getCurrentAuthUserId();
  const userName = userId || "User";

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex bg-black text-white font-sans">
        <ErrorBoundary>
          <SyncBanner />
          <RealtimeProvider userId={userId || "anonymous"} userName={userName}>
            <MainLayout>{children}</MainLayout>
          </RealtimeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
