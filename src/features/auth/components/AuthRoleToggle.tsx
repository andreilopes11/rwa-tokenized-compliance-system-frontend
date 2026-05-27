"use client";

import type { AuthRole } from "@/features/auth/lib/useAuthRole";

type AuthRoleToggleProps = {
  governanceLabel: string;
  ariaLabel: string;
  investorLabel: string;
  onChange: (role: AuthRole) => void;
  role: AuthRole;
};

export function AuthRoleToggle({
  governanceLabel,
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
        aria-pressed={role === "governance"}
        className={role === "governance" ? "selected" : undefined}
        onClick={() => onChange("governance")}
        type="button"
      >
        {governanceLabel}
      </button>
    </div>
  );
}
