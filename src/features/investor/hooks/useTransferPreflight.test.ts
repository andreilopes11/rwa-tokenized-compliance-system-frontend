import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransferPreflight } from "./useTransferPreflight";

const preflightTransfer = vi.fn();

vi.mock("@/features/investor/api/client", () => ({
  preflightTransfer: (...args: unknown[]) => preflightTransfer(...args)
}));

const WALLET = "0x1111111111111111111111111111111111111111";
const RECIPIENT = "0x2222222222222222222222222222222222222222";

describe("useTransferPreflight", () => {
  beforeEach(() => {
    preflightTransfer.mockReset();
  });

  it("blocks sign when KYC is not on-chain verified", async () => {
    const { result } = renderHook(() =>
      useTransferPreflight({
        walletAddress: WALLET,
        recipientAddress: RECIPIENT,
        transferAmount: "1",
        investorStatus: { status: "APPROVED", onChainVerified: false } as never,
        wrongNetwork: false
      })
    );

    await waitFor(() => {
      expect(result.current.canSignTransfer).toBe(false);
      expect(result.current.errorKey).toBe("errors.chainNotReady");
    });
    expect(preflightTransfer).not.toHaveBeenCalled();
  });

  it("allows sign only after preflight returns allowed", async () => {
    preflightTransfer.mockResolvedValue({
      allowed: true,
      reasonCode: null
    });

    const { result } = renderHook(() =>
      useTransferPreflight({
        walletAddress: WALLET,
        recipientAddress: RECIPIENT,
        transferAmount: "1.5",
        investorStatus: { status: "APPROVED", onChainVerified: true } as never,
        wrongNetwork: false
      })
    );

    await waitFor(() => {
      expect(result.current.canSignTransfer).toBe(true);
    });
    expect(preflightTransfer).toHaveBeenCalled();

    let refreshed = false;
    await act(async () => {
      refreshed = await result.current.refreshBeforeSign();
    });
    expect(refreshed).toBe(true);
  });

  it("refreshBeforeSign returns false when API denies transfer", async () => {
    preflightTransfer.mockResolvedValue({
      allowed: false,
      reasonCode: "RECIPIENT_NOT_COMPLIANT"
    });

    const { result } = renderHook(() =>
      useTransferPreflight({
        walletAddress: WALLET,
        recipientAddress: RECIPIENT,
        transferAmount: "1",
        investorStatus: { status: "APPROVED", onChainVerified: true } as never,
        wrongNetwork: false
      })
    );

    await waitFor(() => {
      expect(result.current.preflight?.allowed).toBe(false);
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.canSignTransfer).toBe(false);

    let refreshed = true;
    await act(async () => {
      refreshed = await result.current.refreshBeforeSign();
    });
    expect(refreshed).toBe(false);
  });
});
