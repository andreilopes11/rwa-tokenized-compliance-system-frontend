import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverRuntime } from "@/shared/config/serverRuntime";
import { getServerLocale } from "@/shared/i18n/server";

export type SessionRole = "investor" | "governance";

export type ComplianceSession = {
  userId: string;
  email: string;
  role: SessionRole;
  walletAddress?: string;
  mfaEnabled: boolean;
  /** Active tenant for marketplace/ACL orchestration (JWT claim + optional cookie override). */
  tenantId: string;
  tenantIds: string[];
  accessToken: string;
  expiresAt: number;
};

export type PublicSession = Omit<ComplianceSession, "accessToken">;

const ACCESS_COOKIE = "rwa_access_token";
const REFRESH_COOKIE = "rwa_refresh_token";
const ACCESS_TTL_FALLBACK_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

export type BackendAuthSession = {
  user: {
    userId: string;
    email: string;
    role: "INVESTOR" | "COMPLIANCE_OFFICER" | "SUPER_ADMIN" | "AUDITOR" | "ADMIN";
    walletAddress?: string | null;
    mfaEnabled: boolean;
    tenantId?: string | null;
    tenantIds?: string[] | null;
  };
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

const TENANT_COOKIE = "rwa_active_tenant";
const DEFAULT_TENANT = "default";

export function tenantCookieName() {
  return TENANT_COOKIE;
}

type BackendAuthUser = BackendAuthSession["user"];

function backendBaseUrl() {
  return serverRuntime.backendApiBaseUrl.replace(/\/$/, "");
}

function mapRole(role: BackendAuthUser["role"]): SessionRole {
  // Two-role model: INVESTOR stays investor; SUPER_ADMIN and all legacy staff roles → governance.
  return role === "INVESTOR" ? "investor" : "governance";
}

function decodeJwtPayload(token: string): {
  exp?: number;
  tenant?: string;
  tenant_ids?: string[];
} | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
      tenant?: string;
      tenant_ids?: string[];
    };
  } catch {
    return null;
  }
}

function decodeJwtExpiry(token: string): number | null {
  const decoded = decodeJwtPayload(token);
  return typeof decoded?.exp === "number" ? decoded.exp * 1000 : null;
}

function resolveTenantScope(
  accessToken: string,
  user?: BackendAuthUser,
  cookieTenant?: string | null
): { tenantId: string; tenantIds: string[] } {
  const claims = decodeJwtPayload(accessToken);
  const fromUser = Array.isArray(user?.tenantIds)
    ? user.tenantIds.filter((t): t is string => Boolean(t && t.trim()))
    : [];
  const fromClaims = Array.isArray(claims?.tenant_ids)
    ? claims.tenant_ids.filter((t): t is string => Boolean(t && t.trim()))
    : [];
  const tenantIds = Array.from(
    new Set([
      ...fromUser,
      ...fromClaims,
      user?.tenantId?.trim() || "",
      claims?.tenant?.trim() || "",
      DEFAULT_TENANT
    ].filter(Boolean))
  );
  const preferred =
    (cookieTenant && tenantIds.includes(cookieTenant.trim()) ? cookieTenant.trim() : null) ||
    user?.tenantId?.trim() ||
    claims?.tenant?.trim() ||
    tenantIds[0] ||
    DEFAULT_TENANT;
  return { tenantId: preferred, tenantIds };
}

function isAccessTokenValid(token: string | undefined): token is string {
  if (!token) {
    return false;
  }
  const expiresAt = decodeJwtExpiry(token);
  if (!expiresAt) {
    return false;
  }
  return expiresAt > Date.now() + 5_000;
}

export function accessCookieName() {
  return ACCESS_COOKIE;
}

export function refreshCookieName() {
  return REFRESH_COOKIE;
}

