"use client";

import { useEffect, useState } from "react";
import { listAdminAuditEvents } from "@/features/audit/api/client";
import type { AuditEventResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

/** AU-S01 — Audit timeline (read-only, no write controls) */
export function AuTimelineScreen() {
  const [wallet, setWallet] = useState("");
  const [action, setAction] = useState("");
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    setEvents(
      await listAdminAuditEvents({
        walletAddress: wallet.trim() || undefined,
        limit: 100
      })
    );
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load timeline.")
    );
  }, []);

  const filtered = action.trim()
    ? events.filter((e) => e.action.toLowerCase().includes(action.toLowerCase()))
    : events;

  return (
    <div className="panel" data-screen-id="AU-S01">
      <div className="panel-head">
        <h1>Audit timeline</h1>
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      </div>
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
      {error ? <Alert tone="error">{error}</Alert> : null}
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
    </div>
  );
}
