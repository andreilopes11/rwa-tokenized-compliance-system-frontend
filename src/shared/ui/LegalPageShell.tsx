import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { appConfig } from "@/shared/config/app";
import { copy } from "@/shared/lib/copy";
import { ExperienceFooter } from "./ExperienceFooter";
import { ThemeToggle } from "./ThemeToggle";

type LegalPageShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  updated: string;
};

export function LegalPageShell({ children, eyebrow, title, updated }: LegalPageShellProps) {
  return (
    <main className="experience-shell legal-shell">
      <header className="legal-header">
        <Link className="legal-brand" href="/">
          <ShieldCheck aria-hidden size={22} />
          {appConfig.brandName}
        </Link>
        <nav className="legal-header-nav" aria-label="Legal navigation">
          <Link href="/">{copy.common.backHome}</Link>
          <Link href="/terms">{copy.footer.terms}</Link>
          <Link href="/privacy">{copy.footer.privacy}</Link>
          <ThemeToggle />
        </nav>
      </header>

      <article className="legal-content">
        <header className="legal-content-head">
          <span className="legal-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="legal-updated">{updated}</p>
        </header>
        <div className="legal-prose">{children}</div>
      </article>

      <ExperienceFooter status={copy.common.footerStatusLive} variant="default" />
    </main>
  );
}
