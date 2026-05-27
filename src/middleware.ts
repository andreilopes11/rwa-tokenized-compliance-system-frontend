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
      const redirectPath =
        role === "investor"
          ? "/dashboard"
          : role === "compliance"
            ? "/compliance"
            : role === "audit"
              ? "/audit"
              : "/governance";
      return NextResponse.redirect(new URL(redirectPath, request.url));
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
    if (role !== "governance") {
      return NextResponse.redirect(
        new URL(role === "investor" ? "/dashboard" : role === "compliance" ? "/compliance" : "/audit", request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/compliance")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "compliance");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "compliance") {
      return NextResponse.redirect(
        new URL(role === "investor" ? "/dashboard" : role === "governance" ? "/governance" : "/audit", request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/audit")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "audit");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "audit") {
      return NextResponse.redirect(
        new URL(role === "investor" ? "/dashboard" : role === "compliance" ? "/compliance" : "/governance", request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "governance");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL(role === "compliance" ? "/compliance" : "/governance", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "investor");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "investor") {
      return NextResponse.redirect(
        new URL(role === "compliance" ? "/compliance" : role === "audit" ? "/audit" : "/governance", request.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
