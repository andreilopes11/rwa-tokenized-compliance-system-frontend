"use client";

import Link from "next/link";
import { useMessages } from "@/shared/i18n/LocaleProvider";

type GlobalHeaderNavProps = {
  className?: string;
  variant?: "landing" | "default" | "workspace";
};

export function GlobalHeaderNav({ className = "global-app-header-nav", variant = "default" }: GlobalHeaderNavProps) {
  const m = useMessages();

  if (variant === "workspace") {
    return null;
  }

  if (variant === "landing") {
    return (
      <nav className={`${className} global-app-header-links`} aria-label={m.nav.primary}>
        <Link href="#use-cases">{m.landing.navUseCases}</Link>
        <Link href="#product">{m.landing.navProduct}</Link>
        <Link href="#how-to">{m.landing.navHowTo}</Link>
        <Link href="#platform">{m.landing.navPlatform}</Link>
        <Link href="#trust">{m.landing.navTrust}</Link>
      </nav>
    );
  }

  return (
    <nav className={`${className} global-app-header-links`} aria-label={m.nav.primary}>
      <Link href="/">{m.nav.home}</Link>
      <Link href="/login">{m.nav.signIn}</Link>
      <Link href="/register">{m.nav.signUp}</Link>
      <Link href="/terms">{m.nav.terms}</Link>
      <Link href="/privacy">{m.nav.privacy}</Link>
    </nav>
  );
}
