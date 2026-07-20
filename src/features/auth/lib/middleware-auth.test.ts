import { describe, expect, it } from "vitest";
import {
  denyBackendProxyAccess,
  isInvestorOnlyBackendPath,
  stripInvestorAclProbeParams
} from "./middleware-auth";

describe("isInvestorOnlyBackendPath", () => {
  it("flags investor self-service API paths", () => {
    expect(isInvestorOnlyBackendPath("api/kyc/requests")).toBe(true);
    expect(isInvestorOnlyBackendPath("api/investors/0xabc/positions")).toBe(true);
    expect(isInvestorOnlyBackendPath("api/assets/asset-id/subscriptions")).toBe(true);
  });

  it("allows shared catalog and admin paths", () => {
    expect(isInvestorOnlyBackendPath("api/assets")).toBe(false);
    expect(isInvestorOnlyBackendPath("api/admin/kyc/requests")).toBe(false);
    expect(isInvestorOnlyBackendPath("api/integrations/oracle-feed")).toBe(false);
  });
});

describe("denyBackendProxyAccess (two-role model)", () => {
  it("blocks investors from every admin path", () => {
    expect(denyBackendProxyAccess("investor", "api/admin/assets", "POST")).toBe(
      "errors.governanceSessionRequired"
    );
    expect(denyBackendProxyAccess("investor", "api/admin/reports/ops", "GET")).toBe(
      "errors.governanceSessionRequired"
    );
    expect(denyBackendProxyAccess("investor", "api/admin/kyc/requests/1/approve", "POST")).toBe(
      "errors.governanceSessionRequired"
    );
  });

  it("allows governance (SUPER_ADMIN) on the full admin surface", () => {
    expect(denyBackendProxyAccess("governance", "api/admin/assets", "POST")).toBeNull();
    expect(denyBackendProxyAccess("governance", "api/admin/assets/x/publish", "POST")).toBeNull();
    expect(denyBackendProxyAccess("governance", "api/admin/kyc/requests/1/approve", "POST")).toBeNull();
    expect(denyBackendProxyAccess("governance", "api/admin/force-sync/requests", "POST")).toBeNull();
    expect(denyBackendProxyAccess("governance", "api/admin/audit-events", "GET")).toBeNull();
  });

  it("keeps investor self-service paths off-limits to governance except staff reads", () => {
    expect(denyBackendProxyAccess("governance", "api/kyc/requests", "POST")).toBe(
      "errors.investorSessionRequired"
    );
    expect(
      denyBackendProxyAccess(
        "governance",
        "api/investors/0x1111111111111111111111111111111111111111/status",
        "GET"
      )
    ).toBeNull();
    expect(denyBackendProxyAccess("investor", "api/kyc/requests", "POST")).toBeNull();
  });
});

describe("stripInvestorAclProbeParams", () => {
  it("removes walletAddress and identityHash from catalog queries", () => {
    const params = new URLSearchParams({
      status: "ACTIVE",
      walletAddress: "0x1111111111111111111111111111111111111111",
      identityHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    });
    stripInvestorAclProbeParams("api/assets", params);
    expect(params.get("status")).toBe("ACTIVE");
    expect(params.has("walletAddress")).toBe(false);
    expect(params.has("identityHash")).toBe(false);
  });
});
