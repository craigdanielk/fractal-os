import "./globals.css";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/theme.css";

export const metadata = {
  title: "FractalOS Cockpit Lite",
  description: "Operational interface for FractalOS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="fractal-shell">
        <div className="shell-container">
          <Sidebar />

          <main className="shell-main">
            <div className="shell-topbar">
              <ThemeToggle />
            </div>

            <div className="shell-content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
