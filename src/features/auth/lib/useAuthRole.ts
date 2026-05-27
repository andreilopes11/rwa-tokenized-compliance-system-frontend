"use client";

import { useCallback, useEffect, useState } from "react";

export type AuthRole = "investor" | "compliance" | "governance" | "audit";

function readRoleFromLocation(defaultRole: AuthRole): AuthRole {
  if (typeof window === "undefined") {
    return defaultRole;
  }

  const fromQuery = new URLSearchParams(window.location.search).get("role");
  if (fromQuery === "investor") {
    return "investor";
  }
  if (fromQuery === "compliance") return "compliance";
  if (fromQuery === "audit") return "audit";
  if (fromQuery === "governance" || fromQuery === "admin") return "governance";
  return defaultRole;
}

function writeRoleToLocation(nextRole: AuthRole) {
  const url = new URL(window.location.href);
  url.searchParams.set("role", nextRole);
  window.history.replaceState(window.history.state, "", url.toString());
}

/**
 * Role state is owned locally and synced to the URL with history.replaceState.
 * Avoids Next.js router.replace + useSearchParams remounting auth forms on each click.
 */
export function useAuthRole(defaultRole: AuthRole = "investor") {
  const [role, setRoleState] = useState<AuthRole>(defaultRole);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRoleState(readRoleFromLocation(defaultRole));
    setReady(true);

    const onPopState = () => {
      setRoleState(readRoleFromLocation(defaultRole));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [defaultRole]);

  const setRole = useCallback((nextRole: AuthRole) => {
    setRoleState(nextRole);
    writeRoleToLocation(nextRole);
  }, []);

  return { role, setRole, ready };
}
