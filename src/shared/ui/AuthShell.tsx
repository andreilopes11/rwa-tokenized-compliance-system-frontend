import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { appConfig } from "@/shared/config/app";
import { ExperienceFooter } from "./ExperienceFooter";
import { GlobalAppHeader } from "./GlobalAppHeader";

type AuthHighlight = {
  description: string;
  icon: ReactNode;
  title: string;
};

type AuthShellProps = {
  backLabel: string;
  children: ReactNode;
  eyebrow: string;
  footerStatus?: string;
  highlights: AuthHighlight[];
  highlightsTitle: string;
  subtitle: string;
  title: string;
};

export function AuthShell({
  backLabel,
  children,
  eyebrow,
  footerStatus,
  highlights,
  highlightsTitle,
  subtitle,
  title
}: AuthShellProps) {
  return (
    <main className="experience-shell auth-shell">
      <GlobalAppHeader className="auth-global-header" variant="default" />
      <div className="auth-shell-inner">
        <section className="auth-card">
          <aside className="auth-overview">
            <Link className="auth-back-link" href="/">
              <ArrowLeft aria-hidden size={16} />
              {backLabel}
            </Link>
            <div className="auth-brand">
              <ShieldCheck aria-hidden size={22} />
              <span>{appConfig.brandName}</span>
            </div>
            <span className="auth-kicker">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <div className="auth-highlights-block">
              <div className="auth-highlights-header">
                <strong>{highlightsTitle}</strong>
              </div>
              <div className="auth-highlights-list">
                {highlights.map((highlight) => (
                  <article className="auth-highlight" key={highlight.title}>
                    <div className="auth-highlight-icon">{highlight.icon}</div>
                    <div>
                      <strong>{highlight.title}</strong>
                      <p>{highlight.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>

          <section className="auth-panel">
            <div className="auth-panel-top">
              <span className="auth-panel-eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
            </div>
            {children}
          </section>
        </section>

        <ExperienceFooter status={footerStatus} />
      </div>
    </main>
  );
}
