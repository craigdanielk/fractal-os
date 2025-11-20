import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-client-server";
import { ensureIdentity } from "@/lib/auth/identity";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = getSupabaseServer();
    
    // Exchange code for session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/login?error=auth_failed", requestUrl.origin));
    }

    try {
      // Ensure identity_user record exists
      await ensureIdentity(user.id, user.email ?? "");

      // TODO: Create tenant_membership if not exists
      // This should be handled by:
      // 1. Checking if user has any tenant memberships
      // 2. If not, create a default tenant or assign to existing tenant
      // 3. Create tenant_members record with appropriate role

      // Set session cookie
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));
      
      // Store session info in cookie for middleware
      response.cookies.set("sb-session", JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
        },
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch (identityError: any) {
      console.error("Identity creation error:", identityError);
      return NextResponse.redirect(new URL("/login?error=identity_failed", requestUrl.origin));
    }
  }

  // No code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

