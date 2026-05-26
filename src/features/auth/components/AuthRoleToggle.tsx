"use client";

import type { AuthRole } from "@/features/auth/lib/useAuthRole";

type AuthRoleToggleProps = {
  adminLabel: string;
  ariaLabel: string;
  investorLabel: string;
  onChange: (role: AuthRole) => void;
  role: AuthRole;
};

export function AuthRoleToggle({
  adminLabel,
  ariaLabel,
  investorLabel,
  onChange,
  role
}: AuthRoleToggleProps) {
  return (
    <div className="segmented-control auth-role-toggle" role="group" aria-label={ariaLabel}>
      <button
        aria-pressed={role === "investor"}
        className={role === "investor" ? "selected" : undefined}
        onClick={() => onChange("investor")}
        type="button"
      >
        {investorLabel}
      </button>
      <button
        aria-pressed={role === "admin"}
        className={role === "admin" ? "selected" : undefined}
        onClick={() => onChange("admin")}
        type="button"
      >
        {adminLabel}
      </button>
    </div>
  );
}
