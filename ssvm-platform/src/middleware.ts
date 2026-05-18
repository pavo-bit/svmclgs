import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js middleware for route protection.
 * Redirects unauthenticated users away from protected pages.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ["/admin", "/student", "/parent", "/alumni"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/parent/:path*", "/alumni/:path*", "/login"],
};
