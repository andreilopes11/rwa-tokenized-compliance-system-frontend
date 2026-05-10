import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveAdminSubscription,
  createSubscription,
  createAdminAssetOffering,
  fetchAdminAssetComplianceRules,
  fetchAdminInvestorComplianceProfile,
  isWalletAddress,
  listAdminSubscriptions,
  listAdminKycRequests,
  shortenAddress,
  statusClass,
  statusLabel,
  updateAdminAssetComplianceRules,
  updateAdminInvestorComplianceProfile
} from "./api";

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

  it("sends admin token headers for protected requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", fetchMock);

    await listAdminKycRequests("local-admin-token", { status: "PENDING", limit: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/kyc/requests?status=PENDING&limit=10",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
        })
      })
    );
  });

  it("sends admin token headers for asset creation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    await createAdminAssetOffering("local-admin-token", {
      name: "Tokenized Treasury Fund",
      symbol: "TTF",
      assetType: "TREASURY_FUND",
      jurisdiction: "US",
      status: "DRAFT",
      supplyCap: 500000,
      navPrice: 100,
      issuerName: "Demo RWA Issuer"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/assets",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
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
      "http://localhost:8080/api/assets/33333333-3333-4333-8333-333333333333/subscriptions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          walletAddress: "0x1111111111111111111111111111111111111111",
          amount: 25
        })
      })
    );
  });

  it("sends admin token headers for lifecycle queues and approvals", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", fetchMock);

    await listAdminSubscriptions("local-admin-token", { status: "PENDING", limit: 10 });
    await approveAdminSubscription(
      "local-admin-token",
      "44444444-4444-4444-8444-444444444444",
      "Issuer allocation approved."
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/subscriptions?status=PENDING&limit=10",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
        })
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/subscriptions/44444444-4444-4444-8444-444444444444/approve",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
        })
      })
    );
  });

  it("sends admin token headers for compliance profiles and rules", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchAdminInvestorComplianceProfile(
      "local-admin-token",
      "0x1111111111111111111111111111111111111111"
    );
    await updateAdminInvestorComplianceProfile(
      "local-admin-token",
      "0x1111111111111111111111111111111111111111",
      {
        investorType: "ACCREDITED",
        jurisdiction: "US",
        accredited: true,
        qualifiedInvestor: false,
        revoked: false
      }
    );
    await fetchAdminAssetComplianceRules(
      "local-admin-token",
      "33333333-3333-4333-8333-333333333333"
    );
    await updateAdminAssetComplianceRules(
      "local-admin-token",
      "33333333-3333-4333-8333-333333333333",
      {
        allowedInvestorTypes: ["ACCREDITED"],
        allowedJurisdictions: ["US"],
        requiresAccreditation: true,
        requiresQualifiedInvestor: false,
        lockupDays: 90,
        maxPositionAmount: 250
      }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/investors/0x1111111111111111111111111111111111111111/compliance-profile",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
        })
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/admin/assets/33333333-3333-4333-8333-333333333333/compliance-rules",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Admin-Token": "local-admin-token"
        })
      })
    );
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
