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
const PREFLIGHT_MAX_AGE_MS = 30_000;

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
};

export function useTransferPreflight({
  walletAddress,
  recipientAddress,
  transferAmount,
  investorStatus,
  wrongNetwork,
  tokenPaused
}: UseTransferPreflightOptions) {
  const [preflight, setPreflight] = useState<TransferPreflightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const lastRunAt = useRef<number>(0);

  const debouncedRecipient = useDebouncedValue(recipientAddress, PREFLIGHT_DEBOUNCE_MS);
  const debouncedAmount = useDebouncedValue(transferAmount, PREFLIGHT_DEBOUNCE_MS);

  const runPreflight = useCallback(async () => {
    if (wrongNetwork) {
      setPreflight(null);
      setErrorKey("errors.wrongNetwork");
      return;
    }
    if (tokenPaused) {
      setPreflight(null);
      setErrorKey("errors.tokenPaused");
      return;
    }
    if (
      isChainActionBlocked(investorStatus?.status, investorStatus?.onChainVerified)
    ) {
      setPreflight(null);
      setErrorKey("errors.chainNotReady");
      return;
    }
    if (!isWalletAddress(walletAddress) || !isWalletAddress(debouncedRecipient)) {
      setPreflight(null);
      setErrorKey(null);
      return;
    }
    const amount = parseAmount(debouncedAmount);
    if (!amount) {
      setPreflight(null);
      setErrorKey(null);
      return;
    }

    setLoading(true);
    setErrorKey(null);
    try {
      const response = await preflightTransfer(walletAddress, debouncedRecipient, amount);
      setPreflight(response);
      lastRunAt.current = Date.now();
      if (!response.allowed) {
        setErrorKey(mapTransferPreflightReason(response.reasonCode));
      }
    } catch (err) {
      setPreflight(null);
      if (isApiError(err)) {
        setErrorKey(err.message);
      } else {
        setErrorKey("errors.requestFailed");
      }
    } finally {
      setLoading(false);
    }
  }, [
    debouncedAmount,
    debouncedRecipient,
    investorStatus?.onChainVerified,
    investorStatus?.status,
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

  async function refreshIfStale() {
    if (Date.now() - lastRunAt.current > PREFLIGHT_MAX_AGE_MS) {
      await runPreflight();
    }
  }

  return {
    preflight,
    loading,
    errorKey,
    canSignTransfer,
    runPreflight,
    refreshIfStale
  };
}
