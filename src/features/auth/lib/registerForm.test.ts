import { describe, expect, it } from "vitest";
import { getRegisterFormBlockers } from "./registerForm";
import { buildPasswordChecks } from "./validators";

describe("getRegisterFormBlockers", () => {
  it("returns no blockers for a valid investor registration", () => {
    const password = "SecurePass1";
    const blockers = getRegisterFormBlockers({
      confirmPassword: password,
      email: "user@company.com",
      password,
      passwordChecks: buildPasswordChecks(password),
      role: "investor",
      walletAddress: ""
    });

    expect(blockers).toEqual([]);
  });

  it("allows governance registration without invite code", () => {
    const password = "SecurePass1";
    const blockers = getRegisterFormBlockers({
      confirmPassword: password,
      email: "admin@company.com",
      password,
      passwordChecks: buildPasswordChecks(password),
      role: "governance",
      walletAddress: ""
    });

    expect(blockers).toEqual([]);
  });
});
