"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type WorkspaceNavItem = {
  href: string;
  label: string;
  screenId?: string;
};

type RoleWorkspaceNavProps = {
  items: WorkspaceNavItem[];
  ariaLabel: string;
  className?: string;
  id?: string;
  onNavigate?: () => void;
};

function isRouteActive(pathname: string, href: string, allHrefs: string[]): boolean {
  if (href.startsWith("#")) {
    return false;
  }

  const exact = pathname === href;
  const nested = href !== "/" && pathname.startsWith(`${href}/`);
  if (!exact && !nested) {
    return false;
  }

  const moreSpecific = allHrefs.some(
    (other) =>
      other !== href &&
      !other.startsWith("#") &&
      other.length > href.length &&
      (pathname === other || pathname.startsWith(`${other}/`))
  );

  return !moreSpecific;
}

export function RoleWorkspaceNav({
  items,
  ariaLabel,
  className = "",
  id,
  onNavigate
}: RoleWorkspaceNavProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const routeHrefs = items.map((item) => item.href);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav
      aria-label={ariaLabel}
      className={`workspace-header-nav role-workspace-nav ${className}`.trim()}
      id={id}
    >
      <ul className="workspace-nav-links">
        {items.map((item) => {
          const isHash = item.href.startsWith("#");
          const active = isHash
            ? hash === item.href || (!hash && item.href === "#overview")
            : isRouteActive(pathname, item.href, routeHrefs);

          if (isHash) {
            return (
              <li key={item.href}>
                <a
                  aria-current={active ? "page" : undefined}
                  className={active ? "workspace-nav-link active" : "workspace-nav-link"}
                  href={item.href}
                  onClick={onNavigate}
                  {...(item.screenId ? { "data-screen-id": item.screenId } : {})}
                >
                  {item.label}
                </a>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "workspace-nav-link active" : "workspace-nav-link"}
                href={item.href}
                onClick={onNavigate}
                prefetch={false}
                {...(item.screenId ? { "data-screen-id": item.screenId } : {})}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
