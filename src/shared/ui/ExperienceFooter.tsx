"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { appConfig } from "@/shared/config/app";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { ThemeToggle } from "./ThemeToggle";

export type ExperienceFooterLink = {
  external?: boolean;
  href: string;
  label: string;
};

type ExperienceFooterProps = {
  extraLinks?: ExperienceFooterLink[];
  status?: string;
  /** `workspace` = compact institutional footer for logged-in shells. */
  variant?: "default" | "landing" | "workspace";
};

export function ExperienceFooter({
  extraLinks = [],
  status,
  variant = "default"
}: ExperienceFooterProps) {
  const m = useMessages();
  const footerCopy = m.footer;

  if (variant === "workspace") {
    return (
      <footer className="experience-footer experience-footer-workspace">
        <div className="experience-footer-workspace-inner">
          <Link className="experience-footer-logo" href="/">
            <ShieldCheck aria-hidden size={18} />
            <strong>{appConfig.brandName}</strong>
          </Link>
          <nav aria-label="Legal links" className="experience-footer-workspace-nav">
            <Link href="/terms">{footerCopy.terms}</Link>
            <Link href="/privacy">{footerCopy.privacy}</Link>
          </nav>
          <span className="muted">{footerCopy.copyright}</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`experience-footer${variant === "landing" ? " experience-footer-landing" : ""}`}>
      <div className="experience-footer-grid">
        <div className="experience-footer-brand">
          <Link className="experience-footer-logo" href="/">
            <ShieldCheck aria-hidden size={20} />
            <strong>{appConfig.brandName}</strong>
          </Link>
          <p>{footerCopy.tagline}</p>
        </div>

        <div className="experience-footer-col">
          <strong>{footerCopy.productTitle}</strong>
          <nav aria-label="Product links">
            {footerCopy.productLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="experience-footer-col">
          <strong>{footerCopy.resourcesTitle}</strong>
          <nav aria-label="Resource links">
            {footerCopy.resourceLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            {extraLinks.map((link) => (
              <Link
                href={link.href}
                key={`${link.href}:${link.label}`}
                rel={link.external ? "noopener noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="experience-footer-col">
          <strong>{footerCopy.legalTitle}</strong>
          <nav aria-label="Legal links">
            <Link href="/terms">{footerCopy.terms}</Link>
            <Link href="/privacy">{footerCopy.privacy}</Link>
          </nav>
        </div>
      </div>

      <div className="experience-footer-bottom">
        <span>{footerCopy.copyright}</span>
        <div className="experience-footer-bottom-actions">
          {status ? <span className="status-chip">{status}</span> : null}
          <ThemeToggle showLabel />
        </div>
      </div>
    </footer>
  );
}
