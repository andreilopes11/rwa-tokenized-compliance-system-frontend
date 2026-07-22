"use client";

import { useEffect } from "react";

/**
 * Silently refreshes auth cookies so BFF-internal refresh rotations stay in sync
 * after ~15m access-token TTL (prevents sudden 401s after refresh-token rotation).
 * Only runs when an authenticated session exists.
 */
export function SessionKeepAlive() {
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      try {
        const sessionRes = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store"
        });
        if (!sessionRes.ok || cancelled) {
          return;
        }
        const payload = (await sessionRes.json()) as { authenticated?: boolean };
        if (!payload.authenticated) {
          return;
        }
        await fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" });
      } catch {
        // Ignore — next API call will surface auth errors.
      }
    }

    void tick();
    timer = window.setInterval(() => {
      if (!cancelled) {
        void tick();
      }
    }, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  return null;
}
