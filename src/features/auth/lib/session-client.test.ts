import { describe, expect, it } from "vitest";
import { sanitizeNextPath, workspacePathForRole } from "./session-client";

describe("session-client", () => {
  it("maps roles to workspace homes", () => {
    expect(workspacePathForRole("investor")).toBe("/dashboard");
    expect(workspacePathForRole("governance")).toBe("/governance");
    expect(workspacePathForRole(null)).toBe("/dashboard");
  });

  it("sanitizes next paths against open redirects", () => {
    expect(sanitizeNextPath("/dashboard/portfolio", "investor")).toBe("/dashboard/portfolio");
    expect(sanitizeNextPath("/governance/kyc", "governance")).toBe("/governance/kyc");
    expect(sanitizeNextPath("https://evil.example", "investor")).toBe("/dashboard");
    expect(sanitizeNextPath("//evil.example", "governance")).toBe("/governance");
    expect(sanitizeNextPath("/login", "investor")).toBe("/dashboard");
    expect(sanitizeNextPath("/api/auth/session", "investor")).toBe("/dashboard");
    expect(sanitizeNextPath("/terms", "investor")).toBe("/dashboard");
  });
});
