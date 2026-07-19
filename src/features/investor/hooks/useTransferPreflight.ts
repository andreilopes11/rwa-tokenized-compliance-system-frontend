"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preflightTransfer } from "@/features/investor/api/client";
import { isChainActionBlocked } from "@/features/investor/lib/kyc";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { isApiError } from "@/shared/api/errors";
import type { InvestorStatusResponse, TransferPreflightResponse } from "@/shared/api/types";
import { isWalletAddress } from "@/shared/lib/formatters";
import { mapTransferPreflightReason } from "@/shared/i18n/mapTransferPreflightReason";

const PREFLIGHT_DEBOUNCE_MS = 400;

function parseAmount(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

type UseTransferPreflightOptions = {
  walletAddress: string;
  recipientAddress: string;
  transferAmount: string;
  investorStatus: InvestorStatusResponse | null;
  wrongNetwork: boolean;
  tokenPaused?: boolean;
  /** When set, preflight uses the asset's T-REX suite (INV-10). */
  assetId?: string | null;
};

export function useTransferPreflight({
  walletAddress,
  recipientAddress,
  transferAmount,
  investorStatus,
  wrongNetwork,
  tokenPaused,
  assetId
}: UseTransferPreflightOptions) {
  const [preflight, setPreflight] = useState<TransferPreflightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const lastRunAt = useRef<number>(0);
  const latestAllowed = useRef(false);

  const debouncedRecipient = useDebouncedValue(recipientAddress, PREFLIGHT_DEBOUNCE_MS);
  const debouncedAmount = useDebouncedValue(transferAmount, PREFLIGHT_DEBOUNCE_MS);

  const runPreflight = useCallback(async (): Promise<boolean> => {
    latestAllowed.current = false;
    if (!isWalletAddress(walletAddress) || !isWalletAddress(debouncedRecipient)) {
      setPreflight(null);
      setErrorKey(null);
      return false;
    }
    const amount = parseAmount(debouncedAmount);
    if (!amount) {
      setPreflight(null);
      setErrorKey(null);
      return false;
    }

    if (wrongNetwork) {
      setPreflight(null);
      setErrorKey("errors.wrongNetwork");
      return false;
    }
    if (tokenPaused) {
      setPreflight(null);
      setErrorKey("errors.tokenPaused");
      return false;
    }
    if (!investorStatus) {
      setPreflight(null);
      setErrorKey(null);
      return false;
    }
    if (isChainActionBlocked(investorStatus.status, investorStatus.onChainVerified)) {
      setPreflight(null);
      setErrorKey("errors.chainNotReady");
      return false;
    }

    setLoading(true);
    setErrorKey(null);
    try {
      const response = await preflightTransfer(
        walletAddress,
        debouncedRecipient,
        amount,
        assetId ?? undefined
      );
      setPreflight(response);
      lastRunAt.current = Date.now();
      if (!response.allowed) {
        setErrorKey(mapTransferPreflightReason(response.reasonCode));
        latestAllowed.current = false;
        return false;
      }
      latestAllowed.current = true;
      return true;
    } catch (err) {
      setPreflight(null);
      latestAllowed.current = false;
      if (isApiError(err)) {
        setErrorKey(err.message);
      } else {
        setErrorKey("errors.requestFailed");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    assetId,
    debouncedAmount,
    debouncedRecipient,
    investorStatus,
    tokenPaused,
    walletAddress,
    wrongNetwork
  ]);

  useEffect(() => {
    void runPreflight();
  }, [runPreflight]);

  const canSignTransfer =
    Boolean(preflight?.allowed) &&
    !wrongNetwork &&
    !tokenPaused &&
    !isChainActionBlocked(investorStatus?.status, investorStatus?.onChainVerified) &&
    !loading;

  /** INV-S07: always refresh preflight before allowing a signature attempt. */
  async function refreshBeforeSign(): Promise<boolean> {
    const allowed = await runPreflight();
    return allowed && !wrongNetwork && !tokenPaused;
  }

  return {
    preflight,
    loading,
    errorKey,
    canSignTransfer,
    runPreflight,
    refreshBeforeSign,
    /** @deprecated Use refreshBeforeSign — always revalidates. */
    refreshIfStale: refreshBeforeSign,
    lastRunAtMs: () => lastRunAt.current,
    latestAllowed: () => latestAllowed.current
  };
}
