import type { InvestorStatusResponse, KycRequestResponse } from "@/shared/api/types";

export const KYC_POLL_MS_MIN = 5000;
export const KYC_POLL_MS_MAX = 15000;
export const KYC_POLL_MS = 10000;

const TERMINAL_WITHOUT_CHAIN = new Set(["REJECTED", "REVOKED", "FAILED_ON_CHAIN"]);

export function isKycPollingComplete(
  status: string | undefined,
  onChainVerified: boolean | undefined
): boolean {
  if (!status) {
    return false;
  }
  if (TERMINAL_WITHOUT_CHAIN.has(status)) {
    return true;
  }
  return status === "APPROVED" && Boolean(onChainVerified);
}

export function isLifecycleReady(
  investorStatus: Pick<InvestorStatusResponse, "status" | "onChainVerified"> | null | undefined
): boolean {
  if (!investorStatus) {
    return false;
  }
  return investorStatus.status === "APPROVED" && investorStatus.onChainVerified;
}

export function isChainActionBlocked(
  status: string | undefined,
  onChainVerified: boolean | undefined
): boolean {
  if (!status) {
    return true;
  }
  if (status === "APPROVED_PENDING_CHAIN" || status === "FAILED_ON_CHAIN") {
    return true;
  }
  if (status === "APPROVED" && !onChainVerified) {
    return true;
  }
  return !isLifecycleReady({ status, onChainVerified } as InvestorStatusResponse);
}

export function kycStatusTone(
  status: string
): "success" | "warning" | "danger" | "neutral" {
  if (status === "APPROVED") {
    return "success";
  }
  if (
    status === "SUBMITTED" ||
    status === "IN_REVIEW" ||
    status === "APPROVED_PENDING_CHAIN" ||
    status === "PENDING"
  ) {
    return "warning";
  }
  if (status === "REJECTED" || status === "REVOKED" || status === "FAILED_ON_CHAIN") {
    return "danger";
  }
  return "neutral";
}
