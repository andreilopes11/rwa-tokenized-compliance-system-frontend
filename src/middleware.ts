import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/terms", "/privacy"];
const AUTH_API_PREFIX = "/api/auth";

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("rwa_access_token")?.value || request.cookies.get("rwa_refresh_token")?.value
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(AUTH_API_PREFIX) || pathname.startsWith("/api/backend")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "admin");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", "investor");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
