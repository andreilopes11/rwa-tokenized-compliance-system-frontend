import { adminRequest, jsonFetch, queryString } from "@/shared/api/http";
import type {
  AssetComplianceRulesResponse,
  AssetComplianceRulesUpdateRequest,
  AssetOfferingCreateRequest,
  AssetOfferingResponse,
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
  adminToken: string,
  filters: { status?: KycStatus | ""; walletAddress?: string; limit?: number } = {}
): Promise<KycRequestResponse[]> {
  return jsonFetch<KycRequestResponse[]>(
    `/api/admin/kyc/requests${queryString(filters)}`,
    adminRequest(adminToken)
  );
}

export async function approveAdminKycRequest(
  adminToken: string,
  requestId: string
): Promise<KycRequestResponse> {
  return jsonFetch<KycRequestResponse>(
    `/api/admin/kyc/requests/${encodeURIComponent(requestId)}/approve`,
    adminRequest(adminToken, { method: "POST" })
  );
}

export async function rejectAdminKycRequest(
  adminToken: string,
  requestId: string,
  reason: string
): Promise<KycRequestResponse> {
  return jsonFetch<KycRequestResponse>(
    `/api/admin/kyc/requests/${encodeURIComponent(requestId)}/reject`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function revokeAdminIdentity(
  adminToken: string,
  walletAddress: string
): Promise<InvestorStatusResponse> {
  return jsonFetch<InvestorStatusResponse>(
    `/api/admin/identities/${encodeURIComponent(walletAddress)}/revoke`,
    adminRequest(adminToken, { method: "POST" })
  );
}

export async function listAdminAuditEvents(
  adminToken: string,
  filters: { walletAddress?: string; requestId?: string; limit?: number } = {}
): Promise<AuditEventResponse[]> {
  return jsonFetch<AuditEventResponse[]>(
    `/api/admin/audit-events${queryString(filters)}`,
    adminRequest(adminToken)
  );
}

export async function createAdminAssetOffering(
  adminToken: string,
  request: AssetOfferingCreateRequest
): Promise<AssetOfferingResponse> {
  return jsonFetch<AssetOfferingResponse>(
    "/api/admin/assets",
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminInvestorComplianceProfile(
  adminToken: string,
  walletAddress: string
): Promise<InvestorComplianceProfileResponse> {
  return jsonFetch<InvestorComplianceProfileResponse>(
    `/api/admin/investors/${encodeURIComponent(walletAddress)}/compliance-profile`,
    adminRequest(adminToken)
  );
}

export async function updateAdminInvestorComplianceProfile(
  adminToken: string,
  walletAddress: string,
  request: InvestorComplianceProfileUpdateRequest
): Promise<InvestorComplianceProfileResponse> {
  return jsonFetch<InvestorComplianceProfileResponse>(
    `/api/admin/investors/${encodeURIComponent(walletAddress)}/compliance-profile`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminAssetComplianceRules(
  adminToken: string,
  assetId: string
): Promise<AssetComplianceRulesResponse> {
  return jsonFetch<AssetComplianceRulesResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/compliance-rules`,
    adminRequest(adminToken)
  );
}

export async function updateAdminAssetComplianceRules(
  adminToken: string,
  assetId: string,
  request: AssetComplianceRulesUpdateRequest
): Promise<AssetComplianceRulesResponse> {
  return jsonFetch<AssetComplianceRulesResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/compliance-rules`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function fetchAdminAssetPauseStatus(
  adminToken: string,
  assetId: string
): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/pause`,
    adminRequest(adminToken)
  );
}

export async function pauseAdminAssetToken(
  adminToken: string,
  assetId: string
): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/pause`,
    adminRequest(adminToken, { method: "POST" })
  );
}

export async function unpauseAdminAssetToken(
  adminToken: string,
  assetId: string
): Promise<PauseStatusResponse> {
  return jsonFetch<PauseStatusResponse>(
    `/api/admin/assets/${encodeURIComponent(assetId)}/unpause`,
    adminRequest(adminToken, { method: "POST" })
  );
}

export async function listAdminSubscriptions(
  adminToken: string,
  filters: { status?: LifecycleStatus | ""; assetId?: string; walletAddress?: string; limit?: number } = {}
): Promise<SubscriptionResponse[]> {
  return jsonFetch<SubscriptionResponse[]>(
    `/api/admin/subscriptions${queryString(filters)}`,
    adminRequest(adminToken)
  );
}

export async function approveAdminSubscription(
  adminToken: string,
  subscriptionId: string,
  reason?: string
): Promise<SubscriptionResponse> {
  return jsonFetch<SubscriptionResponse>(
    `/api/admin/subscriptions/${encodeURIComponent(subscriptionId)}/approve`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function rejectAdminSubscription(
  adminToken: string,
  subscriptionId: string,
  reason?: string
): Promise<SubscriptionResponse> {
  return jsonFetch<SubscriptionResponse>(
    `/api/admin/subscriptions/${encodeURIComponent(subscriptionId)}/reject`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function listAdminRedemptions(
  adminToken: string,
  filters: { status?: LifecycleStatus | ""; assetId?: string; walletAddress?: string; limit?: number } = {}
): Promise<RedemptionResponse[]> {
  return jsonFetch<RedemptionResponse[]>(
    `/api/admin/redemptions${queryString(filters)}`,
    adminRequest(adminToken)
  );
}

export async function approveAdminRedemption(
  adminToken: string,
  redemptionId: string,
  reason?: string
): Promise<RedemptionResponse> {
  return jsonFetch<RedemptionResponse>(
    `/api/admin/redemptions/${encodeURIComponent(redemptionId)}/approve`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function rejectAdminRedemption(
  adminToken: string,
  redemptionId: string,
  reason?: string
): Promise<RedemptionResponse> {
  return jsonFetch<RedemptionResponse>(
    `/api/admin/redemptions/${encodeURIComponent(redemptionId)}/reject`,
    adminRequest(adminToken, {
      method: "POST",
      body: JSON.stringify({ reason })
    })
  );
}

export async function listAdminBlockchainTransactions(
  adminToken: string,
  filters: { walletAddress?: string; transactionType?: string; status?: string; limit?: number } = {}
): Promise<BlockchainTransactionResponse[]> {
  return jsonFetch<BlockchainTransactionResponse[]>(
    `/api/admin/blockchain-transactions${queryString(filters)}`,
    adminRequest(adminToken)
  );
}

export async function fetchAdminOperationsReport(
  adminToken: string
): Promise<OperationsReportResponse> {
  return jsonFetch<OperationsReportResponse>(
    "/api/admin/reports/operations",
    adminRequest(adminToken)
  );
}

export async function fetchOracleFeed(): Promise<OracleFeedResponse> {
  return jsonFetch<OracleFeedResponse>("/api/integrations/oracle-feed");
}

export async function fetchRegulatoryFeed(): Promise<RegulatoryFeedResponse> {
  return jsonFetch<RegulatoryFeedResponse>("/api/integrations/regulatory-feed");
}
