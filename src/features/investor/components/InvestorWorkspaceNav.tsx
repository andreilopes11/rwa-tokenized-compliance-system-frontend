"use client";

import { useMessages } from "@/shared/i18n/LocaleProvider";

const SECTIONS = [
  { id: "overview", key: "overview" as const, screenId: "INV-S01" },
  { id: "contracts-public", key: "contractsPublic" as const, screenId: "INV-S05" },
  { id: "contracts-private", key: "contractsPrivate" as const, screenId: "INV-S06" },
  { id: "portfolio", key: "portfolio" as const, screenId: "INV-S04" },
  { id: "onboarding", key: "onboarding" as const, screenId: "INV-S02" },
  { id: "compliance", key: "compliance" as const, screenId: "INV-S03" },
  { id: "transfer", key: "transfer" as const, screenId: "INV-S07" },
  { id: "activity", key: "activity" as const, screenId: "INV-S08" }
];

export function InvestorWorkspaceNav() {
  const m = useMessages();

  return (
    <nav className="investor-section-nav" aria-label="Investor dashboard sections">
      <ul className="workspace-nav-links">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              className="workspace-nav-link"
              data-screen-id={section.screenId}
              href={`#${section.id}`}
            >
              {m.workspace.investor.nav[section.key]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
