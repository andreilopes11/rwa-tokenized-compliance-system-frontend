"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";
import { WorkspaceShell } from "@/shared/ui/WorkspaceShell";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { useSessionStatus } from "@/shared/providers/SessionStatusProvider";

export function GovernanceShell({ children }: { children: ReactNode }) {
  const m = useMessages();
  const { signOut } = useSessionStatus();
  const [signingOut, setSigningOut] = useState(false);

  const navItems: WorkspaceNavItem[] = [
    { href: "/governance", label: m.workspace.governance.nav.overview, screenId: "SA-S01" },
    { href: "/governance/assets", label: m.workspace.governance.nav.assets, screenId: "SA-S02" },
    { href: "/governance/kyc", label: m.workspace.governance.nav.kyc, screenId: "SA-S08" },
    { href: "/governance/lifecycle", label: m.workspace.governance.nav.lifecycle, screenId: "SA-S11" },
    { href: "/governance/revoke", label: m.workspace.governance.nav.revoke, screenId: "SA-S10" },
    { href: "/governance/pause", label: m.workspace.governance.nav.pause, screenId: "SA-S03" },
    { href: "/governance/oracle", label: m.workspace.governance.nav.oracle, screenId: "SA-S04" },
    {
      href: "/governance/force-sync",
      label: m.workspace.governance.nav.forceSync,
      screenId: "SA-S05"
    },
    {
      href: "/governance/force-sync/approve",
      label: m.workspace.governance.nav.forceSyncApprove,
      screenId: "SA-S06"
    },
    { href: "/governance/audit", label: m.workspace.governance.nav.audit, screenId: "SA-S12" },
    {
      href: "/governance/operations",
      label: m.workspace.governance.nav.operations,
      screenId: "SA-S07"
    }
  ];

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  return (
    <WorkspaceShell
      navAriaLabel="Governance workspace navigation"
      navItems={navItems}
      onSignOut={handleSignOut}
      role="governance"
      signingOut={signingOut}
    >
      {children}
    </WorkspaceShell>
  );
}
