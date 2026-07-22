"use client";

import { Menu, ShieldCheck, X, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import type { AuthRole } from "@/features/auth/lib/useAuthRole";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { Button } from "@/shared/ui/Button";
import { HeaderUtilities } from "@/shared/ui/HeaderUtilities";
import { RoleWorkspaceNav, type WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";

export type WorkspaceAppHeaderProps = {
  role: AuthRole;
  navItems: WorkspaceNavItem[];
  navAriaLabel: string;
  /** @deprecated Unused — role category under the logo replaces topbar subtitle. */
  context?: string;
  trailing?: ReactNode;
  onSignOut: () => void;
  signingOut?: boolean;
};

export function WorkspaceAppHeader({
  role,
  navItems,
  navAriaLabel,
  trailing,
  onSignOut,
  signingOut = false
}: WorkspaceAppHeaderProps) {
  const m = useMessages();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleLabel = m.workspace.roles[role];
  const homeHref = role === "investor" ? "/dashboard" : "/governance";

  useEffect(() => {
    setMenuOpen(false);
  }, [role]);

  useEffect(() => {
    function onResize() {
      if (window.matchMedia("(min-width: 961px)").matches) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="topbar workspace-topbar workspace-app-header">
      <div className="workspace-header-start">
        <div className="workspace-header-brand-block">
          <Link className="workspace-header-brand" href={homeHref}>
            <ShieldCheck aria-hidden size={22} />
            <span>{m.common.brand}</span>
          </Link>
          <span className="workspace-role-badge" data-role={role}>
            {roleLabel}
          </span>
        </div>
      </div>

      <button
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? m.nav.closeMenu : m.nav.openMenu}
        className="workspace-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
      </button>

      <RoleWorkspaceNav
        ariaLabel={navAriaLabel}
        className={menuOpen ? "is-open" : ""}
        id={menuId}
        items={navItems}
        onNavigate={() => setMenuOpen(false)}
      />

      <div className="workspace-header-actions">
        {trailing}
        <HeaderUtilities />
        <Button
          leadingIcon={<XCircle size={16} />}
          loading={signingOut}
          onClick={onSignOut}
          size="sm"
          variant="ghost"
        >
          {m.common.signOut}
        </Button>
      </div>
    </header>
  );
}
