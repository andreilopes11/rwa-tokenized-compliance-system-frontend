"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XCircle } from "lucide-react";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { Button } from "@/shared/ui/Button";

export type WorkspaceNavItem = {
  href: string;
  label: string;
  screenId?: string;
};

type RoleWorkspaceNavProps = {
  items: WorkspaceNavItem[];
  onSignOut: () => void;
  signingOut: boolean;
  ariaLabel: string;
};

export function RoleWorkspaceNav({
  items,
  onSignOut,
  signingOut,
  ariaLabel
}: RoleWorkspaceNavProps) {
  const pathname = usePathname();
  const m = useMessages();

  return (
    <nav className="nav-actions workspace-nav role-workspace-nav" aria-label={ariaLabel}>
      <ul className="workspace-nav-links">
        {items.map((item) => {
          const active =
            item.href === pathname ||
            (item.href !== "/" && pathname.startsWith(item.href) && item.href.length > 1);
          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "workspace-nav-link active" : "workspace-nav-link"}
                href={item.href}
                {...(item.screenId ? { "data-screen-id": item.screenId } : {})}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Button
        leadingIcon={<XCircle size={16} />}
        loading={signingOut}
        onClick={onSignOut}
        size="sm"
        variant="ghost"
      >
        {m.common.signOut}
      </Button>
    </nav>
  );
}
