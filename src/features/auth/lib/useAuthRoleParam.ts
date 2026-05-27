"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AuthRole = "investor" | "compliance" | "governance" | "audit";

export function useAuthRoleParam(defaultRole: AuthRole = "investor") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const roleFromUrl = useMemo<AuthRole>(() => {
    const role = searchParams.get("role");
    if (role === "investor") return "investor";
    if (role === "compliance") return "compliance";
    if (role === "audit") return "audit";
    if (role === "governance" || role === "admin") return "governance";
    return defaultRole;
  }, [defaultRole, searchParams]);

  const [role, setRoleState] = useState<AuthRole>(roleFromUrl);

  useEffect(() => {
    setRoleState(roleFromUrl);
  }, [roleFromUrl]);

  const setRole = useCallback(
    (nextRole: AuthRole) => {
      setRoleState(nextRole);
      const params = new URLSearchParams(searchParams.toString());
      params.set("role", nextRole);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { role, setRole, roleFromUrl };
}