export function authCookieOptions(maxAgeSeconds: number, path = "/") {
  return {
    httpOnly: true,
    maxAge: maxAgeSeconds,
    path,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export function applyAuthCookies(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof authCookieOptions>) => void } },
  session: BackendAuthSession
) {
  response.cookies.set(ACCESS_COOKIE, session.accessToken, authCookieOptions(session.expiresInSeconds));
  response.cookies.set(REFRESH_COOKIE, session.refreshToken, authCookieOptions(REFRESH_TTL_SECONDS));
  const tenant = resolveTenantScope(session.accessToken, session.user).tenantId;
  response.cookies.set(TENANT_COOKIE, tenant, authCookieOptions(REFRESH_TTL_SECONDS));
}

/** Persist rotated tokens when refresh runs inside a Route Handler (cookies().set). */
async function persistAuthCookiesFromStore(session: BackendAuthSession) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_COOKIE, session.accessToken, authCookieOptions(session.expiresInSeconds));
    cookieStore.set(REFRESH_COOKIE, session.refreshToken, authCookieOptions(REFRESH_TTL_SECONDS));
    const tenant = resolveTenantScope(session.accessToken, session.user).tenantId;
    cookieStore.set(TENANT_COOKIE, tenant, authCookieOptions(REFRESH_TTL_SECONDS));
  } catch {
    // Server Components cannot mutate cookies; Route Handlers / SessionStatusProvider cover that path.
  }
}

export function clearAuthCookies(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof authCookieOptions>) => void } }
) {
  response.cookies.set(ACCESS_COOKIE, "", authCookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, "", authCookieOptions(0));
  response.cookies.set(TENANT_COOKIE, "", authCookieOptions(0));
}

function toComplianceSession(
  session: BackendAuthSession,
  accessToken: string,
  cookieTenant?: string | null
): ComplianceSession {
  const expiresAt = decodeJwtExpiry(accessToken) ?? Date.now() + session.expiresInSeconds * 1000;
  const tenants = resolveTenantScope(accessToken, session.user, cookieTenant);
  return {
    userId: session.user.userId,
    email: session.user.email,
    role: mapRole(session.user.role),
    walletAddress: session.user.walletAddress ?? undefined,
    mfaEnabled: session.user.mfaEnabled,
    tenantId: tenants.tenantId,
    tenantIds: tenants.tenantIds,
    accessToken,
    expiresAt
  };
}

function toPublicSession(session: ComplianceSession): PublicSession {
  const { accessToken: _accessToken, ...publicSession } = session;
  return publicSession;
}

export async function readCookieValues() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(ACCESS_COOKIE)?.value,
    refreshToken: cookieStore.get(REFRESH_COOKIE)?.value,
    activeTenant: cookieStore.get(TENANT_COOKIE)?.value
  };
}

