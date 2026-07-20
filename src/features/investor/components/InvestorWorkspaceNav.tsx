"use client";

import { useMessages } from "@/shared/i18n/LocaleProvider";
import type { WorkspaceNavItem } from "@/shared/ui/RoleWorkspaceNav";

const SECTIONS = [
  { id: "overview", key: "overview" as const, screenId: "INV-S01" },
  { id: "contracts-public", key: "contractsPublic" as const, screenId: "INV-S05" },
  { id: "contracts-private", key: "contractsPrivate" as const, screenId: "INV-S06" },
  { id: "portfolio", key: "portfolio" as const, screenId: "INV-S04" },
  { id: "onboarding", key: "onboarding" as const, screenId: "INV-S02" },
  { id: "compliance", key: "compliance" as const, screenId: "INV-S03" },
  { id: "transfer", key: "transfer" as const, screenId: "INV-S07" },
  { id: "activity", key: "activity" as const, screenId: "INV-S08" }
] as const;

export function useInvestorNavItems(): WorkspaceNavItem[] {
  const m = useMessages();
  return SECTIONS.map((section) => ({
    href: `#${section.id}`,
    label: m.workspace.investor.nav[section.key],
    screenId: section.screenId
  }));
}
