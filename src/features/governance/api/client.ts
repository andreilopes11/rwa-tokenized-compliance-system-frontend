export {
  createAdminAssetOffering,
  fetchAdminAssetPauseStatus,
  fetchAdminOperationsReport,
  fetchOracleFeed,
  grantAssetInvestorAccess,
  listAdminAssetOfferings,
  listAssetInvestorAccess,
  pauseAdminAssetToken,
  publishAdminAssetOffering,
  revokeAssetInvestorAccess,
  unpauseAdminAssetToken,
  updateAdminAssetComplianceRules,
  updateAdminAssetOffering
} from "@/features/admin/api/client";

import { jsonFetch, authorizedRequest } from "@/shared/api/http";
import type { ForceSyncResponse } from "@/shared/api/types";

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
