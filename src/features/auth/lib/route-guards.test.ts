import { describe, expect, it } from "vitest";
import {
  isInvestorOnlyBackendPath,
  isStaffSharedInvestorReadPath,
  workspacePathForRole
} from "./middleware-auth";

describe("workspacePathForRole", () => {
  it("maps the two roles to their workspaces", () => {
    expect(workspacePathForRole("investor")).toBe("/dashboard");
    expect(workspacePathForRole("governance")).toBe("/governance");
    expect(workspacePathForRole(null)).toBe("/governance");
  });
});

describe("BFF path guards", () => {
  it("blocks investor asset lifecycle paths for staff", () => {
    expect(isInvestorOnlyBackendPath("api/assets/abc/subscriptions")).toBe(true);
  });

  it("allows governance to read investor status", () => {
    expect(
      isStaffSharedInvestorReadPath(
        "api/investors/0x1111111111111111111111111111111111111111/status",
        "GET"
      )
    ).toBe(true);
  });

  it("denies staff POST on investor kyc", () => {
    expect(
      isStaffSharedInvestorReadPath("api/kyc/requests/abc", "POST")
    ).toBe(false);
  });
});
