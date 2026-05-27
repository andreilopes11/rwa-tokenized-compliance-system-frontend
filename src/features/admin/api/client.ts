import { authorizedRequest, jsonFetch, queryString } from "@/shared/api/http";
import type {
  AssetComplianceRulesResponse,
  AssetComplianceRulesUpdateRequest,
  AssetOfferingCreateRequest,
  AssetOfferingResponse,
  AssetOfferingStatus,
  AuditEventResponse,
  BlockchainTransactionResponse,
  InvestorComplianceProfileResponse,
  InvestorComplianceProfileUpdateRequest,
  InvestorStatusResponse,
  KycRequestResponse,
  KycStatus,
  LifecycleStatus,
  OperationsReportResponse,
  OracleFeedResponse,
  PauseStatusResponse,
  RedemptionResponse,
  RegulatoryFeedResponse,
  SubscriptionResponse
} from "@/shared/api/types";

export async function listAdminKycRequests(
  filters: { status?: KycStatus | ""; walletAddress?: string; limit?: number } = {}
): Promise<KycRequestResponse[]> {
  return jsonFetch<KycRequestResponse[]>(
    `/api/admin/kyc/requests${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function approveAdminKycRequest(requestId: string): Promise<KycRequestResponse> {
  return jsonFetch<KycRequestResponse>(
    `/api/admin/kyc/requests/${encodeURIComponent(requestId)}/approve`,
    authorizedRequest({ method: "POST" })
  );
}

export async function rejectAdminKycRequest(
  requestId: string,
  reason: string
): Promise<KycRequestResponse> {
  return jsonFetch<KycRequestResponse>(
    `/api/admin/kyc/requests/${encodeURIComponent(requestId)}/reject`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function revokeAdminIdentity(walletAddress: string): Promise<InvestorStatusResponse> {
  return jsonFetch<InvestorStatusResponse>(
    `/api/admin/identities/${encodeURIComponent(walletAddress)}/revoke`,
    authorizedRequest({ method: "POST" })
  );
}

export async function listAdminAuditEvents(
  filters: { walletAddress?: string; requestId?: string; limit?: number } = {}
): Promise<AuditEventResponse[]> {
  return jsonFetch<AuditEventResponse[]>(
    `/api/admin/audit-events${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function listAdminAssetOfferings(
  filters: { status?: AssetOfferingStatus | ""; limit?: number } = {}
): Promise<AssetOfferingResponse[]> {
  return jsonFetch<AssetOfferingResponse[]>(
    `/api/admin/assets${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function createAdminAssetOffering(
  request: AssetOfferingCreateRequest
): Promise<AssetOfferingResponse> {
  return jsonFetch<AssetOfferingResponse>(
    "/api/admin/assets",
    authorizedRequest({
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminInvestorComplianceProfile(
  walletAddress: string
): Promise<InvestorComplianceProfileResponse> {
  return jsonFetch<InvestorComplianceProfileResponse>(
    `/api/admin/investors/${encodeURIComponent(walletAddress)}/compliance-profile`,
    authorizedRequest()
  );
}

export async function updateAdminInvestorComplianceProfile(
  walletAddress: string,
  request: InvestorComplianceProfileUpdateRequest
): Promise<InvestorComplianceProfileResponse> {
  return jsonFetch<InvestorComplianceProfileResponse>(
    `/api/admin/investors/${encodeURIComponent(walletAddress)}/compliance-profile`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminAssetComplianceRules(
  assetId: string
): Promise<AssetComplianceRulesResponse> {
  return jsonFetch<AssetComplianceRulesResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/compliance-rules`,
    authorizedRequest()
  );
}

export async function updateAdminAssetComplianceRules(
  assetId: string,
  request: AssetComplianceRulesUpdateRequest
): Promise<AssetComplianceRulesResponse> {
  return jsonFetch<AssetComplianceRulesResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/compliance-rules`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminAssetPauseStatus(assetId: string): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/pause`,
    authorizedRequest()
  );
}

export async function pauseAdminAssetToken(assetId: string): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/pause`,
    authorizedRequest({ method: "POST" })
  );
}

export async function unpauseAdminAssetToken(assetId: string): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/unpause`,
    authorizedRequest({ method: "POST" })
  );
}

export async function listAdminSubscriptions(
  filters: { status?: LifecycleStatus | ""; assetId?: string; walletAddress?: string; limit?: number } = {}
): Promise<SubscriptionResponse[]> {
  return jsonFetch<SubscriptionResponse[]>(
    `/api/admin/subscriptions${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function approveAdminSubscription(
  subscriptionId: string,
  reason?: string
): Promise<SubscriptionResponse> {
  return jsonFetch<SubscriptionResponse>(
    `/api/admin/subscriptions/${encodeURIComponent(subscriptionId)}/approve`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function rejectAdminSubscription(
  subscriptionId: string,
  reason?: string
): Promise<SubscriptionResponse> {
  return jsonFetch<SubscriptionResponse>(
    `/api/admin/subscriptions/${encodeURIComponent(subscriptionId)}/reject`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function listAdminRedemptions(
  filters: { status?: LifecycleStatus | ""; assetId?: string; walletAddress?: string; limit?: number } = {}
): Promise<RedemptionResponse[]> {
  return jsonFetch<RedemptionResponse[]>(
    `/api/admin/redemptions${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function approveAdminRedemption(
  redemptionId: string,
  reason?: string
): Promise<RedemptionResponse> {
  return jsonFetch<RedemptionResponse>(
    `/api/admin/redemptions/${encodeURIComponent(redemptionId)}/approve`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function rejectAdminRedemption(
  redemptionId: string,
  reason?: string
): Promise<RedemptionResponse> {
  return jsonFetch<RedemptionResponse>(
    `/api/admin/redemptions/${encodeURIComponent(redemptionId)}/reject`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function listAdminBlockchainTransactions(
  filters: { walletAddress?: string; transactionType?: string; status?: string; limit?: number } = {}
): Promise<BlockchainTransactionResponse[]> {
  return jsonFetch<BlockchainTransactionResponse[]>(
    `/api/admin/blockchain-transactions${queryString(filters)}`,
    authorizedRequest()
  );
}

export async function fetchAdminOperationsReport(): Promise<OperationsReportResponse> {
  return jsonFetch<OperationsReportResponse>("/api/admin/reports/operations", authorizedRequest());
}

export async function fetchOracleFeed(): Promise<OracleFeedResponse> {
  return jsonFetch<OracleFeedResponse>("/api/integrations/oracle-feed", authorizedRequest());
}

export async function fetchRegulatoryFeed(): Promise<RegulatoryFeedResponse> {
  return jsonFetch<RegulatoryFeedResponse>("/api/integrations/regulatory-feed", authorizedRequest());
}
