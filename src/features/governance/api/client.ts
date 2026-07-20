export {
  approveAdminKycRequest,
  approveAdminRedemption,
  approveAdminSubscription,
  createAdminAssetOffering,
  fetchAdminAssetPauseStatus,
  fetchAdminOperationsReport,
  fetchOracleFeed,
  grantAssetInvestorAccess,
  listAdminAssetOfferings,
  listAdminAuditEvents,
  listAdminBlockchainTransactions,
  listAdminKycRequests,
  listAdminRedemptions,
  listAdminSubscriptions,
  listAssetInvestorAccess,
  pauseAdminAssetToken,
  publishAdminAssetOffering,
  rejectAdminKycRequest,
  rejectAdminRedemption,
  rejectAdminSubscription,
  revokeAdminIdentity,
  revokeAssetInvestorAccess,
  unpauseAdminAssetToken,
  updateAdminAssetComplianceRules,
  updateAdminAssetOffering
} from "@/features/admin/api/client";

import { jsonFetch, authorizedRequest } from "@/shared/api/http";
import type { ForceSyncResponse, InvestorStatusResponse } from "@/shared/api/types";

/** Governance staff read of investor status (subscription gating, case review). */
export async function fetchInvestorStatusForGovernance(
  walletAddress: string
): Promise<InvestorStatusResponse> {
  return jsonFetch<InvestorStatusResponse>(
    `/api/investors/${encodeURIComponent(walletAddress)}/status`,
    authorizedRequest()
  );
}

export async function initiateForceSync(request: {
  requestId?: string;
  walletAddress: string;
  reasonCode: string;
  incidentTicketId: string;
}): Promise<ForceSyncResponse> {
  return jsonFetch<ForceSyncResponse>(
    "/api/admin/force-sync/requests",
    authorizedRequest({
      method: "POST",
      body: JSON.stringify(request)
    })
  );
}

export async function approveForceSync(
  syncId: string,
  identityHash: string
): Promise<ForceSyncResponse> {
  return jsonFetch<ForceSyncResponse>(
    `/api/admin/force-sync/requests/${encodeURIComponent(syncId)}/approve`,
    authorizedRequest({
      method: "POST",
      body: JSON.stringify({ identityHash })
    })
  );
}
