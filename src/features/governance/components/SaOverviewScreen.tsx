"use client";

import { useEffect, useState } from "react";
import {
  fetchAdminOperationsReport,
  fetchOracleFeed,
  listAdminAssetOfferings
} from "@/features/governance/api/client";
import type { OperationsReportResponse, OracleFeedResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { UpstreamUnavailableAlert } from "@/shared/ui/UpstreamUnavailableAlert";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";
import { isApiError } from "@/shared/api/errors";

/** SA-S01 — Governance Overview */
export function SaOverviewScreen() {
  const [report, setReport] = useState<OperationsReportResponse | null>(null);
  const [oracle, setOracle] = useState<OracleFeedResponse | null>(null);
  const [pausedCount, setPausedCount] = useState(0);
  const [gatewayError, setGatewayError] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setGatewayError(false);
    setError("");
    try {
      const [ops, feed, assets] = await Promise.all([
        fetchAdminOperationsReport(),
        fetchOracleFeed(),
        listAdminAssetOfferings({ limit: 50 })
      ]);
      setReport(ops);
      setOracle(feed);
      setPausedCount(assets.filter((a) => a.status === "PAUSED").length);
    } catch (err) {
      if (isApiError(err) && err.retryable) {
        setGatewayError(true);
      } else {
        setError(err instanceof Error ? err.message : "Unable to load governance overview.");
      }
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <WorkspacePanel screenId="SA-S01" title="Governance overview">
      {gatewayError ? <UpstreamUnavailableAlert onRetry={() => void load()} /> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div className="metric-grid">
        <div className="metric">
          <span>Failed chain txs (24h)</span>
          <strong>{report?.failedTransactions ?? "—"}</strong>
        </div>
        <div className="metric">
          <span>Oracle status</span>
          <strong>{oracle?.status ?? "—"}</strong>
        </div>
        <div className="metric">
          <span>Paused assets</span>
          <strong>{pausedCount}</strong>
        </div>
      </div>
      {oracle?.status === "STUB" ? (
        <Alert tone="warning">Oracle feed is in STUB mode — not production attestation.</Alert>
      ) : null}
    </WorkspacePanel>
  );
}
