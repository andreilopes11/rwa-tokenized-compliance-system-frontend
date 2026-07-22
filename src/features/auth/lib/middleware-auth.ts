import type { NextRequest } from "next/server";

export type SessionRole = "investor" | "governance";

export const ACCESS_TOKEN_COOKIE = "rwa_access_token";
export const REFRESH_TOKEN_COOKIE = "rwa_refresh_token";

export const PUBLIC_PATHS = ["/", "/login", "/register", "/terms", "/privacy"] as const;
/** Login/register bounce authenticated users to their workspace. Landing (`/`) stays public. */
export const AUTH_PAGES = ["/login", "/register"] as const;

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
    if (payload.role === "INVESTOR") {
      return "investor";
    }
    // Two-role model: SUPER_ADMIN + all legacy staff roles collapse into governance.
    if (
      payload.role === "SUPER_ADMIN"
      || payload.role === "ADMIN"
      || payload.role === "COMPLIANCE_OFFICER"
      || payload.role === "AUDITOR"
    ) {
      return "governance";
    }
    return null;
  } catch {
    return null;
  }
}

export function workspacePathForRole(role: SessionRole | null): string {
  return role === "investor" ? "/dashboard" : "/governance";
}

/** GET paths governance may call on investor-scoped routes for case review and gating. */
export function isStaffSharedInvestorReadPath(path: string, method: string): boolean {
  if (method !== "GET") {
    return false;
  }
  if (/^api\/investors\/[^/]+\/status$/.test(path)) {
    return true;
  }
  if (/^api\/kyc\/requests\/[0-9a-f-]+$/.test(path)) {
    return true;
  }
  return false;
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

export type BackendProxyDenial =
  | "errors.governanceSessionRequired"
  | "errors.investorSessionRequired";

/**
 * Two-role BFF matrix. SUPER_ADMIN (governance) owns every /api/admin/** path (contracts,
 * KYC, lifecycle, force-sync, audit); investors own their self-service paths. Returns an
 * i18n error key when the role may not call the path; null when allowed.
 */
export function denyBackendProxyAccess(
  role: SessionRole,
  path: string,
  method: string
): BackendProxyDenial | null {
  if (path.startsWith("api/admin/")) {
    return role === "governance" ? null : "errors.governanceSessionRequired";
  }

  if (isInvestorOnlyBackendPath(path) && role !== "investor") {
    // Governance may perform read-only staff reads on shared investor paths (case review).
    const staffRead = isStaffSharedInvestorReadPath(path, method) && role === "governance";
    if (!staffRead) {
      return "errors.investorSessionRequired";
    }
  }

  return null;
}

/** Strip client ACL probe params from investor catalog requests (BR-15). */
export function stripInvestorAclProbeParams(path: string, searchParams: URLSearchParams): void {
  const catalogPath = path.split("?")[0] ?? path;
  if (catalogPath !== "api/assets") {
    return;
  }
  searchParams.delete("walletAddress");
  searchParams.delete("identityHash");
}
