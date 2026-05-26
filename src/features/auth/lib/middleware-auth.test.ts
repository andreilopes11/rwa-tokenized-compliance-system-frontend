import { describe, expect, it } from "vitest";
import { isInvestorOnlyBackendPath } from "./middleware-auth";

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
