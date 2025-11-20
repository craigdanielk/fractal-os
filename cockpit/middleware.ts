// DEV AUTH BYPASS MODE

// This bypasses all Supabase auth checks and injects a fake user context.

// REMOVE THIS BEFORE PRODUCTION.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Inject mock session
  const mockUser = {
    id: "dev-user-0001",
    email: "dev@fractal.local",
  };

  // Attach to request headers so the cockpit treats you as authenticated
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-dev-user-id", mockUser.id);
  requestHeaders.set("x-dev-user-email", mockUser.email);
  requestHeaders.set("x-dev-mode", "true");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
