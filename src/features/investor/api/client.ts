import { jsonFetch, queryString } from "@/shared/api/http";
import type {
  AuditEventResponse,
  FeeQuoteRequest,
  FeeQuoteResponse,
  FinancialSummaryResponse,
  InvestorStatusResponse,
  KycRequestResponse,
  LifecycleRequestCreateRequest,
  NotificationResponse,
  PositionResponse,
  RedemptionResponse,
  SubscriptionResponse,
  TaxSummaryResponse,
  TutorialResponse
} from "@/shared/api/types";

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

export async function fetchTaxSummary(walletAddress: string, locale = "en"): Promise<TaxSummaryResponse> {
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

export async function fetchTutorials(locale = "en"): Promise<TutorialResponse[]> {
  return jsonFetch<TutorialResponse[]>(`/api/tutorials?locale=${encodeURIComponent(locale)}`);
}

export async function fetchInvestorAuditEvents(
  walletAddress: string,
  limit = 10
): Promise<AuditEventResponse[]> {
  return jsonFetch<AuditEventResponse[]>(
    `/api/investors/${encodeURIComponent(walletAddress)}/audit-events?limit=${limit}`
  );
}
