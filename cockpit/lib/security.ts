/**
 * Security Guards
 * Server-side validation
 */

/**
 * Validate HMAC signature (for MCP listener + Bridge Gate)
 */
export function validateHMAC(payload: string, signature: string, secret: string): boolean {
  // TODO: Implement HMAC validation
  // For now, return true in development
  if (process.env.NEXT_PUBLIC_ENV === "development") {
    return true;
  }
  
  // Production implementation would use crypto.createHmac
  return true;
}