async function fetchBackendMe(
  accessToken: string,
  cookieTenant?: string | null
): Promise<ComplianceSession | null> {
  const response = await fetch(`${backendBaseUrl()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });
  if (!response.ok) {
    return null;
  }
  const user = (await response.json()) as BackendAuthUser;
  const expiresAt = decodeJwtExpiry(accessToken) ?? Date.now() + ACCESS_TTL_FALLBACK_SECONDS * 1000;
  const tenants = resolveTenantScope(accessToken, user, cookieTenant);
  return {
    userId: user.userId,
    email: user.email,
    role: mapRole(user.role),
    walletAddress: user.walletAddress ?? undefined,
    mfaEnabled: user.mfaEnabled,
    tenantId: tenants.tenantId,
    tenantIds: tenants.tenantIds,
    accessToken,
    expiresAt
  };
}

export async function refreshAuthSession(refreshToken: string): Promise<BackendAuthSession | null> {
  const response = await fetch(`${backendBaseUrl()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as BackendAuthSession;
}

export type EnsuredSession = {
  session: ComplianceSession | null;
  /** Present when access was rotated; callers in Route Handlers should rewrite cookies. */
  rotatedAuth: BackendAuthSession | null;
};

export type EnsureSessionOptions = {
  /**
   * When true, rotate via refresh token (Route Handlers / BFF only).
   * Server Components must keep this false — cookies().set is a no-op there and
   * the backend revokes the old refresh token, logging the user out on next navigation.
   */
  allowRefresh?: boolean;
};

export async function ensureSessionResult(
  options: EnsureSessionOptions = {}
): Promise<EnsuredSession> {
  const allowRefresh = options.allowRefresh === true;
  const { accessToken, refreshToken, activeTenant } = await readCookieValues();

  if (isAccessTokenValid(accessToken)) {
    const session = await fetchBackendMe(accessToken, activeTenant);
    if (session) {
      return { session, rotatedAuth: null };
    }
  }

  if (!allowRefresh || !refreshToken) {
    return { session: null, rotatedAuth: null };
  }

  const refreshed = await refreshAuthSession(refreshToken);
  if (!refreshed) {
    return { session: null, rotatedAuth: null };
  }
  await persistAuthCookiesFromStore(refreshed);
  return {
    session: toComplianceSession(refreshed, refreshed.accessToken, activeTenant),
    rotatedAuth: refreshed
  };
}

/** RSC-safe: never rotates refresh tokens. */
export async function ensureSession(): Promise<ComplianceSession | null> {
  return (await ensureSessionResult({ allowRefresh: false })).session;
}

export async function readSession(): Promise<PublicSession | null> {
  const session = await ensureSession();
  return session ? toPublicSession(session) : null;
}

export async function requireSession(role?: SessionRole): Promise<ComplianceSession> {
  const session = await ensureSession();
  if (!session) {
    const params = new URLSearchParams({ reason: "session_expired" });
    if (role) {
      params.set("role", role);
      params.set("next", role === "investor" ? "/dashboard" : "/governance");
    }
    redirect(`/login?${params.toString()}`);
  }
  if (role && session.role !== role) {
    redirect(session.role === "investor" ? "/dashboard" : "/governance");
  }
  return session;
}

export type AuthorizedBackendHeaders = {
  headers: HeadersInit;
  rotatedAuth: BackendAuthSession | null;
};

export async function getAuthorizedBackendHeaders(
  session: ComplianceSession
): Promise<AuthorizedBackendHeaders> {
  let accessToken = session.accessToken;
  let rotatedAuth: BackendAuthSession | null = null;
  if (!isAccessTokenValid(accessToken)) {
    const { refreshToken } = await readCookieValues();
    if (!refreshToken) {
      throw new Error("Session expired.");
    }
    const refreshed = await refreshAuthSession(refreshToken);
    if (!refreshed) {
      throw new Error("Session expired.");
    }
    await persistAuthCookiesFromStore(refreshed);
    accessToken = refreshed.accessToken;
    rotatedAuth = refreshed;
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    rotatedAuth
  };
}

export function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as {
      message?: string;
      messages?: string[];
      error?: string;
      path?: string;
      status?: number;
    };

    if (Array.isArray(record.messages) && record.messages.length > 0) {
      return record.messages.join(" ");
    }
    if (record.message) {
      return record.message;
    }
    if (record.status === 404 && record.path?.includes("/api/auth/")) {
      return "Auth API not found. Restart the Spring Boot backend (port 8080) with the latest code.";
    }
    if (record.error && record.error !== "Not Found") {
      return record.error;
    }
    if (record.status === 404) {
      return "Backend endpoint not found. Ensure the compliance service is running on port 8080.";
    }
  }
  return fallback;
}

export async function backendAuthRequest<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {}
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  const headers = new Headers(init.headers);
  const locale = await getServerLocale();
  headers.set("Accept-Language", locale);
  if (init.accessToken) {
    headers.set("Authorization", `Bearer ${init.accessToken}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${backendBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store"
    });
  } catch {
    return { ok: false, status: 502, message: "errors.apiUnavailable" };
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: extractErrorMessage(payload, "errors.authenticationFailed")
    };
  }

  return { ok: true, data: payload as T };
}
