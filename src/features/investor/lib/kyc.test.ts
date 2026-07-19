import { describe, expect, it } from "vitest";
import {
  isChainActionBlocked,
  isKycPollingComplete,
  isLifecycleReady,
  KYC_POLL_MS_MAX,
  KYC_POLL_MS_MIN,
  nextKycPollDelayMs
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

  it("samples poll delay within 5–15s", () => {
    for (let i = 0; i < 40; i += 1) {
      const delay = nextKycPollDelayMs();
      expect(delay).toBeGreaterThanOrEqual(KYC_POLL_MS_MIN);
      expect(delay).toBeLessThanOrEqual(KYC_POLL_MS_MAX);
    }
  });
});
