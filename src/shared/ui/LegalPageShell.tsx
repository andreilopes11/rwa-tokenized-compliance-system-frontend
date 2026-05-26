"use client";

import type { ReactNode } from "react";
import { useMessages } from "@/shared/i18n/LocaleProvider";
import { ExperienceFooter } from "./ExperienceFooter";
import { GlobalAppHeader } from "./GlobalAppHeader";

type LegalPageShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  updated: string;
};

export function LegalPageShell({ children, eyebrow, title, updated }: LegalPageShellProps) {
  const m = useMessages();

  return (
    <main className="experience-shell legal-shell">
      <GlobalAppHeader variant="compact" />

      <article className="legal-content">
        <header className="legal-content-head">
          <span className="legal-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="legal-updated">{updated}</p>
        </header>
        <div className="legal-prose">{children}</div>
      </article>

      <ExperienceFooter status={m.common.footerStatusLive} variant="default" />
    </main>
  );
}
