import { describe, expect, it } from "vitest";
import {
  buildPasswordChecks,
  isValidEmail,
  meetsPasswordPolicy,
  passwordStrengthScore
} from "./validators";

describe("auth validators", () => {
  it("accepts a password that meets the required policy", () => {
    const checks = buildPasswordChecks("SecurePass1");
    expect(meetsPasswordPolicy(checks)).toBe(true);
    expect(passwordStrengthScore(checks)).toBe(3);
  });

  it("rejects passwords missing required rules", () => {
    const checks = buildPasswordChecks("short1");
    expect(meetsPasswordPolicy(checks)).toBe(false);
  });

  it("validates email addresses", () => {
    expect(isValidEmail("user@company.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });
});
