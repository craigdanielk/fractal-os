"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to telemetry
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // TODO: Send to Pulse/telemetry service
    if (typeof window !== "undefined") {
      try {
        fetch("/api/telemetry/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // Silently fail if telemetry is unavailable
        });
      } catch (e) {
        // Ignore telemetry errors
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encountered an unexpected error. Please refresh the page or contact support if the problem persists.
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  Error details
                </summary>
                <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

