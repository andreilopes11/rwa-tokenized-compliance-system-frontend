import { describe, expect, it } from "vitest";
import { AdminDashboard } from "./AdminDashboard";

describe("AdminDashboard orphan", () => {
  it("refuses to render so governance rules cannot be bypassed", () => {
    expect(() => AdminDashboard()).toThrow(/retired/i);
  });
});
