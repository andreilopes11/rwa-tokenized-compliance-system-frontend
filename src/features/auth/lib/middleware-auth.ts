import type { NextRequest } from "next/server";

export type SessionRole = "investor" | "compliance" | "governance" | "audit";

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
    if (payload.role === "INVESTOR") {
      return "investor";
    }
    if (payload.role === "COMPLIANCE_OFFICER") {
      return "compliance";
    }
    if (payload.role === "AUDITOR") {
      return "audit";
    }
    if (payload.role === "SUPER_ADMIN" || payload.role === "ADMIN") {
      return "governance";
    }
    return null;
  } catch {
    return null;
  }
}

export function workspacePathForRole(role: SessionRole | null): string {
  if (role === "investor") return "/dashboard";
  if (role === "compliance") return "/compliance";
  if (role === "audit") return "/audit";
  return "/governance";
}

/** GET paths compliance/audit may call for case review and subscription gating. */
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
  | "errors.complianceSessionRequired"
  | "errors.governanceSessionRequired"
  | "errors.auditSessionRequired"
  | "errors.adminSessionRequired"
  | "errors.investorSessionRequired";

/**
 * TECHNICAL §3 BFF role-path matrix. Returns an i18n error key when the role may not
 * call the path; null when allowed.
 */
export function denyBackendProxyAccess(
  role: SessionRole,
  path: string,
  method: string
): BackendProxyDenial | null {
  const isComplianceRoute =
    path.startsWith("api/admin/kyc/")
    || path.startsWith("api/admin/identities/")
    || path.startsWith("api/admin/subscriptions/")
    || path.startsWith("api/admin/redemptions/")
    || path.startsWith("api/admin/investors/");
  const isGovernanceRoute =
    path.startsWith("api/admin/assets/")
    || path === "api/admin/assets"
    || path.startsWith("api/admin/force-sync/");
  const isAuditRoute =
    path.startsWith("api/admin/audit-events")
    || path.startsWith("api/admin/blockchain-transactions")
    || path.startsWith("api/admin/reports/");

  if (isComplianceRoute && role !== "compliance") {
    return "errors.complianceSessionRequired";
  }
  if (isGovernanceRoute && role !== "governance") {
    return "errors.governanceSessionRequired";
  }
  if (isAuditRoute && role !== "audit" && role !== "governance" && role !== "compliance") {
    return "errors.auditSessionRequired";
  }
  if (path.startsWith("api/admin/") && role === "investor") {
    return "errors.adminSessionRequired";
  }

  if (isInvestorOnlyBackendPath(path) && role !== "investor") {
    const staffRead =
      isStaffSharedInvestorReadPath(path, method)
      && (role === "compliance" || role === "audit");
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
