"use client";

import { useEffect, useState } from "react";
import { fetchInvestorStatus, fetchKycRequest } from "@/features/investor/api/client";
import {
  isKycPollingComplete,
  KYC_POLL_MS_MAX,
  KYC_POLL_MS_MIN,
  nextKycPollDelayMs
} from "@/features/investor/lib/kyc";
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
    let timeoutId = 0;
    setPolling(true);

    const schedule = (delayMs: number) => {
      timeoutId = window.setTimeout(() => {
        void tick();
      }, delayMs);
    };

    const tick = async () => {
      try {
        const [kyc, statusResponse] = await Promise.all([
          fetchKycRequest(requestId),
          fetchInvestorStatus(walletAddress)
        ]);
        if (cancelled) {
          return;
        }
        onUpdate?.(kyc, statusResponse);
        if (isKycPollingComplete(statusResponse.status, statusResponse.onChainVerified)) {
          setPolling(false);
          return;
        }
        schedule(nextKycPollDelayMs(KYC_POLL_MS_MIN, KYC_POLL_MS_MAX));
      } catch {
        // Non-fatal; manual refresh remains available.
        if (!cancelled) {
          schedule(nextKycPollDelayMs(KYC_POLL_MS_MIN, KYC_POLL_MS_MAX));
        }
      }
    };

    void tick();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      setPolling(false);
    };
  }, [enabled, onUpdate, requestId, walletAddress]);

  return { polling };
}
