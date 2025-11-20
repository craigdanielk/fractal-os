/**
 * Service wrapper utilities for error handling and telemetry
 */

import { SupabaseError, ValidationError, AuthenticationError } from "./errors";
import { logAudit } from "../services/supabase";
import { logError } from "./telemetry";

export interface ServiceContext {
  userId?: string;
  action: string;
  module: string;
}

/**
 * Wrap a service function with error handling and telemetry
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: ServiceContext
): Promise<T> {
  try {
    const result = await fn();
    
    // Log successful operation
    await logAudit(`${context.module}.${context.action}`, {
      success: true,
      userId: context.userId,
    }).catch(() => {
      // Silently fail audit logging
    });
    
    return result;
  } catch (error) {
    // Log error to telemetry
    if (error instanceof Error) {
      logError(error, {
        userId: context.userId,
        module: context.module,
        action: context.action,
      });
    }
    
    // Log failed operation to audit
    await logAudit(`${context.module}.${context.action}`, {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      userId: context.userId,
    }).catch(() => {
      // Silently fail audit logging
    });
    
    // Re-throw known errors
    if (error instanceof SupabaseError || 
        error instanceof ValidationError || 
        error instanceof AuthenticationError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new SupabaseError(
      `Failed to ${context.action} ${context.module}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

