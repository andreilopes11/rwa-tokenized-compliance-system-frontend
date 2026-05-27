"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAdminKycRequests } from "@/features/compliance/api/client";
import type { KycRequestResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { UpstreamUnavailableAlert } from "@/shared/ui/UpstreamUnavailableAlert";
import { isApiError } from "@/shared/api/errors";

/** CO-S02 — KYC Queue */
export function CoKycQueueScreen() {
  const [requests, setRequests] = useState<KycRequestResponse[]>([]);
  const [gatewayError, setGatewayError] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setGatewayError(false);
    setError("");
    try {
      setRequests(await listAdminKycRequests({ limit: 50 }));
    } catch (err) {
      if (isApiError(err) && err.retryable) {
        setGatewayError(true);
        return;
      }
      setError(err instanceof Error ? err.message : "Unable to load queue.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="panel" data-screen-id="CO-S02">
      <div className="panel-head">
        <h1>KYC queue</h1>
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      </div>
      {gatewayError ? <UpstreamUnavailableAlert onRetry={() => void refresh()} /> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      {requests.length === 0 ? (
        <p className="muted">No KYC requests.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Status</th>
              <th>Chain tx</th>
              <th>Updated</th>
              <th>Case</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.requestId}>
                <td className="mono">{request.walletAddress}</td>
                <td>
                  <span className={`status ${statusClass(request.status)}`}>
                    {statusLabel(request.status)}
                  </span>
                </td>
                <td className="mono">{request.transactionHash ?? "—"}</td>
                <td>{new Date(request.updatedAt).toLocaleString()}</td>
                <td>
                  <Link href={`/compliance/kyc/${request.requestId}`}>Review</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
