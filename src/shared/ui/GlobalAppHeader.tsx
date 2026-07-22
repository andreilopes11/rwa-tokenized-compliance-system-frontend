"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { useOptionalSessionStatus } from "@/shared/providers/SessionStatusProvider";
import { GlobalHeaderNav } from "./GlobalHeaderNav";
import { HeaderUtilities } from "./HeaderUtilities";

export type GlobalHeaderVariant = "landing" | "default" | "compact" | "auth";

type GlobalAppHeaderProps = {
  actions?: ReactNode;
  className?: string;
  showLandingNav?: boolean;
  variant?: GlobalHeaderVariant;
};

export function GlobalAppHeader({
  actions,
  className = "",
  showLandingNav = false,
  variant = "default"
}: GlobalAppHeaderProps) {
  const m = useMessages();
  const sessionStatus = useOptionalSessionStatus();
  const authenticated = sessionStatus?.status === "authenticated";
  const workspaceHref = sessionStatus?.workspaceHref ?? "/dashboard";

  const headerClass =
    variant === "landing"
      ? `landing-nav global-app-header ${className}`.trim()
      : variant === "compact"
        ? `legal-header global-app-header ${className}`.trim()
        : variant === "auth"
          ? `global-app-header global-app-header-inline global-app-header-auth ${className}`.trim()
          : `global-app-header global-app-header-inline ${className}`.trim();

  return (
    <header className={headerClass}>
      <Link className={variant === "landing" ? "landing-brand" : "legal-brand"} href="/">
        <ShieldCheck aria-hidden size={22} />
        <span>{m.common.brand}</span>
      </Link>

      {variant === "auth" ? null : showLandingNav || variant === "default" ? (
        <GlobalHeaderNav variant={showLandingNav ? "landing" : "default"} />
      ) : variant === "compact" ? (
        <GlobalHeaderNav className="legal-header-nav global-app-header-nav" />
      ) : null}

      <div className={variant === "landing" ? "landing-nav-actions" : "global-app-header-actions"}>
        {actions}
        <HeaderUtilities themeToggleClassName={variant === "landing" ? "landing-theme-toggle" : undefined} />
        {variant === "landing" ? (
          authenticated ? (
            <>
              <button
                className="landing-nav-ghost"
                onClick={() => {
                  void sessionStatus?.signOut();
                }}
                type="button"
              >
                {m.common.signOut}
              </button>
              <Link className="landing-nav-cta" href={workspaceHref}>
                {m.landing.returnToWorkspace}
                <ArrowRight aria-hidden size={16} />
              </Link>
            </>
          ) : (
            <>
              <Link className="landing-nav-ghost" href="/login">
                {m.landing.loginCta}
              </Link>
              <Link className="landing-nav-cta" href="/register">
                {m.landing.joinCta}
              </Link>
            </>
          )
        ) : null}
      </div>
    </header>
  );
}
