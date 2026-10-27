import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { COOKIE_NAME } from "@/lib/auth/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // 1. Refresh Supabase session and retrieve authenticated user
    const { response, user } = await updateSession(request);

    // 2. Check for custom JWT admin session cookie as fallback
    const hasPinSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);

    const isAuthenticated = Boolean(user || hasPinSession);

    // If user is already authenticated and visits /admin/login, redirect to /admin
    if (isLoginPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return response;
    }

    // For all other /admin routes (/admin, /admin/posts, /admin/posts/new, etc.):
    // If NOT authenticated, immediately redirect to /admin/login
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin paths:
     * - /admin
     * - /admin/posts
     * - /admin/posts/:path*
     * - etc.
     */
    "/admin/:path*",
  ],
};
