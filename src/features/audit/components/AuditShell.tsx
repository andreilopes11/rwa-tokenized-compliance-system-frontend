"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoleWorkspaceNav, type WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { useMessages } from "@/shared/i18n/LocaleProvider";

export function AuditShell({ children }: { children: ReactNode }) {
  const m = useMessages();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const navItems: WorkspaceNavItem[] = [
    { href: "/audit", label: m.workspace.audit.nav.timeline, screenId: "AU-S01" },
    { href: "/audit/kyc", label: m.workspace.audit.nav.kyc, screenId: "AU-S02" },
    { href: "/audit/chain", label: m.workspace.audit.nav.chain, screenId: "AU-S03" },
    { href: "/audit/export", label: m.workspace.audit.nav.export, screenId: "AU-S04" },
    { href: "/audit/force-sync", label: m.workspace.audit.nav.forceSync, screenId: "AU-S05" }
  ];

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login?role=audit");
    router.refresh();
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title={m.workspace.audit.topbarTitle}
        subtitle={m.workspace.audit.topbarSubtitle}
        actions={
          <RoleWorkspaceNav
            ariaLabel="Audit workspace navigation"
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
