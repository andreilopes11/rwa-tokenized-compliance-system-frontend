"use client";

import { useEffect, useMemo, useState } from "react";
import { listAdminKycRequests } from "@/features/compliance/api/client";
import type { KycRequestResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { UpstreamUnavailableAlert } from "@/shared/ui/UpstreamUnavailableAlert";
import { isApiError } from "@/shared/api/errors";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { resolveClientError } from "@/shared/i18n/resolveClientError";

/** CO-S01 — Compliance Dashboard */
export function CoDashboardScreen() {
  const { t } = useLocale();
  const [requests, setRequests] = useState<KycRequestResponse[]>([]);
  const [gatewayError, setGatewayError] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setGatewayError(false);
    setError("");
    try {
      setRequests(await listAdminKycRequests({ limit: 100 }));
    } catch (err) {
      if (isApiError(err) && err.retryable) {
        setGatewayError(true);
        return;
      }
      setError(err instanceof Error ? err.message : "Unable to load KPIs.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const kpis = useMemo(() => {
    const pending = requests.filter((r) =>
      ["SUBMITTED", "IN_REVIEW", "PENDING"].includes(r.status)
    ).length;
    const pendingChain = requests.filter((r) => r.status === "APPROVED_PENDING_CHAIN").length;
    const failedChain = requests.filter((r) => r.status === "FAILED_ON_CHAIN").length;
    return { pending, pendingChain, failedChain, total: requests.length };
  }, [requests]);

  return (
    <div className="panel" data-screen-id="CO-S01">
      <h1>Compliance dashboard</h1>
      {gatewayError ? <UpstreamUnavailableAlert onRetry={() => void load()} /> : null}
      {error ? <Alert tone="error">{resolveClientError(error, t)}</Alert> : null}
      <div className="metric-grid">
        <div className="metric">
          <span>Pending review</span>
          <strong>{kpis.pending}</strong>
        </div>
        <div className="metric">
          <span>Pending chain</span>
          <strong className={`status ${statusClass("PENDING")}`}>{kpis.pendingChain}</strong>
        </div>
        <div className="metric">
          <span>Chain errors</span>
          <strong className={`status ${statusClass("FAILED_ON_CHAIN")}`}>{kpis.failedChain}</strong>
        </div>
        <div className="metric">
          <span>Total cases</span>
          <strong>{kpis.total}</strong>
        </div>
      </div>
      <p className="muted">
        Open the KYC queue to review cases. Subscription and redemption queues are under their
        dedicated screens.
      </p>
      <ul className="activity-list">
        {requests.slice(0, 5).map((row) => (
          <li key={row.requestId}>
            <div>
              <strong className="mono">{row.walletAddress}</strong>
              <p className="muted">{row.message}</p>
            </div>
            <span className={`status ${statusClass(row.status)}`}>{statusLabel(row.status)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
