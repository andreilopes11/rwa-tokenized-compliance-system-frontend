"use client";

import { useEffect, useState } from "react";
import { fetchAdminOperationsReport } from "@/features/governance/api/client";
import type { OperationsReportResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";

/** SA-S07 — Operations report */
export function SaOperationsScreen() {
  const [report, setReport] = useState<OperationsReportResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchAdminOperationsReport()
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load report."));
  }, []);

  return (
    <WorkspacePanel screenId="SA-S07" title="Operations report">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {report ? (
        <dl className="definition-grid">
          <div>
            <dt>Active assets</dt>
            <dd>{report.activeAssets}</dd>
          </div>
          <div>
            <dt>Pending subscriptions</dt>
            <dd>{report.pendingSubscriptions}</dd>
          </div>
          <div>
            <dt>Pending redemptions</dt>
            <dd>{report.pendingRedemptions}</dd>
          </div>
          <div>
            <dt>Failed transactions</dt>
            <dd>{report.failedTransactions}</dd>
          </div>
          <div>
            <dt>Summary</dt>
            <dd>{report.summary}</dd>
          </div>
        </dl>
      ) : (
        <p className="muted">Loading…</p>
      )}
    </WorkspacePanel>
  );
}
