"use client";

import { useEffect, useState } from "react";
import { fetchInvestorStatus, fetchKycRequest } from "@/features/investor/api/client";
import { isKycPollingComplete, KYC_POLL_MS } from "@/features/investor/lib/kyc";
import type { InvestorStatusResponse, KycRequestResponse } from "@/shared/api/types";

type UseKycPollingOptions = {
  requestId: string | undefined;
  walletAddress: string | undefined;
  enabled: boolean;
  onUpdate?: (request: KycRequestResponse, status: InvestorStatusResponse) => void;
};

export function useKycPolling({
  requestId,
  walletAddress,
  enabled,
  onUpdate
}: UseKycPollingOptions) {
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!enabled || !requestId || !walletAddress) {
      setPolling(false);
      return;
    }

    let cancelled = false;
    setPolling(true);

    const tick = async () => {
      try {
        const [kyc, statusResponse] = await Promise.all([
          fetchKycRequest(requestId),
          fetchInvestorStatus(walletAddress)
        ]);
        if (!cancelled) {
          onUpdate?.(kyc, statusResponse);
          if (isKycPollingComplete(statusResponse.status, statusResponse.onChainVerified)) {
            setPolling(false);
          }
        }
      } catch {
        // Non-fatal; manual refresh remains available.
      }
    };

    void tick();
    const intervalId = window.setInterval(() => void tick(), KYC_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      setPolling(false);
    };
  }, [enabled, onUpdate, requestId, walletAddress]);

  return { polling };
}
