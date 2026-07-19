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

describe("denyBackendProxyAccess (TECHNICAL §3)", () => {
  it("returns 403 key when compliance hits governance assets", () => {
    expect(denyBackendProxyAccess("compliance", "api/admin/assets", "GET")).toBe(
      "errors.governanceSessionRequired"
    );
    expect(denyBackendProxyAccess("compliance", "api/admin/assets/x/publish", "POST")).toBe(
      "errors.governanceSessionRequired"
    );
  });

  it("returns 403 key when investor hits admin assets", () => {
    expect(denyBackendProxyAccess("investor", "api/admin/assets", "POST")).toBe(
      "errors.governanceSessionRequired"
    );
    expect(denyBackendProxyAccess("investor", "api/admin/reports/ops", "GET")).toBe(
      "errors.auditSessionRequired"
    );
  });

  it("allows governance on admin assets", () => {
    expect(denyBackendProxyAccess("governance", "api/admin/assets", "POST")).toBeNull();
    expect(denyBackendProxyAccess("governance", "api/admin/assets/x/publish", "POST")).toBeNull();
  });

  it("blocks governance from compliance KYC mutate paths", () => {
    expect(denyBackendProxyAccess("governance", "api/admin/kyc/requests/1/approve", "POST")).toBe(
      "errors.complianceSessionRequired"
    );
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
