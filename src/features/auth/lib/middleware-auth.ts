import type { NextRequest } from "next/server";

export type SessionRole = "admin" | "investor";

export const ACCESS_TOKEN_COOKIE = "rwa_access_token";
export const REFRESH_TOKEN_COOKIE = "rwa_refresh_token";

export const PUBLIC_PATHS = ["/", "/login", "/register", "/terms", "/privacy"] as const;
export const AUTH_PAGES = ["/", "/login", "/register"] as const;

export function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  );
}

export function parseRoleFromAccessToken(request: NextRequest): SessionRole | null {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payloadPart = token.split(".")[1];
  if (!payloadPart) {
    return null;
  }

  try {
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const payload = JSON.parse(decoded) as { role?: string };
    if (payload.role === "ADMIN") {
      return "admin";
    }
    if (payload.role === "INVESTOR") {
      return "investor";
    }
    return null;
  } catch {
    return null;
  }
}

export function workspacePathForRole(role: SessionRole | null): string {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function isInvestorOnlyBackendPath(path: string): boolean {
  if (path.startsWith("api/kyc/")) {
    return true;
  }
  if (path.startsWith("api/investors/")) {
    return true;
  }
  if (path.startsWith("api/fees/")) {
    return true;
  }
  if (path.startsWith("api/notifications")) {
    return true;
  }
  if (path.startsWith("api/tutorials")) {
    return true;
  }
  return /\/assets\/[^/]+\/(subscriptions|redemptions)/.test(path);
}
