import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveAdminSubscription,
  createAdminAssetOffering,
  fetchAdminAssetComplianceRules,
  fetchAdminInvestorComplianceProfile,
  listAdminKycRequests,
  listAdminSubscriptions,
  updateAdminAssetComplianceRules,
  updateAdminInvestorComplianceProfile
} from "@/features/admin/api/client";
import { createSubscription } from "@/features/investor/api/client";
import {
  isWalletAddress,
  shortenAddress,
  statusClass,
  statusLabel
} from "@/shared/lib/formatters";

describe("wallet and status helpers", () => {
  it("validates EVM wallet addresses", () => {
    expect(isWalletAddress("0x1111111111111111111111111111111111111111")).toBe(true);
    expect(isWalletAddress("0xnot-a-wallet")).toBe(false);
  });

  it("shortens displayable wallet addresses", () => {
    expect(shortenAddress("0x1111111111111111111111111111111111111111")).toBe("0x1111...1111");
    expect(shortenAddress("")).toBe("Not connected");
  });

  it("maps status values to labels and visual classes", () => {
    expect(statusLabel("FAILED_ON_CHAIN")).toBe("FAILED ON CHAIN");
    expect(statusClass("APPROVED")).toBe("approved");
    expect(statusClass(undefined)).toBe("pending");
  });

  it("sends authenticated session requests for protected admin APIs", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", fetchMock);

    await listAdminKycRequests({ status: "PENDING", limit: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/kyc/requests?status=PENDING&limit=10"),
      expect.objectContaining({
        credentials: "same-origin",
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });

  it("sends authenticated session requests for asset creation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    await createAdminAssetOffering({
      name: "Tokenized Treasury Fund",
      symbol: "TTF",
      assetType: "TREASURY_FUND",
      jurisdiction: "US",
      status: "DRAFT",
      supplyCap: 500000,
      navPrice: 100,
      issuerName: "RWA Compliance Issuer"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/assets"),
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });

  it("posts investor subscription requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    await createSubscription("33333333-3333-4333-8333-333333333333", {
      walletAddress: "0x1111111111111111111111111111111111111111",
      amount: 25
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/assets/33333333-3333-4333-8333-333333333333/subscriptions"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          walletAddress: "0x1111111111111111111111111111111111111111",
          amount: 25
        })
      })
    );
  });

  it("sends authenticated session requests for lifecycle queues and approvals", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", fetchMock);

    await listAdminSubscriptions({ status: "PENDING", limit: 10 });
    await approveAdminSubscription(
      "44444444-4444-4444-8444-444444444444",
      "Issuer allocation approved."
    );

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/subscriptions?status=PENDING&limit=10"),
      expect.objectContaining({
        credentials: "same-origin"
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/subscriptions/44444444-4444-4444-8444-444444444444/approve"),
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin"
      })
    );
  });

  it("sends authenticated session requests for compliance profiles and rules", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchAdminInvestorComplianceProfile("0x1111111111111111111111111111111111111111");
    await updateAdminInvestorComplianceProfile("0x1111111111111111111111111111111111111111", {
      investorType: "ACCREDITED",
      jurisdiction: "US",
      accredited: true,
      qualifiedInvestor: false,
      revoked: false
    });
    await fetchAdminAssetComplianceRules("33333333-3333-4333-8333-333333333333");
    await updateAdminAssetComplianceRules("33333333-3333-4333-8333-333333333333", {
      allowedInvestorTypes: ["ACCREDITED"],
      allowedJurisdictions: ["US"],
      requiresAccreditation: true,
      requiresQualifiedInvestor: false,
      lockupDays: 90,
      maxPositionAmount: 250
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "/api/admin/investors/0x1111111111111111111111111111111111111111/compliance-profile"
      ),
      expect.objectContaining({
        credentials: "same-origin"
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/assets/33333333-3333-4333-8333-333333333333/compliance-rules"),
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin"
      })
    );
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
