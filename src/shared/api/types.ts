export type KycStatus =
  | "PENDING"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED_PENDING_CHAIN"
  | "APPROVED"
  | "REJECTED"
  | "REVOKED"
  | "FAILED_ON_CHAIN";
export type AssetOfferingStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
export type AssetOfferingVisibility = "PUBLIC" | "PRIVATE";
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

export type TransferPreflightResponse = {
  allowed: boolean;
  reasonCode: string | null;
  message: string | null;
};

export type ForceSyncStatus =
  | "RETRY_SCHEDULED"
  | "PENDING_SECOND_APPROVAL"
  | "APPROVED"
  | "DENIED"
  | "FAILED";

export type ForceSyncResponse = {
  syncId: string;
  requestId: string | null;
  walletAddress: string;
  reasonCode: string;
  incidentTicketId: string | null;
  initiatedBy: string;
  approvedBy: string | null;
  status: ForceSyncStatus;
  transactionHash: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
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
  visibility: AssetOfferingVisibility;
  supplyCap: number;
  navPrice: number;
  issuerName: string;
  issuerMetadata: string | null;
  tokenAddress: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetOfferingCreateRequest = {
  name: string;
  symbol: string;
  assetType: string;
  jurisdiction: string;
  status: AssetOfferingStatus;
  visibility?: AssetOfferingVisibility;
  supplyCap: number;
  navPrice: number;
  issuerName: string;
  issuerMetadata?: string;
  tokenAddress?: string;
};

export type AssetOfferingUpdateRequest = {
  status?: AssetOfferingStatus;
  visibility?: AssetOfferingVisibility;
  name?: string;
  issuerMetadata?: string;
};

export type AssetInvestorAccessResponse = {
  accessId: string;
  assetId: string;
  identityHash: string;
  walletAddress: string | null;
  grantedBy: string;
  grantedAt: string;
};

export type AssetInvestorAccessGrantRequest = {
  identityHash: string;
  walletAddress?: string;
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
