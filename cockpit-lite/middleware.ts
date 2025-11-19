import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (handled separately)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Get session from cookies
  const sessionCookie = request.cookies.get("sb-session");
  
  // If no session and not on login page, redirect to login
  if (!sessionCookie && !pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Parse session if exists
  let userRole: string | null = null;
  let tenantId: string | null = null;
  
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      userRole = session.user?.role || null;
      tenantId = session.user?.tenant_id || null;
    } catch (error) {
      // Invalid session, clear it
      const response = NextResponse.next();
      response.cookies.delete("sb-session");
      return response;
    }
  }

  // Role-based route protection
  if (userRole === "client") {
    // Clients cannot access admin/agency routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/agency")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Set tenant context in headers for RLS
  const response = NextResponse.next();
  
  if (tenantId) {
    response.headers.set("x-tenant-id", tenantId);
  }
  
  if (userRole) {
    response.headers.set("x-user-role", userRole);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
