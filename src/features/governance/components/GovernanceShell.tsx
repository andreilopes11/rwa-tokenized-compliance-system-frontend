"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoleWorkspaceNav, type WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { useMessages } from "@/shared/i18n/LocaleProvider";

export function GovernanceShell({ children }: { children: ReactNode }) {
  const m = useMessages();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const navItems: WorkspaceNavItem[] = [
    { href: "/governance", label: m.workspace.governance.nav.overview, screenId: "SA-S01" },
    { href: "/governance/assets", label: m.workspace.governance.nav.assets, screenId: "SA-S02" },
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
    {
      href: "/governance/operations",
      label: m.workspace.governance.nav.operations,
      screenId: "SA-S07"
    }
  ];

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login?role=governance");
    router.refresh();
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title={m.workspace.governance.topbarTitle}
        subtitle={m.workspace.governance.topbarSubtitle}
        actions={
          <RoleWorkspaceNav
            ariaLabel="Governance workspace navigation"
            items={navItems}
            onSignOut={signOut}
            signingOut={signingOut}
          />
        }
      />
      <section className="content workspace-content">{children}</section>
    </main>
  );
}
