"use client";

import { useEffect, useState } from "react";
import { listAdminAuditEvents, listAdminBlockchainTransactions } from "@/features/admin/api/client";
import type { AuditEventResponse, BlockchainTransactionResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { WorkspaceNav } from "@/shared/ui/WorkspaceNav";

export function AuditWorkspace() {
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransactionResponse[]>([]);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function refresh() {
    const [auditEvents, txs] = await Promise.all([
      listAdminAuditEvents({ limit: 50 }),
      listAdminBlockchainTransactions({ limit: 50 })
    ]);
    setEvents(auditEvents);
    setTransactions(txs);
  }

  useEffect(() => {
    void refresh().catch((err) => setError(err instanceof Error ? err.message : "Unable to load audit data."));
  }, []);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=audit";
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title="Audit workspace"
        subtitle="Read-only timeline of compliance decisions and chain outcomes"
        actions={<WorkspaceNav onSignOut={signOut} signingOut={signingOut} />}
      />
      <section className="content">
        {error ? <Alert tone="error">{error}</Alert> : null}
        <div className="panel">
          <div className="panel-head">
            <h2>Audit events</h2>
            <Button onClick={() => void refresh()} size="sm" variant="ghost">
              Refresh
            </Button>
          </div>
          {events.length === 0 ? (
            <p className="muted">No audit events.</p>
          ) : (
            <ul className="activity-list">
              {events.map((event) => (
                <li key={event.eventId}>
                  <div>
                    <strong>{event.action}</strong>
                    <p className="muted">{event.message ?? "No message"}</p>
                  </div>
                  <span className={`status ${statusClass(event.outcome)}`}>{statusLabel(event.outcome)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h2>Blockchain transactions</h2>
          {transactions.length === 0 ? (
            <p className="muted">No transactions.</p>
          ) : (
            <ul className="activity-list">
              {transactions.map((tx) => (
                <li key={tx.transactionId}>
                  <div>
                    <strong>{tx.transactionType}</strong>
                    <p className="muted">{tx.transactionHash}</p>
                  </div>
                  <span className={`status ${statusClass(tx.status)}`}>{statusLabel(tx.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
