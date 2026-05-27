import { describe, expect, it } from "vitest";
import {
  isChainActionBlocked,
  isKycPollingComplete,
  isLifecycleReady
} from "./kyc";

describe("kyc lifecycle gating", () => {
  it("blocks chain actions while pending on chain", () => {
    expect(isChainActionBlocked("APPROVED_PENDING_CHAIN", false)).toBe(true);
  });

  it("blocks chain actions when approved but not verified on chain", () => {
    expect(isChainActionBlocked("APPROVED", false)).toBe(true);
  });

  it("allows lifecycle when approved and on-chain verified", () => {
    expect(isLifecycleReady({ status: "APPROVED", onChainVerified: true })).toBe(true);
  });

  it("keeps polling until approved with on-chain verification", () => {
    expect(isKycPollingComplete("APPROVED", false)).toBe(false);
    expect(isKycPollingComplete("APPROVED", true)).toBe(true);
    expect(isKycPollingComplete("REJECTED", false)).toBe(true);
  });
});
