"use client";

import type { ReactNode } from "react";
import type { AuthRole } from "@/features/auth/lib/useAuthRole";
import { ExperienceFooter } from "@/shared/ui/ExperienceFooter";
import { WorkspaceAppHeader, type WorkspaceAppHeaderProps } from "@/shared/ui/WorkspaceAppHeader";
import type { WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";

export type WorkspaceShellProps = {
  role: AuthRole;
  navItems: WorkspaceNavItem[];
  navAriaLabel: string;
  context?: string;
  trailing?: ReactNode;
  onSignOut: () => void;
  signingOut?: boolean;
  /** Optional band between header and main content (e.g. investor DashboardHero). */
  beforeContent?: ReactNode;
  children: ReactNode;
};

/**
 * Canonical logged-in chrome for investor + governance:
 * WorkspaceAppHeader (logo + role + menu) → optional beforeContent → workspace-content → compact footer.
 */
export function WorkspaceShell({
  role,
  navItems,
  navAriaLabel,
  context,
  trailing,
  onSignOut,
  signingOut = false,
  beforeContent,
  children
}: WorkspaceShellProps) {
  const headerProps: WorkspaceAppHeaderProps = {
    role,
    navItems,
    navAriaLabel,
    context,
    trailing,
    onSignOut,
    signingOut
  };

  return (
    <main className="experience-shell workspace-shell">
      <WorkspaceAppHeader {...headerProps} />
      {beforeContent}
      <section className="workspace-content">{children}</section>
      <ExperienceFooter variant="workspace" />
    </main>
  );
}
