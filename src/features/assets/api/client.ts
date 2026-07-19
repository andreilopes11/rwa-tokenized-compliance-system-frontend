import { jsonFetch, queryString } from "@/shared/api/http";
import type { AssetOfferingResponse, AssetOfferingStatus } from "@/shared/api/types";

/**
 * Investor marketplace catalog. ACL is session-bound (JWT + X-Investor-Wallet via BFF).
 * Never send walletAddress / identityHash probe params — BR-15.
 */
export async function fetchAssetOfferings(
  filters: {
    status?: AssetOfferingStatus | "";
    limit?: number;
  } = {}
): Promise<AssetOfferingResponse[]> {
  return jsonFetch<AssetOfferingResponse[]>(`/api/assets${queryString(filters)}`);
}
