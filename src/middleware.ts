import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_PAGES,
  hasSessionCookie,
  parseRoleFromAccessToken,
  PUBLIC_PATHS
} from "@/features/auth/lib/middleware-auth";

const AUTH_API_PREFIX = "/api/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasSessionCookie(request);
  const role = parseRoleFromAccessToken(request);

  if (pathname.startsWith(AUTH_API_PREFIX) || pathname.startsWith("/api/backend")) {
    return NextResponse.next();
  }

  if (authenticated && AUTH_PAGES.includes(pathname as (typeof AUTH_PAGES)[number])) {
    if (role) {
      return NextResponse.redirect(
        new URL(role === "investor" ? "/dashboard" : "/governance", request.url)
      );
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number]) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/governance")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "governance");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // role may be null briefly while access JWT is expired but refresh cookie remains.
    if (role && role !== "governance") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Legacy staff routes and the old admin console now live under /governance.
  if (
    pathname.startsWith("/admin")
    || pathname.startsWith("/compliance")
    || pathname.startsWith("/audit")
  ) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "governance");
      loginUrl.searchParams.set("next", "/governance");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL(role === "investor" ? "/dashboard" : "/governance", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "investor");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role && role !== "investor") {
      return NextResponse.redirect(new URL("/governance", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.svg|favicon-32.png|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
