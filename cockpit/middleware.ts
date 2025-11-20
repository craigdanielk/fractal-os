import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseMiddleware } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and API routes
  const { pathname } = req.nextUrl;
  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  return supabaseMiddleware(req, {
    allowPublic: ["/login"],
    allowAuthed: ["/dashboard", "/projects", "/tasks", "/time", "/economics", "/clients"],
  });
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
