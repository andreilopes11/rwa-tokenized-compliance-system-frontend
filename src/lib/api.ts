export type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED" | "FAILED_ON_CHAIN";
export type AssetOfferingStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
export type LifecycleStatus = "PENDING" | "APPROVED" | "REJECTED" | "FAILED_ON_CHAIN";
export type InvestorType = "RETAIL" | "ACCREDITED" | "QUALIFIED" | "INSTITUTIONAL";

export type KycRequestResponse = {
  requestId: string;
  walletAddress: string;
  identityHash: string;
  status: KycStatus;
  transactionHash: string | null;
  submittedAt: string;
  updatedAt: string;
  message: string;
};

export type InvestorStatusResponse = {
  walletAddress: string;
  status: KycStatus;
  onChainVerified: boolean;
  requestId: string | null;
  identityHash: string | null;
  transactionHash: string | null;
  message: string;
};

export type AuditEventResponse = {
  eventId: string;
  category: string;
  action: string;
  actor: string;
  targetType: string;
  targetId: string | null;
  walletAddress: string | null;
  requestId: string | null;
  metadataHash: string | null;
  transactionHash: string | null;
  outcome: string;
  message: string | null;
  createdAt: string;
};

export type AssetOfferingResponse = {
  assetId: string;
  name: string;
  symbol: string;
  assetType: string;
  jurisdiction: string;
  status: AssetOfferingStatus;
  supplyCap: number;
  navPrice: number;
  issuerName: string;
  issuerMetadata: string | null;
  tokenAddress: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetOfferingCreateRequest = {
  name: string;
  symbol: string;
  assetType: string;
  jurisdiction: string;
  status: AssetOfferingStatus;
  supplyCap: number;
  navPrice: number;
  issuerName: string;
  issuerMetadata?: string;
  tokenAddress?: string;
};

export type LifecycleRequestCreateRequest = {
  walletAddress: string;
  amount: number;
};

export type SubscriptionResponse = {
  subscriptionId: string;
  assetId: string;
  walletAddress: string;
  amount: number;
  status: LifecycleStatus;
  transactionHash: string | null;
  decisionReason: string | null;
  requestedAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  message: string;
};

export type RedemptionResponse = {
  redemptionId: string;
  assetId: string;
  walletAddress: string;
  amount: number;
  status: LifecycleStatus;
  transactionHash: string | null;
  decisionReason: string | null;
  requestedAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  message: string;
};

export type PositionResponse = {
  positionId: string;
  assetId: string;
  walletAddress: string;
  balanceSnapshot: number;
  lastChainSync: string | null;
  updatedAt: string;
};

export type PauseStatusResponse = {
  tokenAddress: string | null;
  paused: boolean;
  transactionHash: string | null;
};

export type InvestorComplianceProfileResponse = {
  walletAddress: string;
  investorType: InvestorType;
  jurisdiction: string;
  accredited: boolean;
  qualifiedInvestor: boolean;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InvestorComplianceProfileUpdateRequest = {
  investorType: InvestorType;
  jurisdiction: string;
  accredited: boolean;
  qualifiedInvestor: boolean;
  revoked: boolean;
};

export type AssetComplianceRulesResponse = {
  assetId: string;
  allowedInvestorTypes: InvestorType[];
  allowedJurisdictions: string[];
  requiresAccreditation: boolean;
  requiresQualifiedInvestor: boolean;
  lockupDays: number;
  maxPositionAmount: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetComplianceRulesUpdateRequest = {
  allowedInvestorTypes: InvestorType[];
  allowedJurisdictions: string[];
  requiresAccreditation: boolean;
  requiresQualifiedInvestor: boolean;
  lockupDays: number;
  maxPositionAmount?: number | null;
};

export type FeeQuoteRequest = {
  assetId?: string;
  walletAddress?: string;
  lifecycleType: "SUBSCRIPTION" | "REDEMPTION";
  amount: number;
  currency?: string;
};

export type FeeQuoteResponse = {
  quoteId: string;
  walletAddress: string | null;
  assetId: string | null;
  lifecycleType: string;
  amount: number;
  currency: string;
  platformFee: number;
  networkFeeEstimate: number;
  regulatoryFee: number;
  totalFees: number;
  totalAmount: number;
  disclaimer: string;
  createdAt: string;
};

export type PositionValueResponse = {
  assetId: string;
  assetName: string;
  symbol: string;
  balance: number;
  navPrice: number;
  value: number;
  valueSecondary: number;
  updatedAt: string;
};

export type FinancialSummaryResponse = {
  walletAddress: string;
  baseCurrency: string;
  secondaryCurrency: string;
  totalValue: number;
  totalValueSecondary: number;
  fxRate: number;
  positions: PositionValueResponse[];
  disclaimer: string;
  asOf: string;
};

export type TaxSummaryResponse = {
  walletAddress: string;
  jurisdiction: string;
  currency: string;
  portfolioValue: number;
  estimatedWithholding: number;
  taxableEventsCount: number;
  summary: string;
  disclaimer: string;
  generatedAt: string;
};

export type NotificationResponse = {
  notificationId: string;
  walletAddress: string | null;
  category: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  readAt: string | null;
};

export type TutorialResponse = {
  tutorialId: string;
  title: string;
  description: string;
  steps: string[];
};

export type OracleFeedResponse = {
  provider: string;
  status: string;
  baseCurrency: string;
  navIndex: number;
  feeds: string[];
  message: string;
  observedAt: string;
};

export type RegulatoryFeedResponse = {
  provider: string;
  status: string;
  summary: string;
  controls: string[];
  observedAt: string;
};

export type CrossChainValidationRequest = {
  walletAddress: string;
  tokenAddress: string;
  sourceChain: string;
  targetChain: string;
  amount: number;
};

export type CrossChainValidationResponse = {
  valid: boolean;
  status: string;
  checks: string[];
  disclaimer: string;
  validatedAt: string;
};

export type BlockchainTransactionResponse = {
  transactionId: string;
  chainId: number;
  transactionHash: string;
  transactionType: string;
  walletAddress: string;
  requestId: string | null;
  status: string;
  message: string;
  submittedAt: string;
  confirmedAt: string | null;
};

export type OperationsReportResponse = {
  activeAssets: number;
  pendingSubscriptions: number;
  pendingRedemptions: number;
  monitoredTransactions: number;
  failedTransactions: number;
  autoPauseMode: string;
  summary: string;
  generatedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

export function isWalletAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function shortenAddress(value: string | null | undefined): string {
  if (!value) {
    return "Not connected";
  }
  if (!isWalletAddress(value)) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function statusLabel(status: string | null | undefined): string {
  if (!status) {
    return "PENDING";
  }
  return status.replaceAll("_", " ");
}

export function statusClass(status: string | null | undefined): string {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "REVOKED":
      return "revoked";
    case "FAILED_ON_CHAIN":
      return "failed";
    default:
      return "pending";
  }
}

export async function submitKycRequest(
  walletAddress: string,
  documentReference: string
): Promise<KycRequestResponse> {
  return jsonFetch<KycRequestResponse>("/api/kyc/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, documentReference })
  });
}

export async function fetchInvestorStatus(walletAddress: string): Promise<InvestorStatusResponse> {
  return jsonFetch<InvestorStatusResponse>(
    `/api/investors/${encodeURIComponent(walletAddress)}/status`
  );
}

export async function fetchAssetOfferings(
  filters: { status?: AssetOfferingStatus | ""; limit?: number } = {}
): Promise<AssetOfferingResponse[]> {
  return jsonFetch<AssetOfferingResponse[]>(`/api/assets${queryString(filters)}`);
}

export async function fetchAssetOffering(assetId: string): Promise<AssetOfferingResponse> {
  return jsonFetch<AssetOfferingResponse>(`/api/assets/${encodeURIComponent(assetId)}`);
}

export async function createSubscription(
  assetId: string,
  request: LifecycleRequestCreateRequest
): Promise<SubscriptionResponse> {
  return jsonFetch<SubscriptionResponse>(
    `/api/assets/${encodeURIComponent(assetId)}/subscriptions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    }
  );
}

export async function createRedemption(
  assetId: string,
  request: LifecycleRequestCreateRequest
): Promise<RedemptionResponse> {
  return jsonFetch<RedemptionResponse>(
    `/api/assets/${encodeURIComponent(assetId)}/redemptions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    }
  );
}

export async function fetchInvestorPositions(walletAddress: string): Promise<PositionResponse[]> {
  return jsonFetch<PositionResponse[]>(
    `/api/investors/${encodeURIComponent(walletAddress)}/positions`
  );
}

export async function fetchFinancialSummary(walletAddress: string): Promise<FinancialSummaryResponse> {
  return jsonFetch<FinancialSummaryResponse>(
    `/api/investors/${encodeURIComponent(walletAddress)}/financial-summary`
  );
}

export async function fetchTaxSummary(walletAddress: string, locale = "pt"): Promise<TaxSummaryResponse> {
  return jsonFetch<TaxSummaryResponse>(
    `/api/investors/${encodeURIComponent(walletAddress)}/tax-summary?locale=${encodeURIComponent(locale)}`
  );
}

export async function quoteFees(request: FeeQuoteRequest): Promise<FeeQuoteResponse> {
  return jsonFetch<FeeQuoteResponse>("/api/fees/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
}

export async function fetchNotifications(walletAddress?: string): Promise<NotificationResponse[]> {
  return jsonFetch<NotificationResponse[]>(
    `/api/notifications${queryString({ walletAddress })}`
  );
}

export async function markNotificationRead(notificationId: string): Promise<NotificationResponse> {
  return jsonFetch<NotificationResponse>(
    `/api/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: "POST" }
  );
}

export async function fetchTutorials(locale = "pt"): Promise<TutorialResponse[]> {
  return jsonFetch<TutorialResponse[]>(`/api/tutorials?locale=${encodeURIComponent(locale)}`);
}

export async function fetchOracleFeed(): Promise<OracleFeedResponse> {
  return jsonFetch<OracleFeedResponse>("/api/integrations/oracle-feed");
}

export async function fetchRegulatoryFeed(): Promise<RegulatoryFeedResponse> {
  return jsonFetch<RegulatoryFeedResponse>("/api/integrations/regulatory-feed");
}

export async function validateCrossChain(
  request: CrossChainValidationRequest
): Promise<CrossChainValidationResponse> {
  return jsonFetch<CrossChainValidationResponse>("/api/integrations/cross-chain/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
}

export async function fetchInvestorAuditEvents(
  walletAddress: string,
  limit = 10
): Promise<AuditEventResponse[]> {
  return jsonFetch<AuditEventResponse[]>(
    `/api/investors/${encodeURIComponent(walletAddress)}/audit-events?limit=${limit}`
  );
}

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

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "same-origin",
    ...init
  });
  const payload = await response.json();

  if (!response.ok) {
    const messages = Array.isArray(payload.messages) ? payload.messages.join(" ") : response.statusText;
    throw new Error(messages || "Request failed.");
  }

  return payload as T;
}

function adminRequest(adminToken: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken,
      ...init.headers
    }
  };
}

function queryString(filters: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
