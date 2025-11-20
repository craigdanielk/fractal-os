/**
 * Standardized Supabase error wrapper
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string
  ) {
    super(message);
    this.name = "SupabaseError";
  }

  static fromPostgrestError(error: any): SupabaseError {
    return new SupabaseError(
      error.message || "Database operation failed",
      error.code,
      error.details,
      error.hint
    );
  }
}

/**
 * Validation error wrapper
 */
export class ValidationError extends Error {
  constructor(message: string, public issues?: any[]) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Authentication error wrapper
 */
export class AuthenticationError extends Error {
  constructor(message: string = "Not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error wrapper
 */
export class AuthorizationError extends Error {
  constructor(message: string = "Not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

