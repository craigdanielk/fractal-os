import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function supabaseMiddleware(
  req: NextRequest,
  rules: {
    allowPublic: string[];
    allowAuthed: string[];
  }
) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authed = !!user;
  const pathname = req.nextUrl.pathname;

  // Check if route is public
  const isPublicRoute = rules.allowPublic.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route requires auth
  const isAuthedRoute = rules.allowAuthed.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if not authenticated and trying to access protected route
  if (!authed && !isPublicRoute && isAuthedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Set user context in headers for RLS
  if (user) {
    res.headers.set("x-user-id", user.id);
    
    // Get tenant_id from user metadata
    const tenantId = user.user_metadata?.tenant_id;
    if (tenantId) {
      res.headers.set("x-tenant-id", tenantId);
    }
    
    const role = user.user_metadata?.role;
    if (role) {
      res.headers.set("x-user-role", role);
    }
  }

  return res;
}

