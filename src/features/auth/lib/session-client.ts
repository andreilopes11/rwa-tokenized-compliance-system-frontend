import type { SessionRole } from "@/features/auth/lib/middleware-auth";

export type ClientPublicSession = {
  userId: string;
  email: string;
  role: SessionRole;
  walletAddress?: string;
  mfaEnabled: boolean;
  tenantId: string;
  tenantIds: string[];
  expiresAt: number;
};

export type SessionApiPayload = {
  authenticated?: boolean;
  session?: ClientPublicSession | null;
  expiresAt?: number | null;
};

type SessionBridge = {
  getRole: () => SessionRole | null;
  markAnonymous: () => void;
  applySession: (payload: SessionApiPayload) => void;
};

let bridge: SessionBridge | null = null;
let refreshPromise: Promise<boolean> | null = null;
let logoutPromise: Promise<void> | null = null;

export function registerSessionBridge(next: SessionBridge) {
  bridge = next;
}

export function unregisterSessionBridge(current?: SessionBridge) {
  if (!current || bridge === current) {
    bridge = null;
  }
}

export function workspacePathForRole(role: SessionRole | null | undefined): string {
  return role === "governance" ? "/governance" : "/dashboard";
}

/** Prevent open redirects after login; only allow app workspace paths. */
export function sanitizeNextPath(
  next: string | null | undefined,
  role: SessionRole
): string {
  const fallback = workspacePathForRole(role);
  if (!next) {
    return fallback;
  }
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  if (
    trimmed.startsWith("/login")
    || trimmed.startsWith("/register")
    || trimmed.startsWith("/api")
    || trimmed.startsWith("/_next")
  ) {
    return fallback;
  }
  if (trimmed.startsWith("/dashboard") || trimmed.startsWith("/governance")) {
    return trimmed;
  }
  return fallback;
}

export async function fetchSessionStatus(): Promise<SessionApiPayload> {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store"
  });
  if (!response.ok) {
    return { authenticated: false, session: null, expiresAt: null };
  }
  return (await response.json()) as SessionApiPayload;
}

/** Single-flight refresh so parallel 401s do not burn single-use refresh tokens. */
export async function refreshSessionOnce(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store"
      });
      if (!response.ok) {
        return false;
      }
      const status = await fetchSessionStatus();
      bridge?.applySession(status);
      return Boolean(status.authenticated);
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export type HardLogoutOptions = {
  reason?: "session_expired" | "signed_out";
  role?: SessionRole | null;
  /** Default true — hard navigate to login so RSC/middleware state is cleared. */
  redirect?: boolean;
};

/**
 * Clears cookies server-side and forces re-authentication when the session is dead.
 */
export async function hardLogout(options: HardLogoutOptions = {}): Promise<void> {
  if (logoutPromise) {
    return logoutPromise;
  }

  const reason = options.reason ?? "session_expired";
  const role = options.role ?? bridge?.getRole() ?? "investor";
  const shouldRedirect = options.redirect !== false;

  logoutPromise = (async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store"
      });
    } catch {
      // Cookies may already be cleared by BFF; continue to local cleanup.
    } finally {
      bridge?.markAnonymous();
    }

    if (shouldRedirect && typeof window !== "undefined") {
      const params = new URLSearchParams({
        role,
        reason
      });
      params.set("next", workspacePathForRole(role));
      window.location.assign(`/login?${params.toString()}`);
    }
  })().finally(() => {
    logoutPromise = null;
  });

  return logoutPromise;
}
