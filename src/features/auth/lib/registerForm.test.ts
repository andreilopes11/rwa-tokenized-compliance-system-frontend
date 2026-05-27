import { describe, expect, it } from "vitest";
import { getRegisterFormBlockers } from "./registerForm";
import { buildPasswordChecks } from "./validators";

describe("getRegisterFormBlockers", () => {
  it("returns no blockers for a valid investor registration", () => {
    const password = "SecurePass1";
    const blockers = getRegisterFormBlockers({
      confirmPassword: password,
      email: "user@company.com",
      inviteCode: "",
      password,
      passwordChecks: buildPasswordChecks(password),
      role: "investor",
      walletAddress: ""
    });

    expect(blockers).toEqual([]);
  });

  it("requires invite code for governance registration", () => {
    const password = "SecurePass1";
    const blockers = getRegisterFormBlockers({
      confirmPassword: password,
      email: "admin@company.com",
      inviteCode: "",
      password,
      passwordChecks: buildPasswordChecks(password),
      role: "governance",
      walletAddress: ""
    });

    expect(blockers).toContain("Admin invite code is required.");
  });
});
