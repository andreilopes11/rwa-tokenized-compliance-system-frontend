"use client";

import { useEffect, useState } from "react";
import {
  listAdminAuditEvents,
  listAdminBlockchainTransactions
} from "@/features/governance/api/client";
import type { AuditEventResponse, BlockchainTransactionResponse } from "@/shared/api/types";
import { explorerLink } from "@/shared/lib/web3";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";

/** SA-S12 — Audit read (timeline + on-chain activity + export). Read-only, no write controls. */
export function SaAuditScreen() {
  const [wallet, setWallet] = useState("");
  const [action, setAction] = useState("");
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransactionResponse[]>([]);
  const [error, setError] = useState("");
  const [exportInfo, setExportInfo] = useState<{ id: string; hash: string } | null>(null);

  async function refresh() {
    const [auditEvents, txs] = await Promise.all([
      listAdminAuditEvents({ walletAddress: wallet.trim() || undefined, limit: 100 }),
      listAdminBlockchainTransactions({ limit: 100 })
    ]);
    setEvents(auditEvents);
    setTransactions(txs);
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load audit data.")
    );
  }, []);

  const filtered = action.trim()
    ? events.filter((e) => e.action.toLowerCase().includes(action.toLowerCase()))
    : events;

  async function generateExport() {
    setError("");
    try {
      const all = await listAdminAuditEvents({ limit: 500 });
      const payload = JSON.stringify(all);
      const id = crypto.randomUUID();
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setExportInfo({ id, hash: `0x${hash.slice(0, 64)}` });
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `vaultguard-audit-${id}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    }
  }

  return (
    <WorkspacePanel
      actions={
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      }
      screenId="SA-S12"
      title="Audit"
    >
      {error ? <Alert tone="error">{error}</Alert> : null}

      <div className="filter-row">
        <div className="field">
          <label htmlFor="filter-wallet">Wallet</label>
          <input id="filter-wallet" onChange={(e) => setWallet(e.target.value)} value={wallet} />
        </div>
        <div className="field">
          <label htmlFor="filter-action">Action contains</label>
          <input id="filter-action" onChange={(e) => setAction(e.target.value)} value={action} />
        </div>
      </div>

      <h2>Timeline</h2>
      {filtered.length === 0 ? (
        <EmptyState>No audit events match the current filters.</EmptyState>
      ) : null}
      <ul className="activity-list">
        {filtered.map((event) => (
          <li key={event.eventId}>
            <div>
              <strong>{event.action}</strong>
              <p className="muted">
                {event.actor} · {event.walletAddress ?? "—"}
              </p>
            </div>
            <span className={`status ${statusClass(event.outcome)}`}>{statusLabel(event.outcome)}</span>
          </li>
        ))}
      </ul>

      <h2>On-chain activity</h2>
      {transactions.length === 0 ? (
        <EmptyState>No on-chain transactions recorded yet.</EmptyState>
      ) : null}
      <ul className="activity-list">
        {transactions.map((tx) => (
          <li key={tx.transactionId}>
            <div>
              <strong>{tx.transactionType}</strong>
              <p className="muted">{tx.walletAddress}</p>
              {tx.transactionHash ? (
                <a
                  className="mono external-link"
                  href={explorerLink("tx", tx.transactionHash) ?? undefined}
                  rel="noreferrer"
                  target="_blank"
                >
                  {tx.transactionHash}
                </a>
              ) : null}
            </div>
            <span className={`status ${statusClass(tx.status)}`}>{statusLabel(tx.status)}</span>
          </li>
        ))}
      </ul>

      <div className="secondary-panel">
        <h2>Compliance export</h2>
        <p className="muted">
          Download a JSON manifest with a SHA-256 integrity hash for regulator evidence packs.
        </p>
        {exportInfo ? (
          <Alert tone="success">
            Export <span className="mono">{exportInfo.id}</span> · integrity{" "}
            <span className="mono">{exportInfo.hash}</span>
          </Alert>
        ) : null}
        <Button onClick={() => void generateExport()}>Generate export</Button>
      </div>
    </WorkspacePanel>
  );
}
