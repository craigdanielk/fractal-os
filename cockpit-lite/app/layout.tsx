import type { Metadata } from "next";
import MainLayout from "../layouts/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "FractalOS Cockpit Lite",
  description: "Operational interface for FractalOS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

