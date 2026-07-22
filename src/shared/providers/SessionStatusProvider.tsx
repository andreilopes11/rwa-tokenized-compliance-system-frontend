"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { SessionRole } from "@/features/auth/lib/middleware-auth";
import {
  fetchSessionStatus,
  hardLogout,
  refreshSessionOnce,
  registerSessionBridge,
  unregisterSessionBridge,
  workspacePathForRole,
  type ClientPublicSession,
  type SessionApiPayload
} from "@/features/auth/lib/session-client";

const TICK_MS = 4 * 60 * 1000;
const REFRESH_SKEW_MS = 6 * 60 * 1000;

export type SessionStatus = "loading" | "anonymous" | "authenticated";

type SessionStatusContextValue = {
  status: SessionStatus;
  session: ClientPublicSession | null;
  expiresAt: number | null;
  role: SessionRole | null;
  workspaceHref: string;
  /** Re-read /api/auth/session (e.g. after login). */
  refreshStatus: () => Promise<void>;
  /** Intentional sign-out. */
  signOut: () => Promise<void>;
};

const SessionStatusContext = createContext<SessionStatusContextValue | null>(null);

function applyPayload(
  payload: SessionApiPayload,
  setStatus: (s: SessionStatus) => void,
  setSession: (s: ClientPublicSession | null) => void,
  setExpiresAt: (n: number | null) => void
) {
  if (payload.authenticated && payload.session) {
    setStatus("authenticated");
    setSession(payload.session);
    setExpiresAt(
      typeof payload.expiresAt === "number"
        ? payload.expiresAt
        : payload.session.expiresAt ?? null
    );
    return;
  }
  setStatus("anonymous");
  setSession(null);
  setExpiresAt(null);
}

export function SessionStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [session, setSession] = useState<ClientPublicSession | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const wasAuthenticated = useRef(false);
  const tickInFlight = useRef(false);

  const applySession = useCallback((payload: SessionApiPayload) => {
    applyPayload(payload, setStatus, setSession, setExpiresAt);
  }, []);

  const markAnonymous = useCallback(() => {
    wasAuthenticated.current = false;
    setStatus("anonymous");
    setSession(null);
    setExpiresAt(null);
  }, []);

  const getRole = useCallback(() => session?.role ?? null, [session?.role]);

  const refreshStatus = useCallback(async () => {
    const payload = await fetchSessionStatus();
    applySession(payload);
    if (payload.authenticated) {
      wasAuthenticated.current = true;
    }
  }, [applySession]);

  const signOut = useCallback(async () => {
    await hardLogout({
      reason: "signed_out",
      role: session?.role ?? null,
      redirect: true
    });
  }, [session?.role]);

  useEffect(() => {
    const bridge = {
      getRole,
      markAnonymous,
      applySession
    };
    registerSessionBridge(bridge);
    return () => unregisterSessionBridge(bridge);
  }, [applySession, getRole, markAnonymous]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const payload = await fetchSessionStatus();
        if (cancelled) {
          return;
        }
        applySession(payload);
        if (payload.authenticated) {
          wasAuthenticated.current = true;
        }
      } catch {
        if (!cancelled) {
          markAnonymous();
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [applySession, markAnonymous]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      if (cancelled || tickInFlight.current) {
        return;
      }
      tickInFlight.current = true;
      try {
        const payload = await fetchSessionStatus();
        if (cancelled) {
          return;
        }

        if (payload.authenticated && payload.session) {
          wasAuthenticated.current = true;
          applySession(payload);
          const exp =
            typeof payload.expiresAt === "number"
              ? payload.expiresAt
              : payload.session.expiresAt;
          const needsRefresh =
            typeof exp !== "number" || exp <= Date.now() + REFRESH_SKEW_MS;
          if (needsRefresh) {
            const ok = await refreshSessionOnce();
            if (!ok && wasAuthenticated.current) {
              await hardLogout({
                reason: "session_expired",
                role: payload.session.role
              });
            }
          }
          return;
        }

        // Session truly gone after we were logged in → force re-auth.
        if (wasAuthenticated.current) {
          await hardLogout({ reason: "session_expired", role: getRole() });
          return;
        }

        applySession(payload);
      } catch {
        // Network blips should not force logout.
      } finally {
        tickInFlight.current = false;
      }
    }

    timer = window.setInterval(() => {
      if (!cancelled) {
        void tick();
      }
    }, TICK_MS);

    return () => {
      cancelled = true;
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [applySession, getRole]);

  const value = useMemo<SessionStatusContextValue>(() => {
    const role = session?.role ?? null;
    return {
      status,
      session,
      expiresAt,
      role,
      workspaceHref: workspacePathForRole(role),
      refreshStatus,
      signOut
    };
  }, [expiresAt, refreshStatus, session, signOut, status]);

  return (
    <SessionStatusContext.Provider value={value}>{children}</SessionStatusContext.Provider>
  );
}

export function useSessionStatus(): SessionStatusContextValue {
  const ctx = useContext(SessionStatusContext);
  if (!ctx) {
    throw new Error("useSessionStatus must be used within SessionStatusProvider");
  }
  return ctx;
}

/** Safe for public chrome that may render outside provider in tests. */
export function useOptionalSessionStatus(): SessionStatusContextValue | null {
  return useContext(SessionStatusContext);
}
