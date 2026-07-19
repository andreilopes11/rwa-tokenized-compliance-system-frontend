import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComplianceShell } from "./ComplianceShell";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("ComplianceShell role chrome", () => {
  it("hides governance-only controls (pause, force-sync, asset create)", () => {
    renderWithProviders(
      <ComplianceShell>
        <p>queue</p>
      </ComplianceShell>
    );

    expect(screen.queryByRole("link", { name: /governance/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /force.?sync/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /pause/i })).toBeNull();

    const nav = screen.getByLabelText("Compliance workspace navigation");
    expect(nav.querySelector('a[href="/governance"]')).toBeNull();
    expect(nav.querySelector('a[href="/governance/pause"]')).toBeNull();
    expect(nav.querySelector('a[href="/governance/force-sync"]')).toBeNull();
    expect(nav.querySelector('a[href="/compliance/kyc"]')).not.toBeNull();
  });
});
