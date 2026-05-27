import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerLocale } from "@/shared/i18n/server";

export type SessionRole = "investor" | "compliance" | "governance" | "audit";

export type ComplianceSession = {
  userId: string;
  email: string;
  role: SessionRole;
  walletAddress?: string;
  mfaEnabled: boolean;
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
  };
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

type BackendAuthUser = BackendAuthSession["user"];

function backendBaseUrl() {
  return (process.env.BACKEND_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
}

function mapRole(role: BackendAuthUser["role"]): SessionRole {
  if (role === "INVESTOR") return "investor";
  if (role === "COMPLIANCE_OFFICER") return "compliance";
  if (role === "AUDITOR") return "audit";
  return "governance";
}

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
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
}

export function clearAuthCookies(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof authCookieOptions>) => void } }
) {
  response.cookies.set(ACCESS_COOKIE, "", authCookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, "", authCookieOptions(0));
}

function toComplianceSession(session: BackendAuthSession, accessToken: string): ComplianceSession {
  const expiresAt = decodeJwtExpiry(accessToken) ?? Date.now() + session.expiresInSeconds * 1000;
  return {
    userId: session.user.userId,
    email: session.user.email,
    role: mapRole(session.user.role),
    walletAddress: session.user.walletAddress ?? undefined,
    mfaEnabled: session.user.mfaEnabled,
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
    refreshToken: cookieStore.get(REFRESH_COOKIE)?.value
  };
}

async function fetchBackendMe(accessToken: string): Promise<ComplianceSession | null> {
  const response = await fetch(`${backendBaseUrl()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });
  if (!response.ok) {
    return null;
  }
  const user = (await response.json()) as BackendAuthUser;
  const expiresAt = decodeJwtExpiry(accessToken) ?? Date.now() + ACCESS_TTL_FALLBACK_SECONDS * 1000;
  return {
    userId: user.userId,
    email: user.email,
    role: mapRole(user.role),
    walletAddress: user.walletAddress ?? undefined,
    mfaEnabled: user.mfaEnabled,
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

export async function ensureSession(): Promise<ComplianceSession | null> {
  const { accessToken, refreshToken } = await readCookieValues();

  if (isAccessTokenValid(accessToken)) {
    const session = await fetchBackendMe(accessToken);
    if (session) {
      return session;
    }
  }

  if (!refreshToken) {
    return null;
  }

  const refreshed = await refreshAuthSession(refreshToken);
  return refreshed ? toComplianceSession(refreshed, refreshed.accessToken) : null;
}

export async function readSession(): Promise<PublicSession | null> {
  const session = await ensureSession();
  return session ? toPublicSession(session) : null;
}

export async function requireSession(role?: SessionRole): Promise<ComplianceSession> {
  const session = await ensureSession();
  if (!session) {
    redirect("/login");
  }
  if (role && session.role !== role) {
    const routeForRole =
      session.role === "investor"
        ? "/dashboard"
        : session.role === "compliance"
          ? "/compliance"
          : session.role === "audit"
            ? "/audit"
            : "/governance";
    redirect(routeForRole);
  }
  return session;
}

export async function getAuthorizedBackendHeaders(session: ComplianceSession): Promise<HeadersInit> {
  let accessToken = session.accessToken;
  if (!isAccessTokenValid(accessToken)) {
    const { refreshToken } = await readCookieValues();
    if (!refreshToken) {
      throw new Error("Session expired.");
    }
    const refreshed = await refreshAuthSession(refreshToken);
    if (!refreshed) {
      throw new Error("Session expired.");
    }
    accessToken = refreshed.accessToken;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
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
