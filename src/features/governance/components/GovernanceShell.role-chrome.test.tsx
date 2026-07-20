import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GovernanceShell } from "./GovernanceShell";
import { useInvestorNavItems } from "@/features/investor/components/InvestorWorkspaceNav";
import { WorkspaceAppHeader } from "@/shared/ui/WorkspaceAppHeader";
import { renderWithProviders } from "@/test/renderWithProviders";

function InvestorChromeProbe() {
  const navItems = useInvestorNavItems();
  return (
    <WorkspaceAppHeader
      navAriaLabel="Investor workspace navigation"
      navItems={navItems}
      onSignOut={() => {}}
      role="investor"
    />
  );
}

describe("Role chrome (two-role model)", () => {
  it("governance workspace exposes the full management surface", () => {
    renderWithProviders(
      <GovernanceShell>
        <p>console</p>
      </GovernanceShell>
    );

    const nav = screen.getByLabelText("Governance workspace navigation");
    expect(nav.querySelector('a[href="/governance/assets"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/governance/kyc"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/governance/lifecycle"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/governance/pause"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/governance/force-sync"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/governance/audit"]')).not.toBeNull();
  });

  it("investor chrome has no governance/management controls", () => {
    renderWithProviders(<InvestorChromeProbe />);

    const nav = screen.getByLabelText("Investor workspace navigation");
    expect(nav.querySelector('a[href^="/governance"]')).toBeNull();
    expect(nav.querySelector('a[href="/governance/kyc"]')).toBeNull();
    expect(nav.querySelector('a[href="/governance/pause"]')).toBeNull();
    expect(screen.queryByRole("link", { name: /force.?sync/i })).toBeNull();
  });
});
