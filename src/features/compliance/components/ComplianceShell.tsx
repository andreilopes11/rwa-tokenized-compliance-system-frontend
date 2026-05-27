"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoleWorkspaceNav, type WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { useMessages } from "@/shared/i18n/LocaleProvider";

export function ComplianceShell({ children }: { children: ReactNode }) {
  const m = useMessages();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const navItems: WorkspaceNavItem[] = [
    { href: "/compliance", label: m.workspace.compliance.nav.dashboard, screenId: "CO-S01" },
    { href: "/compliance/kyc", label: m.workspace.compliance.nav.kyc, screenId: "CO-S02" },
    { href: "/compliance/revoke", label: m.workspace.compliance.nav.revoke, screenId: "CO-S04" },
    {
      href: "/compliance/subscriptions",
      label: m.workspace.compliance.nav.subscriptions,
      screenId: "CO-S05"
    },
    {
      href: "/compliance/redemptions",
      label: m.workspace.compliance.nav.redemptions,
      screenId: "CO-S06"
    },
    { href: "/compliance/audit", label: m.workspace.compliance.nav.audit, screenId: "CO-S07" }
  ];

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login?role=compliance");
    router.refresh();
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title={m.workspace.compliance.topbarTitle}
        subtitle={m.workspace.compliance.topbarSubtitle}
        actions={
          <RoleWorkspaceNav
            ariaLabel="Compliance workspace navigation"
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
