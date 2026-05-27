import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuTimelineScreen } from "./AuTimelineScreen";
import { AuExportScreen } from "./AuExportScreen";
import { renderWithProviders } from "@/test/renderWithProviders";

vi.mock("@/features/audit/api/client", () => ({
  listAdminAuditEvents: vi.fn().mockResolvedValue([]),
  listAdminBlockchainTransactions: vi.fn().mockResolvedValue([])
}));

describe("Auditor screens have no write controls", () => {
  it("AU-S01 timeline omits submit buttons", () => {
    const { container } = renderWithProviders(<AuTimelineScreen />);
    expect(container.querySelector('button[type="submit"]')).toBeNull();
    expect(screen.queryByRole("button", { name: /approve/i })).toBeNull();
  });

  it("AU-S04 export uses generate only (no form POST)", () => {
    const { container } = renderWithProviders(<AuExportScreen />);
    expect(container.querySelector("form")).toBeNull();
    expect(screen.getByRole("button", { name: /generate export/i })).toBeInTheDocument();
  });
});
