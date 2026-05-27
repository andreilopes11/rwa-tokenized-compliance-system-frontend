export {
  approveAdminKycRequest,
  approveAdminRedemption,
  approveAdminSubscription,
  fetchAdminInvestorComplianceProfile,
  listAdminAuditEvents,
  listAdminKycRequests,
  listAdminRedemptions,
  listAdminSubscriptions,
  rejectAdminKycRequest,
  rejectAdminRedemption,
  rejectAdminSubscription,
  revokeAdminIdentity
} from "@/features/admin/api/client";

import { jsonFetch, authorizedRequest } from "@/shared/api/http";
import type { InvestorStatusResponse } from "@/shared/api/types";

export async function fetchComplianceInvestorStatus(
  walletAddress: string
): Promise<InvestorStatusResponse> {
  return jsonFetch<InvestorStatusResponse>(
    `/api/investors/${encodeURIComponent(walletAddress)}/status`,
    authorizedRequest()
  );
}
