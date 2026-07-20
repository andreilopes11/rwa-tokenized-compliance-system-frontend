import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { SaAssetsScreen } from "./SaAssetsScreen";

describe("SaAssetsScreen (SA-S02)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a DRAFT with PUBLIC|PRIVATE and publishes to ACTIVE", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url.includes("/api/admin/assets") && method === "POST" && !url.includes("publish")) {
        const body = JSON.parse(String(init?.body ?? "{}")) as {
          symbol: string;
          visibility: string;
          status: string;
        };
        expect(body.status).toBe("DRAFT");
        expect(body.visibility).toBe("PUBLIC");
        return jsonResponse({
          assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          name: body.symbol === "VGNEW" ? "New Fund" : "x",
          symbol: body.symbol,
          assetType: "FUND",
          jurisdiction: "EU",
          status: "DRAFT",
          visibility: body.visibility,
          supplyCap: 1_000_000,
          navPrice: 100,
          issuerName: "VaultGuard Issuer",
          issuerMetadata: "",
          tokenAddress: null,
          createdAt: "2026-07-12T00:00:00Z",
          updatedAt: "2026-07-12T00:00:00Z"
        });
      }

      if (url.includes("/publish") && method === "POST") {
        return jsonResponse({
          assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          name: "New Fund",
          symbol: "VGNEW",
          assetType: "FUND",
          jurisdiction: "EU",
          status: "ACTIVE",
          visibility: "PUBLIC",
          supplyCap: 1_000_000,
          navPrice: 100,
          issuerName: "VaultGuard Issuer",
          issuerMetadata: "",
          tokenAddress: null,
          createdAt: "2026-07-12T00:00:00Z",
          updatedAt: "2026-07-12T00:00:01Z"
        });
      }

      if (url.includes("/api/admin/assets") && method === "GET") {
        return jsonResponse([
          {
            assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
            name: "New Fund",
            symbol: "VGNEW",
            assetType: "FUND",
            jurisdiction: "EU",
            status: "DRAFT",
            visibility: "PUBLIC",
            supplyCap: 1_000_000,
            navPrice: 100,
            issuerName: "VaultGuard Issuer",
            issuerMetadata: "",
            tokenAddress: null,
            createdAt: "2026-07-12T00:00:00Z",
            updatedAt: "2026-07-12T00:00:00Z"
          }
        ]);
      }

      return jsonResponse([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<SaAssetsScreen />);

    await screen.findByText(/my contracts/i);

    fireEvent.change(screen.getByLabelText(/^symbol$/i), { target: { value: "VGNEW" } });
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "New Fund" } });
    fireEvent.change(screen.getByLabelText(/^visibility$/i), { target: { value: "PUBLIC" } });
    fireEvent.click(screen.getByRole("button", { name: /create draft contract/i }));

    await waitFor(() => {
      expect(screen.getByText(/contract created as draft/i)).toBeInTheDocument();
    });

    await screen.findByText(/VGNEW/);
    fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

    await waitFor(() => {
      expect(screen.getByText(/contract published \(active\)/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/assets"),
      expect.objectContaining({ method: "POST" })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/publish"),
      expect.objectContaining({ method: "POST" })
    );
  });
});

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload
  } as Response;
}
