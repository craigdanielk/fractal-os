/**
 * Telemetry and Logging
 * Centralized logging with context (clientId, tenantId, no PII)
 */

interface LogContext {
  clientId?: string;
  tenantId?: string;
  userId?: string;
  module?: string;
  action?: string;
}

let heartbeatInterval: NodeJS.Timeout | null = null;

export function logAction(action: string, context: LogContext = {}) {
  const logEntry = {
    action,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.log("[Pulse]", logEntry);

  // Send to telemetry endpoint (non-blocking)
  if (typeof window !== "undefined") {
    fetch("/api/telemetry/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
    }).catch(() => {
      // Silently fail if telemetry is unavailable
    });
  }
}

export function logError(error: Error, context: LogContext = {}) {
  const logEntry = {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.error("[Pulse Error]", logEntry);

  if (typeof window !== "undefined") {
    fetch("/api/telemetry/error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
    }).catch(() => {
      // Silently fail if telemetry is unavailable
    });
  }
}

export function startHeartbeat(context: LogContext = {}) {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    logAction("heartbeat", context);
  }, 60000); // Every 60 seconds
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

