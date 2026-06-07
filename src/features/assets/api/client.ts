import { jsonFetch, queryString } from "@/shared/api/http";
import type { AssetOfferingResponse, AssetOfferingStatus } from "@/shared/api/types";

export async function fetchAssetOfferings(
  filters: {
    status?: AssetOfferingStatus | "";
    walletAddress?: string;
    identityHash?: string;
    limit?: number;
  } = {}
): Promise<AssetOfferingResponse[]> {
  return jsonFetch<AssetOfferingResponse[]>(`/api/assets${queryString(filters)}`);
}
